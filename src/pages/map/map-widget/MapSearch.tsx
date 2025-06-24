import { Collapse, List } from 'antd';
import Search from 'antd/es/input/Search';
import { Cartesian3, Viewer } from 'cesium';
import React, { useEffect, useState } from 'react';
import { flyToLocation } from '@/pages/map/map-tools/MapUtils';

interface MapSearchProps {
  viewer: Viewer;
  onSearch: (value: string) => void;
  searchData: any[]; // Update to `any[]` for type safety
  loading: boolean;
}

export const MapSearch: React.FC<MapSearchProps> = ({ viewer, onSearch, searchData, loading }) => {
  const [activeKey, setActiveKey] = useState<string>('');

  useEffect(() => {
    if (searchData.length > 0 && activeKey) {
      const item = searchData.find((e) => e.id === activeKey);
      const cameraHeight = viewer.camera.positionCartographic.height;

      if (item) {
        flyToLocation({
          viewer: viewer,
          position: Cartesian3.fromDegrees(
            item.points.at(0).lon,
            item.points.at(0).lat,
            cameraHeight,
          ),
          showMark: true,
        });
      }
    }
  }, [activeKey, searchData]);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: '30px',
          height: '300px',
          width: '400px',
          top: '20px',
          zIndex: 1000,
        }}
      >
        <Search
          placeholder="输入查询的关键字"
          onSearch={onSearch}
          allowClear
          enterButton
          onClear={() => {
            viewer.entities.removeById('localMarker');
          }}
          // loading={loading}
        />
        {searchData.length > 0 && (
          <div style={{ marginTop: '10px', color: 'white' }}>
            <List
              style={{
                padding: '10px',
                overflowY: 'auto',
                backgroundColor: 'white',
                height: '500px',
              }}
              dataSource={searchData}
              loading={loading}
              renderItem={(e) => (
                <div style={{ marginBottom: '10px' }}>
                  <Collapse
                    activeKey={activeKey}
                    accordion
                    onChange={(key) => {
                      if (key.at(0) === activeKey) {
                        setActiveKey('');
                      } else {
                        setActiveKey(e.id!);
                      }
                    }}
                    items={[
                      {
                        key: e.id,
                        label: <span>{e.name}</span>,
                        children: (
                          <div style={{ textAlign: 'left' }}>
                            {Object.entries(e.attributes).map(([key, value]) => (
                              <div
                                key={key}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                  marginBottom: '8px',
                                }}
                              >
                                <span
                                  style={{
                                    flex: 1,
                                    textAlign: 'right',
                                    marginRight: '8px',
                                  }}
                                >
                                  {key}:
                                </span>
                                <span style={{ flex: 3, textAlign: 'left' }}>{value}</span>
                              </div>
                            ))}
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              )}
            />
          </div>
        )}
      </div>
    </>
  );
};
