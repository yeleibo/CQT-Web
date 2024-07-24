import { UrlTemplateImageryProvider, WebMapServiceImageryProvider } from 'cesium';
import * as Cesium from 'cesium';

export class MapImageryProvider {
  GoogleStandardProvider() {
    return new UrlTemplateImageryProvider({
      url: 'http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    });
  }

  GoogleSatelliteProvider() {
    return new UrlTemplateImageryProvider({
      url: 'http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    });
  }

  defaultWMSProvider(layerName: string) {
    return new WebMapServiceImageryProvider({
      url: 'http://39.102.103.37:8043/',
      layers: layerName,
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
  }
}
