import BoxInfo from '@/pages/map/BoxDetail';
import { Box, BoxConnectingLine, BoxType, DataType } from '@/pages/map/BoxTyping';
import MapDrawer, { useBaseMapLayer, useOtherMapLayers } from '@/pages/map/MapTools/MapDrawer';
import { BaseMapLayers } from '@/pages/map/MapTools/MapLayersTyping';
import { flyToLocation, initViewer } from '@/pages/map/MapTools/MapUtils';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Collapse, List, Row } from 'antd';
import Search from 'antd/es/input/Search';
import * as Cesium from 'cesium';
import { Cartesian3, Ion, ScreenSpaceEventHandler, ScreenSpaceEventType, Viewer } from 'cesium';
import React, { useEffect, useRef, useState } from 'react';

const Maps: React.FC = () => {
  const viewerRef = useRef<null | Viewer>(null);
  const viewerContainerRef = useRef(null);
  //抽屉开关
  const [showDrawer, setShowDrawer] = useState(false);
  //地图切换
  const { baseMapLayer, changeBaseMapLayer } = useBaseMapLayer(BaseMapLayers.at(0)!);
  //盒子展示控制
  const { showBoxType, selectedTypes } = useOtherMapLayers();
  //选中的数据
  const [checkData, setCheckData] = useState<any>();
  //打开数据对话框
  const [dataModal, setDataModal] = useState(false);
  //线
  const boxConnectingLine = [
    new BoxConnectingLine(100001, 'XL001', DataType.Polyline, [
      {
        latitude: 28.84617039755671,
        longitude: 115.57507307892362,
      },
      {
        latitude: 28.8623442715555,
        longitude: 115.57507307895555,
      },
    ]),
    new BoxConnectingLine(100002, 'XL002', DataType.Polyline, [
      {
        latitude: 28.855654706737884,
        longitude: 115.5642057678034,
      },
      {
        latitude: 28.8623442715555,
        longitude: 115.57507307895555,
      },
    ]),
  ];
  //盒子
  const boxData = [
    new Box(
      1,
      'HBox0001',
      DataType.Box,
      BoxType.HBox,
      {
        latitude: 28.84617039755671,
        longitude: 115.57507307892362,
      },
      BoxType.HBox,
    ),
    new Box(2, 'FatBox0002', DataType.Box, BoxType.FatBox, {
      latitude: 28.8623442715555,
      longitude: 115.57507307895555,
    }),
    new Box(3, 'EndBox0003', DataType.Box, BoxType.EndBox, {
      latitude: 28.855654706737884,
      longitude: 115.5642057678034,
    }),
    new Box(4, 'SubBox0004', DataType.Box, BoxType.SubBox, {
      latitude: 28.85482927541523,
      longitude: 115.58607307895555,
    }),
  ];

  const [data, setData] = useState<Box[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (value: string) => {
    // if (!value.trim()) {
    //   message.warning('输入不能为空');
    //   return;
    // }
    setLoading(true);

    // 模拟数据请求
    setTimeout(() => {
      let result = boxData.filter((e) => e.name.includes(value));
      setData(result);
      setLoading(false);
    }, 1000);
  };

  //初始化
  useEffect(() => {
    initViewer('csm-viewer-container', baseMapLayer, async (viewer) => {
      viewerRef.current = viewer;
      Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NWE4MTA4Ny0zYjc1LTRmNWYtYjBlNS0zMGZlZDAzYmM1YjUiLCJpZCI6MjUwNjUzLCJpYXQiOjE3Mjk4MzcxODJ9.jPcB3iLwMCIWC3RFGMnO-EmIYtI0OtSXaMBYPX9eEv8';
      //相机视角
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(115.58, 28.85, 12000),
      });
      const tileset = viewer.scene.primitives.add(
        await Cesium.Cesium3DTileset.fromIonAssetId(96188),
      );

      // boxConnectingLine.forEach((e) => {
      //   viewerRef.current?.entities.add(createPolylineEntity(e.latLng!, e));
      // });
      // boxData.forEach((e) => {
      //   viewerRef.current?.entities.add(
      //     createImageEntity(
      //       Cesium.Cartesian3.fromDegrees(
      //         e.latLng.longitude,
      //         e.latLng.latitude,
      //         0,
      //         Cesium.Ellipsoid.WGS84,
      //       ),
      //       e,
      //     ),
      //   );
      // });
      // //加载数据
      // let lineDataSource = new Cesium.CustomDataSource('boxConnectingLine');
      // boxConnectingLine.forEach((e) => {
      //   lineDataSource.entities.add(createPolylineEntity(e.latLng, e));
      // });
      // let boxDataSource = new Cesium.CustomDataSource('box');
      // boxData.forEach((e) => {
      //   boxDataSource.entities.add(createImageEntity(e.latLng, e));
      // });
      // let modelDataSource = new Cesium.CustomDataSource('model');
      // modelDataSource.entities.add(
      //   ModelEntity(
      //     { latitude: 28.855654706737884, longitude: 115.57507307895555 },
      //     {
      //       id: 1498151,
      //       name: '楼宇',
      //       type: ModelType.building,
      //       latLng: { latitude: 28.855654706737884, longitude: 115.57507307895555 },
      //     },
      //   ),
      // );
      // viewer.dataSources.add(boxDataSource);
      // viewer.dataSources.add(lineDataSource);
      // viewer.dataSources.add(modelDataSource);

      // 启用广告牌聚合
      // lineDataSource.clustering.enabled = true;
      // lineDataSource.clustering.pixelRange = 15;
      // lineDataSource.clustering.minimumClusterSize = 20;
    });
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [baseMapLayer]);

  //点击
  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer) {
      const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((event: any) => {
        viewerRef.current?.entities.removeById('local');
        let pick = viewer.scene.pick(event.position);
        if (Cesium.defined(pick)) {
          if (pick.id.properties.type.getValue() === 2) {
            let line = boxConnectingLine.find((e) => e.id.toString() === pick.id.id);
            setCheckData(line);
          } else {
            let boxs = boxData.find((e) => e.id.toString() === pick.id.id);
            setCheckData(boxs);
          }
          setDataModal(true);
        }
      }, ScreenSpaceEventType.LEFT_CLICK);

      return () => {
        handler.destroy();
      };
    }
  }, []);

  //抽屉开关
  const DrawerToggle = (open: boolean) => {
    setShowDrawer(open);
  };

  //盒子开关
  const BoxInfoOk = () => {
    setDataModal(!dataModal);
  };

  //视角飞到指定区域
  // const flyToLocation = (latLng?: LatLng) => {
  //   const viewer = viewerRef.current;
  //
  //   let target;
  //   if (viewer) {
  //     if (latLng) {
  //       const localEntity = createLocalEntity(
  //         Cesium.Cartesian3.fromDegrees(latLng.longitude, latLng.latitude, 0),
  //       );
  //       viewerRef.current?.entities.removeById('local');
  //       viewerRef.current?.entities.add(localEntity);
  //       target = Cartesian3.fromDegrees(latLng.longitude, latLng.latitude, 1200);
  //     } else {
  //       target = Cartesian3.fromDegrees(115.58, 28.85, 12000);
  //     }
  //
  //     const boundingSphere = new BoundingSphere(target, 5000);
  //     viewer.camera.flyToBoundingSphere(boundingSphere, { duration: 1 });
  //   }
  // };

  return (
    <>
      <PageContainer pageHeaderRender={false}>
        <div
          id="csm-viewer-container"
          ref={viewerContainerRef}
          style={{ width: '100%', height: '100%' }}
        >
          <div style={{ position: 'absolute', left: '20px', top: '10px', zIndex: 1000 }}>
            <Button
              type="primary"
              style={{ width: '50px', height: '50px' }}
              onClick={() => DrawerToggle(true)}
            >
              图层
            </Button>
          </div>
          <div
            style={{
              position: 'absolute',
              left: '30px',
              height: '300px',
              width: '400px',
              top: '80px',
              zIndex: 1000,
            }}
          >
            <Search
              placeholder="Enter search text"
              onSearch={handleSearch}
              allowClear
              enterButton
              loading={loading}
            />
            {data.length > 0 && (
              <div style={{ marginTop: '10px', overflowY: 'auto' }}>
                <List
                  style={{ backgroundColor: 'white' }}
                  dataSource={data}
                  renderItem={(e) => (
                    <>
                      <div style={{ marginBottom: '10px' }}>
                        <Collapse
                          onChange={() =>
                            flyToLocation({
                              viewer: viewerRef.current!,
                              position: Cartesian3.fromDegrees(
                                e.latLng.longitude,
                                e.latLng.latitude,
                              ),
                              addMark: true,
                            })
                          }
                          items={[
                            {
                              key: e.id,
                              label: e.name,
                              children: (
                                <>
                                  <Row>
                                    <p>经度:</p>
                                    <p>{e.latLng.longitude}</p>
                                  </Row>
                                  <Row>
                                    <p>纬度:</p>
                                    <p>{e.latLng.latitude}</p>
                                  </Row>
                                  <Button
                                    type="primary"
                                    style={{ width: '50px', height: '50px' }}
                                    onClick={() => {
                                      setCheckData(e);
                                      BoxInfoOk();
                                    }}
                                  >
                                    详情
                                  </Button>
                                </>
                              ),
                            },
                          ]}
                        />
                      </div>
                    </>
                  )}
                />
              </div>
            )}
          </div>
          <MapDrawer
            baseMapLayers={baseMapLayer}
            changeBaseMapLayer={(layer) => changeBaseMapLayer(layer, viewerRef.current!)}
            onClose={() => DrawerToggle(false)}
            open={showDrawer}
          />
          {dataModal && (
            <BoxInfo close={BoxInfoOk} model={'add'} data={checkData} open={dataModal} />
          )}
        </div>
      </PageContainer>
    </>
  );
};

export default Maps;
