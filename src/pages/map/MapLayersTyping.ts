import GoogleSatellite from '@/assets/map/GoogleSatellite.png';
import GoogleStandard from '@/assets/map/GoogleStandard.png';
import * as Cesium from 'cesium';
import { UrlTemplateImageryProvider, WebMapServiceImageryProvider } from 'cesium';

export type MapLayer = {
  name: string;
  code: string;
  imgSrc: string;
  imageryProvider: UrlTemplateImageryProvider | WebMapServiceImageryProvider;
};

export const BaseMapLayers: MapLayer[] = [
  {
    name: '谷歌标准',
    code: 'GoogleStandard',
    imgSrc: GoogleStandard,
    imageryProvider: new UrlTemplateImageryProvider({
      url: 'http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    }),
  },
  {
    name: '谷歌卫星',
    code: 'GoogleSatellite',
    imgSrc: GoogleSatellite,
    imageryProvider: new UrlTemplateImageryProvider({
      url: 'http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    }),
  },
];

export const MapLayers: MapLayer[] = [
  {
    name: '资源地图',
    code: 're',
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
];
