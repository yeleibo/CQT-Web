import BoxInfo from '@/pages/map/BoxDetail';
import { Box, BoxConnectingLine, BoxType, DataType } from '@/pages/map/BoxTyping';
import { Button, Collapse, List, Row } from 'antd';
import Search from 'antd/es/input/Search';
import * as Cesium from 'cesium';
import { Cartesian3, Ion, ScreenSpaceEventHandler, ScreenSpaceEventType, Viewer } from 'cesium';
import React, { useEffect, useRef, useState } from 'react';
import { GetUserMapLayers, switchBaseLayer } from '@/pages/map/map-tools/MapLayersTyping';
import { flyToLocation, initViewer } from './map-tools/MapUtils';
import CoordTransforms from '@/pages/map/map-tools/CoordinateTransform';
import MapLayersDrawer from '@/pages/map/map-widget/MapLayersDrawer';

const Maps: React.FC = () => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const viewerInstance = useRef<Viewer | null>(null);

  //抽屉开关
  const [showDrawer, setShowDrawer] = useState(false);
  //盒子展示控制
  // const { showBoxType, selectedTypes } = useOtherMapLayers();
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
    if(viewerRef.current){
      viewerInstance.current = initViewer(viewerRef.current);
      switchBaseLayer(viewerInstance.current, 'GoogleStandard');
      flyToLocation({
        viewer: viewerInstance.current,
        position: CoordTransforms.CartographicToCartesian3(
          106.629708,-6.171257, 10000
        ),
      });
    }


    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
        viewerInstance.current = null;
      }
    };
  }, []);

  //点击
  useEffect(() => {
    const viewer = viewerInstance.current;
    if (viewer) {
      const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((event: any) => {
        viewerInstance.current?.entities.removeById('local');
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
      <div ref={viewerRef} style={{ width: '100%', height: '100vh' }}>
        {viewerInstance && (
          <MapLayersDrawer viewer={viewerInstance.current!} baseMapLayers={GetUserMapLayers(0)} />
        )}
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
                            viewer: viewerInstance.current!,
                            position: Cartesian3.fromDegrees(
                              e.latLng.longitude,
                              e.latLng.latitude,
                            ),
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

        {dataModal && (
          <BoxInfo close={BoxInfoOk} model={'add'} data={checkData} open={dataModal} />
        )}
      </div>
    </>
  );
};

export default Maps;
