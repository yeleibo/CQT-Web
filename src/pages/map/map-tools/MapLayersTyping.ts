import GoogleSatellite from '@/assets/map/GoogleSatellite.png';
import GoogleStandard from '@/assets/map/GoogleStandard.png';
import * as Cesium from 'cesium';
import { UrlTemplateImageryProvider, WebMapServiceImageryProvider } from 'cesium';
import GCJMercatorTilingScheme from '@/pages/map/map-tools/gao';

const tiandituMapKey = '782cfa7e1b12cd72e0a3a8f09ab54f38'; //我的

export type MapLayer = {
  name: string;
  code: string;
  type: string;
  imgSrc: string;
  imageryProvider: UrlTemplateImageryProvider | WebMapServiceImageryProvider;
};

export const GoogleMapLayer: MapLayer[] = [
  {
    name: '谷歌标准',
    code: 'GoogleStandard',
    type: 'google',
    imgSrc: GoogleStandard,
    imageryProvider: new UrlTemplateImageryProvider({
      url: 'http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      tilingScheme: new GCJMercatorTilingScheme(),
      minimumLevel: 0,
      maximumLevel: 18,
    }),
  },
  {
    name: '谷歌卫星',
    code: 'GoogleSatellite',
    type: 'google',
    imgSrc: GoogleSatellite,
    imageryProvider: new UrlTemplateImageryProvider({
      url: 'http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      minimumLevel: 0,
      maximumLevel: 18,
    }),
  },
];

export const GaoDeMapLayer: MapLayer[] = [
  {
    name: '高德标准',
    code: 'GaoDeStandard',
    type: 'gaode',
    imgSrc: GoogleStandard,
    imageryProvider: new UrlTemplateImageryProvider({
      url: 'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      tilingScheme: new GCJMercatorTilingScheme(),
      minimumLevel: 3,
      maximumLevel: 18,
    }),
  },
  {
    name: '高德卫星',
    code: 'GaoDeSatellite',
    type: 'gaode',
    imgSrc: GoogleSatellite,
    imageryProvider: new UrlTemplateImageryProvider({
      url: 'https://webst01.is.autonavi.com/appmaptile?lang=zh_cn&style=6&x={x}&y={y}&z={z}',
      tilingScheme: new GCJMercatorTilingScheme(),
      minimumLevel: 3,
      maximumLevel: 18,
    }),
  },
  {
    name: '高德地标 ',
    code: 'GaoDeSatellite',
    type: 'other',
    imgSrc: GoogleSatellite,
    imageryProvider: new UrlTemplateImageryProvider({
      url: 'https://webst01.is.autonavi.com/appmaptile?lang=zh_cn&style=6&x={x}&y={y}&z={z}',
      minimumLevel: 0,
      maximumLevel: 18,
    }),
  },
  {
    name: '高德道路标',
    code: 'GaoDeSatellite',
    type: 'other',
    imgSrc: GoogleSatellite,
    imageryProvider: new UrlTemplateImageryProvider({
      url: 'https://webst01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
      minimumLevel: 0,
      maximumLevel: 18,
    }),
  },
];

export const TianDiTuMapLayer: MapLayer[] = [
  {
    name: '天地图标准',
    code: 'TianDiTuStandard',
    type: 'tianditu',
    imgSrc: GoogleStandard,
    imageryProvider: new UrlTemplateImageryProvider({
      url:
        'http://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' +
        tiandituMapKey,
      subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
      minimumLevel: 0,
      maximumLevel: 18,
    }),
  },
  {
    name: '天地图卫星',
    code: 'TianDiTuSatellite',
    type: 'tianditu',
    imgSrc: GoogleSatellite,
    imageryProvider: new UrlTemplateImageryProvider({
      url:
        'http://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' +
        tiandituMapKey,
      subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
      minimumLevel: 0,
      maximumLevel: 18,
    }),
  },
  {
    name: '天地图',
    code: 'TianDiTu',
    type: 'other',
    imgSrc: GoogleSatellite,
    imageryProvider: new UrlTemplateImageryProvider({
      url:
        'http://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' +
        tiandituMapKey,
      subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    }),
  },
];

export const DeqingMapLayers: MapLayer[] = [
  {
    name: '德清标准',
    code: 'DeqingStandard',
    type: 'deqing',
    imgSrc: '../../assets/mapResource/GoogleStandard.png',
    imageryProvider: new WebMapServiceImageryProvider({
      url: 'http://113.214.4.18:8002/',
      layers: '',
      parameters: {
        format: 'image/png',
        transparent: false,
        type: 'tileVector',
        maximumLevel: 20,
      },
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
    }),
  },
];

