import OpticalCableMonitoringService from '@/pages/home/OpticalCableMonitoring/services';
import {
  OpticalCableMonitoringWaringStateToString,
  OpticalCableMonitoringWarning,
} from '@/pages/home/OpticalCableMonitoring/typings';
import { CesiumMapDialog } from '@/pages/mapResource/map-tools/CesiumMaterial';
import CoordTransforms from '@/pages/mapResource/map-tools/CoordinateTransform';
import { GetUserMapLayers } from '@/pages/mapResource/map-tools/MapLayersTyping';
import { flyToLocation, initViewer, MapEffects } from '@/pages/mapResource/map-tools/MapUtils';
import MapLayersDrawer from '@/pages/mapResource/map-widget/MapLayersDrawer';
import CommonSelectDialog from '@/pages/organize-manage/common';
import UserService from '@/pages/organize-manage/user/UserService';
import { useModel } from '@@/exports';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, List, message, Row } from 'antd';
import * as Cesium from 'cesium';
import { Cartesian3, Viewer } from 'cesium';
import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import { useSerialStore } from '@/pages/home/OpticalStore';

const OpticalCableMonitoringWaringPage: React.FC = () => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const viewerInstance = useRef<Viewer | null>(null);
  const { initialState } = useModel('@@initialState');
  //返回搜索数据
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OpticalCableMonitoringWarning[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');
  const [faultLinePrimitive, setFaultLinePrimitive] = useState<Cesium.Primitive>();
  const [openUserDialog, setOpenUserDialog] = useState<boolean>(false);
  const sendData = useSerialStore((s) => s.sendData);

  const init = async () => {
    if (viewerRef.current) {
      viewerInstance.current = initViewer(viewerRef.current);
      flyToLocation({
        viewer: viewerInstance.current,
        position: CoordTransforms.CartographicToCartesian3(
          initialState!.applicationConfig!.longitude,
          initialState!.applicationConfig!.latitude,
          80000,
        ),
      });
      const [opticalCableMonitoringModel, opticalWarnings] = await Promise.all([
        OpticalCableMonitoringService.getMainLineData(),
        OpticalCableMonitoringService.getOpticalCableMonitoringWaringModelList({ day: 10 }),
      ]);
      setData(opticalWarnings);

      const lines = opticalCableMonitoringModel.fiberLines.map((e) =>
        e.map(({ latitude, longitude }) => Cartesian3.fromDegrees(longitude, latitude, 0)),
      );
      const points = opticalCableMonitoringModel.dataCenterPoints.map((e) =>
        Cartesian3.fromDegrees(e.longitude, e.latitude, 0),
      );
      //效果设置·
      MapEffects.RoadShuttleEffects(viewerInstance.current, lines);
      MapEffects.PointEffects(
        viewerInstance.current,
        points,
        Cesium.Color.fromCssColorString('#13c100'),
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    init();
    setLoading(false);

    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (data.length > 0 && activeKey) {
      viewerInstance.current!.scene.primitives.remove(faultLinePrimitive);

      const item = data.find((e) => e.id === activeKey);
      if (item) {
        const faultLineMaterial = Cesium.Material.fromType('Color', {
          color: Cesium.Color.fromCssColorString('#ff0026'),
        });
        const faultLine = item.faultPath
          .filter((line) => line.length >= 2)
          .map((e) =>
            e.map(({ latitude, longitude }) => Cartesian3.fromDegrees(longitude, latitude, 1)),
          );

        setFaultLinePrimitive(
          MapEffects.RoadShuttleEffects(viewerInstance.current!, faultLine, faultLineMaterial)!,
        );

        if (
          item.faultPoint === undefined ||
          item.faultPoint.latitude === 0 ||
          item.faultPoint.longitude === 0
        ) {
          message.info('故障点坐标暂无');
        } else {
          flyToLocation({
            viewer: viewerInstance.current!,
            position: Cartesian3.fromDegrees(
              item.faultPoint!.longitude,
              item.faultPoint!.latitude,
              10000,
            ),
            showMark: true,
          });

          new CesiumMapDialog({
            viewer: viewerInstance.current!,
            position: Cartesian3.fromDegrees(item.faultPoint!.longitude, item.faultPoint!.latitude),
            title: item.cableName,
            content: item.faultInfo ?? '',
          });
        }
      }
    }
  }, [activeKey, data]);

  return (
    <>
      <Row gutter={16}>
        <Col
          span={6}
          style={{
            borderRight: '1px solid grey',
            padding: '10px',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Row align="middle" justify="start">
            <Button
              type="link" // 无边框
              size={'large'}
              icon={<ArrowLeftOutlined />} // 左箭头图标
              onClick={() => {
                history.push('/home/index');
              }}
            >
              返回
            </Button>
            <span style={{ marginLeft: '8px', fontSize: '18px' }}>故障详情</span>
          </Row>
          <List
            size="large"
            bordered
            dataSource={data}
            loading={loading}
            style={{ flex: 1, overflowY: 'auto', padding: '10px' }}
            renderItem={(e) => (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <Collapse
                    activeKey={activeKey}
                    onChange={() => setActiveKey(e.id!)}
                    accordion
                    items={[
                      {
                        key: e.id,
                        label: (
                          <span style={{ color: activeKey === e.id ? 'blue' : 'black' }}>
                            {`${e.cableName} (${OpticalCableMonitoringWaringStateToString(
                              e.state,
                            )})`}
                          </span>
                        ),
                        children: (
                          <>
                            <div style={{ textAlign: 'left' }}>
                              {[
                                '告警类型',
                                '光缆名称',
                                '状态',
                                '故障纤芯',
                                '故障点距离',
                                '发生时间',
                                '恢复时间',
                              ].map((label, index) => (
                                <div
                                  key={index}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    marginBottom: '8px',
                                  }}
                                >
                                  <span style={{ flex: 1, textAlign: 'right', marginRight: '8px' }}>
                                    {label}:
                                  </span>
                                  <span style={{ flex: 2, textAlign: 'left' }}>
                                    {
                                      [
                                        e.type,
                                        e.cableName,
                                        OpticalCableMonitoringWaringStateToString(e.state),
                                        e.fiberCoreName,
                                        e.distanceFromStartStation,
                                        e.createTime?.toLocaleString() || '',
                                        e.clearedTime?.toLocaleString() || '',
                                      ][index]
                                    }
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div>
                              <Button
                                type="primary"
                                onClick={() => {
                                  setOpenUserDialog(true);
                                }}
                                key="view1"
                                style={{ padding: 10 }}
                              >
                                发送通知
                              </Button>
                              <span style={{ margin: '0 10px' }}></span>
                              <Button
                                type="primary"
                                onClick={async () => {
                                  try {
                                    await OpticalCableMonitoringService.test(activeKey);
                                    message.success('发送成功');
                                  } catch (e) {
                                    message.error('发送失败');
                                  }
                                }}
                                key="view2"
                                style={{ padding: 10 }}
                              >
                                模拟故障
                              </Button>
                              <span style={{ margin: '0 10px' }}></span>
                              {
                                initialState?.applicationConfig?.opticalCableMonitoringWarningLight&&<Button
                                  type="primary"
                                  onClick={async () => {
                                    await sendData([0xA0, 0x07, 0x00, 0xA7]);
                                    await sendData([0xA0, 0x03, 0x02, 0xA5]);
                                    localStorage.setItem('currentIsQuiet', 'true');
                                  }}
                                  key="view3"
                                  style={{ padding: 10 }}
                                >
                                  静音
                                </Button>
                              }
                            </div>
                          </>
                        ),
                      },
                    ]}
                  />
                </div>
              </>
            )}
          />
        </Col>

        <Col span={18}>
          <div ref={viewerRef} style={{ height: '100vh', width: '100%' }}>
            <MapLayersDrawer viewer={viewerInstance.current!} baseMapLayers={GetUserMapLayers(3)} />
          </div>
        </Col>
      </Row>
      {openUserDialog && (
        <CommonSelectDialog
          open={openUserDialog}
          close={() => setOpenUserDialog(false)}
          userId={1}
          title={'用户'}
          initSelectedIds={[]}
          onSubmit={async (selectedIds) => {
            const selectedItem = data.find((e) => e.id === activeKey);
            if (!selectedItem) {
              message.error('未找到对应的故障信息');
              return;
            }
            try {
              await UserService.sendNotification({
                userIds: selectedIds,
                message: `故障告警：光缆:${selectedItem.cableName}, 故障信息：${
                  selectedItem.faultInfo ?? ''
                }, 故障时间:${selectedItem.createTime?.toLocaleString() ?? ''}`,
              });
              message.success('发送成功');
            } catch (e) {
              message.error('发送失败');
            }
          }}
          fetchFunction={() => UserService.all()}
          reload={() => {}}
        />
      )}
    </>
  );
};

export default OpticalCableMonitoringWaringPage;

// const instance: Cesium.GeometryInstance[] = item.faultPath
//   .filter((line) => line.length >= 2) // Filter valid paths directly
//   .mapResource((line) => {
//     const polyline = new Cesium.PolylineGeometry({
//       positions: Cartesian3.fromDegreesArray(
//         line.flatMap((point) => [point.longitude, point.latitude]),
//       ),
//       width: 5,
//       vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
//     });
//     return new Cesium.GeometryInstance({
//       geometry: Cesium.PolylineGeometry.createGeometry(polyline),
//     });
//   });
//
// if (instance.length > 0) {
//   markLine = new Cesium.Primitive({
//     geometryInstances: instance,
//     asynchronous: false,
//     appearance: new Cesium.PolylineMaterialAppearance({
//       material: new Cesium.Material({
//         fabric: {
//           type: 'PolylineTrailLink',
//           uniforms: {
//             image: require('@/assets/mapResource/spriteline.png'),
//             color: Cesium.Color.RED,
//             speed: 5.0, // Speed of the flow effect
//           },
//           source: `
//       czm_material czm_getMaterial(czm_materialInput materialInput) {
//         czm_material material = czm_getDefaultMaterial(materialInput);
//         float time = fract(czm_frameNumber * speed / 1000.0);
//         vec2 st = materialInput.st;
//         st.s += time;
//         vec4 colorImage = texture(image, vec2(fract(st.s), st.t));
//         material.diffuse = color.rgb;
//         material.alpha = colorImage.a * color.a;
//         return material;
//       }
//     `,
//         },
//       }),
//     }),
//   });
//
//   viewer.scene.primitives.add(markLine);
// }
