import { createPointEntity, createPolylineEntity } from '@/pages/map/CreateEntity';
import MapDrawer, { useBaseMapLayer } from '@/pages/map/MapDrawer';
import { initViewer } from '@/pages/map/MapInit';
import { BaseMapLayers } from '@/pages/map/MapLayersTyping';
import { LatLng } from '@/pages/project/type';
import { PageContainer } from '@ant-design/pro-components';
import { Button } from 'antd';
import * as Cesium from 'cesium';
import { Entity, ScreenSpaceEventHandler, ScreenSpaceEventType, Viewer } from 'cesium';
import React, { useEffect, useRef, useState } from 'react';

const AreaDrawPage: React.FC = () => {
  const viewerRef = useRef<null | Viewer>(null);
  const viewerContainerRef = useRef(null);

  //改变底图
  const { baseMapLayer, changeBaseMapLayer } = useBaseMapLayer(BaseMapLayers.at(0)!);

  //经纬度列表
  const [latLngs, setLatLngs] = useState<LatLng[]>([]);

  //可撤销实体
  const [undoEntity, setUndoEntity] = useState<Entity[]>([]);

  //抽屉开关
  const [showDrawer, setShowDrawer] = useState(false);

  //抽屉开关
  const DrawerToggle = (open: boolean) => {
    setShowDrawer(open);
  };

  //初始化
  useEffect(() => {
    initViewer('csm-viewer-container1', baseMapLayer, (viewer) => {
      viewerRef.current = viewer;
    });
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [baseMapLayer]);

  //撤销实体
  function undoLastEntity(): void {
    const viewer = viewerRef.current;
    if (viewer) {
      if (undoEntity.length > 0) {
        const newEntity = [...undoEntity];
        const newLatLng = latLngs.slice(0, latLngs.length - 1);
        const lastEntity = newEntity.pop()!;
        setLatLngs(newLatLng);
        setUndoEntity(newEntity);
        viewer.entities.remove(lastEntity);
      }
    }
  }

  //删除所有实体
  function clearEntity(): void {
    const viewer = viewerRef.current;
    if (viewer) {
      viewer.entities.removeAll();
      setUndoEntity([]);
      setLatLngs([]);
    }
  }

  //标记操作
  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer) {
      const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

      handler.setInputAction((event: any) => {
        //屏幕坐标 转换为 笛卡尔空间直角坐标
        let clickPosition = viewer.scene.camera.pickEllipsoid(event.position);
        // 笛卡尔空间直角坐标 转换为 地理坐标（弧度制）
        let radiansPos = Cesium.Cartographic.fromCartesian(clickPosition!);
        //地理坐标（弧度制） 转换为 地理坐标（经纬度）
        let newPoint = {
          latitude: Cesium.Math.toDegrees(radiansPos.latitude),
          longitude: Cesium.Math.toDegrees(radiansPos.longitude),
        };
        //点实体
        const pointEntity = createPointEntity(clickPosition!);
        let pick = viewer.scene.pick(event.position);
        if (Cesium.defined(pick) && latLngs.length > 2) {
          setLatLngs((prevLatLng) => {
            const updatedLatLng = [...prevLatLng, prevLatLng.at(0)!];
            const polylineEntity = createPolylineEntity(updatedLatLng);
            viewer.entities.add(polylineEntity);
            setUndoEntity((prevEntity) => [...prevEntity, polylineEntity]);
            return updatedLatLng;
          });
        } else {
          setLatLngs((prevLatLng) => {
            const updatedLatLng = [...prevLatLng, newPoint];
            if (updatedLatLng.length === 1) {
              viewer.entities.add(pointEntity);
              setUndoEntity([pointEntity]);
              setLatLngs([newPoint]);
            } else {
              const polylineEntity = createPolylineEntity(updatedLatLng);
              viewer.entities.add(polylineEntity);
              setUndoEntity((prevEntity) => [...prevEntity, polylineEntity]);
            }
            return updatedLatLng;
          });
        }
      }, ScreenSpaceEventType.LEFT_CLICK);

      return () => {
        handler.destroy();
      };
    }
  }, [undoEntity]);

  return (
    <>
      <PageContainer pageHeaderRender={false}>
        <div
          id="csm-viewer-container1"
          ref={viewerContainerRef}
          style={{ width: '100%', height: '100%' }}
        >
          <div style={{ position: 'absolute', left: '10px', top: '10px', zIndex: 1000 }}>
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
              top: '10px',
              right: '10px',
              zIndex: 1000,
            }}
          >
            <Button type="primary" style={{ marginLeft: '10px' }} onClick={clearEntity}>
              清除
            </Button>
            <Button type="primary" style={{ marginLeft: '10px' }} onClick={undoLastEntity}>
              撤销
            </Button>
          </div>
          <MapDrawer
            baseMapLayer={baseMapLayer}
            changeBaseMapLayer={(layer) => changeBaseMapLayer(layer, viewerRef.current!)}
            onClose={() => DrawerToggle(false)}
            open={showDrawer}
          />
        </div>
      </PageContainer>
    </>
  );
};

export default AreaDrawPage;