export const OtherMapLayers: MapLayer[] = [
  {
    name: '资源地图',
    code: 're1',
    type: 'other',
    imgSrc: '../../assets/mapResource/GoogleStandard.png',
    imageryProvider: new WebMapServiceImageryProvider({
      url: 'http://39.102.103.37:8043/',
      layers: '',
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
    }),
  },
  {
    name: '大屏资源地图',
    code: 'deqingOther',
    type: 'other',
    imgSrc: '../../assets/mapResource/GoogleStandard.png',
    imageryProvider: new WebMapServiceImageryProvider({
      url: 'http://113.214.4.18:8002/',
      layers: '',
      parameters: {
        service: 'WMS',
        request: 'GetMap',
        styles: '',
        format: 'image/jpeg',
        transparent: true,
        version: '1.1.1',
        type: 'mapOther',
        useType: 1,
        branch: 1,
        basemapCode: 'gaode',
      },
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
    }),
  },
];

export function customMapLayer(name: string, code: string, url: string, parameters: any): MapLayer {
  return {
    name: name,
    code: code,
    type: 'custom',
    imgSrc: '../../assets/mapResource/GoogleStandard.png',
    imageryProvider: new WebMapServiceImageryProvider({
      url: url,
      layers: '',
      parameters: parameters,
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
    }),
  };
}

/**
 *
 * @param id 用户机构id
 * 根据机构id返回指定的地图服务
 */
export const GetUserMapLayers = (id: number) => {
  let gaodeMapLayers: MapLayer[] = GaoDeMapLayer.filter((e) => e.type === 'gaode');
  let tianMapLayers: MapLayer[] = TianDiTuMapLayer.filter((e) => e.type === 'tianditu');
  if (id === 1) {
    return GoogleMapLayer;
  } else if (id === 2) {
    return gaodeMapLayers;
  } else if (id === 3) {
    return tianMapLayers;
  } else {
    return [...GoogleMapLayer, ...gaodeMapLayers, ...tianMapLayers];
  }
};

/**
 * 切换 Cesium Viewer 的底图图层
 * @param viewer - Cesium Viewer 实例
 * @param layer - 选择的图层
 * @param imageryProvider
 */
export function switchBaseLayer(
  viewer: Cesium.Viewer,
  layer: string,
  imageryProvider?: UrlTemplateImageryProvider | WebMapServiceImageryProvider,
): void {
  if (!viewer) {
    console.error('地图未初始化');
    return;
  }
  // 移除现有的底图图层
  viewer.scene.imageryLayers.removeAll();
  const gaodeOtherLayers: MapLayer[] = GaoDeMapLayer.filter((layer) => layer.type === 'other');
  const tiandituOtherLayers: MapLayer[] = TianDiTuMapLayer.filter(
    (layer) => layer.type === 'other',
  );

  // 根据 layerType 添加新的图层
  switch (layer) {
    case 'GoogleStandard':
      viewer.imageryLayers.addImageryProvider(
        GoogleMapLayer.find((e) => e.code === layer)!.imageryProvider,
      );
      break;

    case 'GoogleSatellite':
      viewer.imageryLayers.addImageryProvider(
        GoogleMapLayer.find((e) => e.code === layer)!.imageryProvider,
      );
      break;
    case 'GaoDeStandard':
      viewer.imageryLayers.addImageryProvider(
        GaoDeMapLayer.find((e) => e.code === layer)!.imageryProvider,
      );
      break;
    case 'GaoDeSatellite':
      viewer.imageryLayers.addImageryProvider(
        GaoDeMapLayer.find((e) => e.code === layer)!.imageryProvider,
      );
      gaodeOtherLayers.forEach((layer) => {
        viewer.imageryLayers.addImageryProvider(layer.imageryProvider);
      });
      break;

    case 'TianDiTuStandard':
      viewer.imageryLayers.addImageryProvider(
        TianDiTuMapLayer.find((e) => e.code === layer)!.imageryProvider,
      );
      tiandituOtherLayers.forEach((layer) => {
        viewer.imageryLayers.addImageryProvider(layer.imageryProvider);
      });
      break;

    case 'TianDiTuSatellite':
      viewer.imageryLayers.addImageryProvider(
        TianDiTuMapLayer.find((e) => e.code === layer)!.imageryProvider,
      );
      tiandituOtherLayers.forEach((layer) => {
        viewer.imageryLayers.addImageryProvider(layer.imageryProvider);
      });
      break;
    case 'deqingOther':
      viewer.imageryLayers.addImageryProvider(
        OtherMapLayers.find((e) => e.code === layer)!.imageryProvider,
      );
      break;
    case 'DeqingStandard':
      viewer.imageryLayers.addImageryProvider(
        DeqingMapLayers.find((e) => e.code === layer)!.imageryProvider,
      );
      break;
    case 'other':
      viewer.imageryLayers.addImageryProvider(imageryProvider!);
      break;
    default:
      console.error('未知的图层类型:', layer);
  }
}

// 资源图层
export function resourceLayerImageryProvider(userId?: number) {
  return new WebMapServiceImageryProvider({
    url: '/gis/',
    layers: 'your_layer_name',
    tileWidth: 512,
    tileHeight: 512,
    parameters: {
      service: 'WMS',
      request: 'GetMap',
      styles: '',
      format: 'image/jpeg',
      transparent: true,
      version: '1.1.1',
      type: 'mapOther',
      useType: 1,
      branch: 1,
      basemapCode: 'gaode',
      userId: userId,
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
  });
}
