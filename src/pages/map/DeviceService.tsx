// import {Device, deviceFromJson, DeviceQueryParam} from '@/pages/map/MapSearch';
// import axios, {AxiosResponse} from "axios";
//
// const DeviceService = {
//   searchBoxDevice: async (deviceQueryParam: DeviceQueryParam) => {
//     let devices: Device[] = [];
//     const sourceMapServiceUrl = '';
//     if (deviceQueryParam.device) {
//       const type = deviceQueryParam.latLng ? 'point' : 'text';
//       const url = `${sourceMapServiceUrl}?postType=9&text=${deviceQueryParam.keyword}&type=${type}&lng=${deviceQueryParam.latLng?.longitude}&lat=${deviceQueryParam.latLng?.latitude}&zoomLevel=${deviceQueryParam.zoomLevel}&facId=${deviceQueryParam.device.id}&layerName=${deviceQueryParam.device.layerName}`;
//       const response: AxiosResponse<any> = await axios.get(url);
//       devices = response.data.map((e: any) => deviceFromJson(e));
//     } else {
//       if (deviceQueryParam.keyword && deviceQueryParam.keyword.length > 0) {
//         let url = `${sourceMapServiceUrl}?postType=2&Text=${deviceQueryParam.keyword}&branch=${
//           userGisInfo.branchId
//         }&userId=${userGisInfo.userId}&layers=${
//           deviceQueryParam.excludeLayers ? deviceQueryParam.excludeLayers.join(',') : ''
//         }`;
//         if (deviceQueryParam.planId) {
//           url += `&planId=${deviceQueryParam.planId}`;
//         }
//         const response: AxiosResponse<any> = await axios.get(url);
//         devices = response.data.map((e: any) => Device.fromJson(e));
//       } else if (deviceQueryParam.zoomLevel && deviceQueryParam.latLng) {
//         let url = `${sourceMapServiceUrl}?postType=3&branch=${userGisInfo.branchId}&userId=${
//           userGisInfo.userId
//         }&lng=${deviceQueryParam.latLng.longitude}&lat=${
//           deviceQueryParam.latLng.latitude
//         }&zoomLevel=${deviceQueryParam.zoomLevel}&layers=${
//           deviceQueryParam.excludeLayers ? deviceQueryParam.excludeLayers.join(',') : ''
//         }`;
//         if (deviceQueryParam.planId) {
//           url += `&planId=${deviceQueryParam.planId}`;
//         }
//         const response: AxiosResponse<any> = await axios.get(url);
//         devices = response.data.map((e: any) => Device.fromJson(e));
//       }
//     }
//
//     return devices;
//   },
// };
//
