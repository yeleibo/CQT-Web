import GoogleSatellite from '@/assets/map/GoogleSatellite.png';
import GoogleStandard from '@/assets/map/GoogleStandard.png';
import * as Cesium from 'cesium';
import { UrlTemplateImageryProvider, WebMapServiceImageryProvider } from 'cesium';

const tiandituMapKey = '782cfa7e1b12cd72e0a3a8f09ab54f38'; //我的

export type MapLayer = {
  name: string;
  code: string;
  type: string;
  imgSrc: string;
  imageryProvider: UrlTemplateImageryProvider | WebMapServiceImageryProvider;
};

export const BaseMapLayers: MapLayer[] = [
  {
    name: '谷歌标准',
    code: 'GoogleStandard',
    type: 'google',
    imgSrc: GoogleStandard,
    imageryProvider: new UrlTemplateImageryProvider({
      url: 'http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
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
    }),
  },
  {
    name: '天地图',
    code: 'TianDiTu',
    type: 'tianditu',
    imgSrc: GoogleSatellite,
    imageryProvider: new UrlTemplateImageryProvider({
      url:
        'http://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' +
        tiandituMapKey,
      subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    }),
  },
];

// export const TianDiTuMapLayer: MapLayer[] = [
//   {
//     name: '天地图标准',
//     code: 'TianDiTuStandard',
//     type: 'tianditu',
//     imgSrc: GoogleStandard,
//     imageryProvider: new UrlTemplateImageryProvider({
//       url:
//         'http://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' +
//         tiandituMapKey,
//       subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
//     }),
//   },
//   {
//     name: '天地图卫星',
//     code: 'TianDiTuSatellite',
//     type: 'tianditu',
//     imgSrc: GoogleSatellite,
//     imageryProvider: new UrlTemplateImageryProvider({
//       url:
//         'http://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' +
//         tiandituMapKey,
//       subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
//     }),
//   },
// ];
//
// export const TianDiTuOtherMapLayer: MapLayer = {
//   name: '天地图',
//   code: 'TianDiTu',
//   type: 'tianditu',
//   imgSrc: GoogleSatellite,
//   imageryProvider: new UrlTemplateImageryProvider({
//     url:
//       'http://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' +
//       tiandituMapKey,
//     subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
//   }),
// };

export const OtherMapLayers: MapLayer[] = [
  {
    name: '资源地图',
    code: 're',
    type: 'other',
    imgSrc: '../../assets/map/GoogleStandard.png',
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
    code: 're',
    type: 'other',
    imgSrc: '../../assets/map/GoogleStandard.png',
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
