import OpticalCableMonitoringService from '@/pages/home/OpticalCableMonitoring/services';
import {
  OpticalCableMonitoringWaringStateToString,
  OpticalCableMonitoringWarning,
} from '@/pages/home/OpticalCableMonitoring/typings';
import { CesiumMapDialog, faultyCableMaterial } from '@/pages/map/MapTools/CesiumMaterial';
import { BaseMapLayers } from '@/pages/map/MapTools/MapLayersTyping';
import {
  flyToLocation,
  initViewer,
  PointEffects,
  RoadShuttleEffects,
} from '@/pages/map/MapTools/MapUtils';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, List, Row } from 'antd';
import * as Cesium from 'cesium';
import { Cartesian3, Viewer } from 'cesium';
import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi';

const OpticalCableMonitoringWaringPage: React.FC = () => {
  const viewerRef = useRef<null | Viewer>(null);
  //返回搜索数据
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OpticalCableMonitoringWarning[]>();
  //标记线
  let faultLinePrimitive: Cesium.Primitive | null = null;

  useEffect(() => {
    initViewer('viewer-container', BaseMapLayers.f, async (viewer) => {
      setLoading(true);
      viewerRef.current = viewer;
      // 设置相机视角
      flyToLocation({ viewer: viewer, position: Cartesian3.fromDegrees(120.05, 30.56, 80000) });

      const [opticalCableMonitoringModel, opticalWarnings] = await Promise.all([
        OpticalCableMonitoringService.getOpticalCableMonitoringModelList(),
        OpticalCableMonitoringService.getOpticalCableMonitoringWaringModelList({ day: 10 }),
      ]);
      setData(opticalWarnings);
      setLoading(false);

      const lines = opticalCableMonitoringModel.fiberLines.map((e) =>
        e.map(({ latitude, longitude }) => Cartesian3.fromDegrees(longitude, latitude, 0)),
      );
      const points = opticalCableMonitoringModel.dataCenterPoints.map((e) =>
        Cartesian3.fromDegrees(e.longitude, e.latitude, 0),
      );
      //正常线路材质
      const NormalLineMaterial = Cesium.Material.fromType('Color', {
        color: Cesium.Color.fromCssColorString('#a0e446'),
      });

      //添加线效果
      RoadShuttleEffects(viewer, lines, NormalLineMaterial);
      //添加点效果
      PointEffects(viewer, points, Cesium.Color.fromCssColorString('#3fbce3'));
    });

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  //故障线
  const flyToFaultCable = (viewer: Viewer, item: OpticalCableMonitoringWarning) => {
    if (faultLinePrimitive) {
      viewer.scene.primitives.remove(faultLinePrimitive);
      faultLinePrimitive = null;
    }
    flyToLocation({
      viewer: viewerRef.current!,
      position: Cartesian3.fromDegrees(item.faultPoint!.longitude, item.faultPoint!.latitude),
      addMark: true,
    });

    const m = faultyCableMaterial();
    const faultLine = item.faultPath
      .filter((line) => line.length >= 2)
      .map((e) =>
        e.map(({ latitude, longitude }) => Cartesian3.fromDegrees(longitude, latitude, 1)),
      );

    faultLinePrimitive = RoadShuttleEffects(viewer, faultLine, m);

    // const instance: Cesium.Cartesian3[] = item.faultPath
    //   .filter((line) => line.length >= 2) // Filter valid paths directly
    //   .flatMap((line) =>
    //     line.map((point) => Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude)),
    //   );
    //
    // if (instance.length > 0) {
    //   markLineEntity = viewer.entities.add({
    //     polyline: {
    //       positions: instance,
    //       width: 3.0,
    //       material: Cesium.Color.RED,
    //       // material: Cesium.Color.fromCssColorString('#fba489'),
    //     },
    //   });
    // }

    const dialog = new CesiumMapDialog({
      viewer: viewer,
      position: Cartesian3.fromDegrees(item.faultPoint!.longitude, item.faultPoint!.latitude),
      title: item.cableName,
      content: item.faultInfo ?? '',
    });
    dialog.showDialog();
  };

  return (
    <div style={{ height: '100%' }}>
      <Row gutter={16}>
        <Col span={6} style={{ borderRight: '1px solid #f0f0f0' }}>
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
            <span style={{ marginLeft: '8px', fontSize: '18px' }}>故障详情</span>{' '}
          </Row>

          <List
            size="large"
            bordered
            dataSource={data}
            loading={loading}
            style={{ padding: '10px', overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}
            renderItem={(e) => (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <Collapse
                    onChange={() => flyToFaultCable(viewerRef.current!, e)}
                    items={[
                      {
                        key: e.id,
                        label: `${e.cableName}  (${OpticalCableMonitoringWaringStateToString(
                          e.state,
                        )})`,
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

        <Col span={18} style={{ height: '100%' }}>
          <div id="viewer-container" style={{ width: '100%', height: '92vh' }}></div>
        </Col>
      </Row>
    </div>
  );
};

export default OpticalCableMonitoringWaringPage;

// const instance: Cesium.GeometryInstance[] = item.faultPath
//   .filter((line) => line.length >= 2) // Filter valid paths directly
//   .map((line) => {
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
//             image: require('@/assets/map/spriteline.png'),
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
