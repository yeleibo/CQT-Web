import { configureStore } from '@reduxjs/toolkit';
import areaDeviceDataReducer from './areaDeviceDataSlice';

export const store = configureStore({
  reducer: {
    areaDeviceData: areaDeviceDataReducer,
    // 这里可以添加其他的reducer
  },
});

// 从store本身推断出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 