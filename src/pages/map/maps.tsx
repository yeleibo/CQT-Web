import * as Cesium from 'cesium';
import {
  Cartesian3,
  Cartographic,
  Viewer as CesiumViewer,
  Color,
  Rectangle,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  UrlTemplateImageryProvider,
  WebMapServiceImageryProvider,
} from 'cesium';
import React, { useEffect, useRef, useState } from 'react';
import { CesiumComponentRef, Entity, Viewer } from 'resium';
import './customStyles.css';

// 天地图标准
const tiandituStandardImageryProvider = new UrlTemplateImageryProvider({
  url: 'http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=782cfa7e1b12cd72e0a3a8f09ab54f38',
});
// 天地图路网
const tiandituImageryProvider = new UrlTemplateImageryProvider({
  url: 'http://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=782cfa7e1b12cd72e0a3a8f09ab54f38',
});
// 高德标准
const gaodeStandardImageryProvider = new UrlTemplateImageryProvider({
  url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
});

// WMS 图层示例
const testWMSProvider = new WebMapServiceImageryProvider({
  url: 'http://39.102.103.37:8043/',
  layers: '', // 确认你的图层名称
  parameters: {
    service: 'WMS',
    request: 'GetMap',
    styles: '',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    type: 'map',
    useType: 1,
    branch: 1,
    basemapCode: 'tianditu',
  },
  tilingScheme: new Cesium.WebMercatorTilingScheme(),
});

const MapPage: React.FC = () => {
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null);
  const [clickPosition, setClickPosition] = useState<Cartographic | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<UrlTemplateImageryProvider>(
    tiandituStandardImageryProvider,
  );
  const [showLayerModal, setShowLayerModal] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Cartographic | null>(null);
  const [rectangle, setRectangle] = useState<Rectangle | null>(null);

  const updateLayers = (viewer: CesiumViewer, layer: UrlTemplateImageryProvider) => {
    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(layer);
    viewer.imageryLayers.addImageryProvider(tiandituImageryProvider);
    viewer.imageryLayers.addImageryProvider(testWMSProvider);
  };

  useEffect(() => {
    const initializeViewer = async () => {
      // 等待 Viewer 初始化完成
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      if (viewerRef.current?.cesiumElement) {
        const viewer = viewerRef.current.cesiumElement;

        // 设置初始图层和视图
        updateLayers(viewer, selectedLayer);

        // 确保在 Viewer 完全初始化后设置视角
        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(115.58, 28.85, 15000),
          duration: 2, // 设置飞行时间
        });

        viewer.scene.screenSpaceCameraController.enableTranslate = false;
        viewer.scene.screenSpaceCameraController.enableTilt = false;
        viewer.scene.screenSpaceCameraController.enableLook = false;

        // 添加点击事件监听器
        const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((event: { position: Cesium.Cartesian2 }) => {
          const cartesian = viewer.camera.pickEllipsoid(event.position);
          if (cartesian) {
            const cartographic = Cartographic.fromCartesian(cartesian);
            setClickPosition(cartographic);
          }
        }, ScreenSpaceEventType.LEFT_CLICK);

        //起始点
        handler.setInputAction((event: { position: Cesium.Cartesian2 }) => {
          const cartesian = viewer.camera.pickEllipsoid(event.position);
          if (cartesian && isDrawing) {
            const cartographic = Cartographic.fromCartesian(cartesian);
            if (startPoint === null) {
              setStartPoint(cartographic);
            } else {
              const newRectangle = Rectangle.fromCartographicArray([startPoint, cartographic]);
              setRectangle(newRectangle);
              setIsDrawing(false);
            }
          }
        }, ScreenSpaceEventType.LEFT_DOWN);
        //移动点
        handler.setInputAction((event: { endPosition: Cesium.Cartesian2 }) => {
          if (isDrawing && startPoint !== null) {
            const cartesian = viewer.camera.pickEllipsoid(event.endPosition);
            if (cartesian) {
              const endPoint = Cartographic.fromCartesian(cartesian);
              const newRectangle = Rectangle.fromCartographicArray([startPoint, endPoint]);
              setRectangle(newRectangle);
            }
          }
        }, ScreenSpaceEventType.MOUSE_MOVE);
        return () => {
          handler.destroy();
        };
      }
    };

    initializeViewer();
  }, []);

  const handleLayerChange = (layer: UrlTemplateImageryProvider) => {
    setSelectedLayer(layer);
    setShowLayerModal(false);
  };

  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
    setStartPoint(null);
    setRectangle(null);

    if (viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      viewer.scene.screenSpaceCameraController.enableRotate = isDrawing;
      viewer.scene.screenSpaceCameraController.enableTranslate = isDrawing;
      viewer.scene.screenSpaceCameraController.enableZoom = isDrawing;
      viewer.scene.screenSpaceCameraController.enableTilt = isDrawing;
      viewer.scene.screenSpaceCameraController.enableLook = isDrawing;
    }
  };

  return (
    <>
      <div id="cesiumContainer">
        <Viewer
          ref={viewerRef}
          infoBox={false}
          timeline={false}
          animation={false}
          fullscreenButton={false}
          homeButton={false}
          sceneModePicker={false}
          baseLayerPicker={false}
          navigationHelpButton={false}
          geocoder={false}
        >
          {rectangle && (
            <Entity
              rectangle={{
                coordinates: rectangle,
                // material: Color.RED.withAlpha(0.5),
                outline: true,
                outlineColor: Color.BLACK,
              }}
            />
          )}
        </Viewer>
      </div>
      {clickPosition && (
        <div className="coordinates">
          <p>经度: {Cesium.Math.toDegrees(clickPosition.longitude).toFixed(4)}</p>
          <p>纬度: {Cesium.Math.toDegrees(clickPosition.latitude).toFixed(4)}</p>
        </div>
      )}
    </>
  );
};

export default MapPage;
