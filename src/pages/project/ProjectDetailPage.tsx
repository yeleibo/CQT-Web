import * as Cesium from 'cesium';
import {
  Cartesian3,
  Entity,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
} from 'cesium';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Device } from '../map/BoxTyping';
import { flyToLocation, initViewer } from '../map/map-tools/MapUtils';
import { GetUserMapLayers, switchBaseLayer } from '@/pages/map/map-tools/MapLayersTyping';
import CoordTransforms from '@/pages/map/map-tools/CoordinateTransform';
import { MapSearch } from '@/pages/map/map-widget/MapSearch';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Form, Input, message, Space } from 'antd';
import { useIntl } from '@@/plugin-locale';
import { DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import ProjectService from './ProjectService';
import { ProjectDto } from './type';
import MapLayersDrawer from '@/pages/map/map-widget/MapLayersDrawer';

// 定义点位类型
interface PointData {
  longitude: number;
  latitude: number;
}

interface ProjectAddProps {
  id?: number;
  onClose: () => void;
  projectData?: ProjectDto; // 添加传入的项目数据
}

const ProjectDetailPage: React.FC<ProjectAddProps> = (props) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const viewerInstance = useRef<Viewer | null>(null);
  const [searchData, setSearchData] = useState<Device[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const intl = useIntl();
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [projectStatus, setProjectStatus] = useState<string>(props.projectData?.status || '');

  // 绘制相关状态
  const handler = useRef<ScreenSpaceEventHandler | null>(null);
  const pointsArray = useRef<PointData[]>([]); // 存储点位经纬度
  const markersRef = useRef<Entity[]>([]);     // 存储点标记实体
  const polylineRef = useRef<Entity | null>(null); // 存储线段实体

  // 添加一个标志来跟踪组件是否已卸载
  const isMounted = useRef(true);
  // 添加一个引用来存储setTimeout IDs
  const timeoutRef = useRef<number[]>([]);

  // 包装setTimeout以便能够正确清理
  const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
    if (!isMounted.current) return;

    const id = window.setTimeout(() => {
      // 执行前检查组件是否仍然挂载
      if (isMounted.current) {
        callback();
      }
    }, delay);

    timeoutRef.current.push(id);
    return id;
  }, []);

  // 计算中心点
  const calculateCenter = (points: PointData[]) => {
    if (points.length === 0) return null;

    let sumLon = 0;
    let sumLat = 0;

    points.forEach(point => {
      sumLon += point.longitude;
      sumLat += point.latitude;
    });

    return {
      longitude: sumLon / points.length,
      latitude: sumLat / points.length
    };
  };

  // 在指定位置添加标记
  const addMarkerAtPosition = (longitude: number, latitude: number) => {
    if (!viewerInstance.current) return;

    // 创建点标记
    const pointEntity = new Entity({
      position: Cartesian3.fromDegrees(longitude, latitude),
      point: {
        pixelSize: 10,
        color: Cesium.Color.fromCssColorString('#3aff24'),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
      },
    });

    if (pointEntity && viewerInstance.current) {
      const addedEntity = viewerInstance.current.entities.add(pointEntity);
      markersRef.current.push(addedEntity);
    }
  };

  // 开始绘制
  const startDrawing = (resetPoints = false) => {
    if (!viewerInstance.current) return;

    // 如果已提交，不允许绘制
    if (projectStatus !== '') return;

    setIsDrawing(true);
    console.log("开始绘制模式");

    // 如果需要重置点位数组
    if (resetPoints) {
      pointsArray.current = [];
    }

    // 确保之前的handler被销毁
    if (handler.current) {
      handler.current.destroy();
      handler.current = null;
    }

    // 创建新的事件处理器
    if (viewerInstance.current.scene && viewerInstance.current.scene.canvas) {
      handler.current = new ScreenSpaceEventHandler(viewerInstance.current.scene.canvas);

      // 左键点击添加点
      handler.current.setInputAction((click: any) => {
        if (!viewerInstance.current || projectStatus !== '') return;

        // 获取点击位置
        const cartesian = viewerInstance.current.scene.pickPosition(click.position);
        if (!cartesian) {
          // 如果无法获取准确位置，使用椭球体上的位置
          const ray = viewerInstance.current.camera.getPickRay(click.position);
          if (ray) {
            const newCartesian = viewerInstance.current.scene.globe.pick(ray, viewerInstance.current.scene);
            if (!newCartesian) {
              // 如果仍无法获取位置，使用射线与椭球体的交点
              Cesium.IntersectionTests.rayEllipsoid(ray, Cesium.Ellipsoid.WGS84);
              return;
            }
            addPointAtCartesian(newCartesian);
          }
          return;
        }

        addPointAtCartesian(cartesian);

      }, ScreenSpaceEventType.LEFT_CLICK);

      // 右键点击闭合路径
      handler.current.setInputAction(() => {
        if (!viewerInstance.current || projectStatus !== '' || pointsArray.current.length < 3) {
          message.info('至少需要3个点才能闭合路径');
          return;
        }

        // 闭合路径（连接首尾点）
        closePolyline();

        // 完成绘制
        setIsDrawing(false);

        // 移除事件监听
        if (handler.current) {
          handler.current.destroy();
          handler.current = null;
        }

      }, ScreenSpaceEventType.RIGHT_CLICK);

      // 防止浏览器默认右键菜单
      if (viewerRef.current) {
        viewerRef.current.oncontextmenu = (e) => {
          e.preventDefault();
          return false;
        };
      }
    }
  };

  // 清除所有实体
  const clearAllEntities = () => {
    if (!viewerInstance.current || !isMounted.current || projectStatus !== '') return;

    // 清除点标记
    markersRef.current.forEach(marker => {
      if (marker && viewerInstance.current) {
        viewerInstance.current.entities.remove(marker);
      }
    });

    // 清除线段
    if (polylineRef.current && viewerInstance.current) {
      viewerInstance.current.entities.remove(polylineRef.current);
      polylineRef.current = null;
    }

    // 重置引用
    markersRef.current = [];
    pointsArray.current = [];

    // 重置事件处理器
    if (handler.current) {
      handler.current.destroy();
      handler.current = null;
    }

    // 清除后重新开始绘制
    safeSetTimeout(() => {
      if (isMounted.current && viewerInstance.current) {
        startDrawing(true);
      }
    }, 100);
  };

  // 初始化项目数据
  const initProjectData = () => {
    if (!props.projectData) return;

    // 设置表单数据
    form.setFieldsValue({
      projectName: props.projectData.name
    });

    // 设置项目状态
    setProjectStatus(props.projectData.status ?? '');

    // 解析并加载地图范围点
    if (props.projectData.mapRangePoints) {
      try {
        // 清除现有点位
        clearAllEntities();

        // 解析JSON字符串
        let pointsData;
        pointsData = props.projectData.mapRangePoints;
        if (typeof pointsData === 'string') {
          pointsData = JSON.parse(pointsData);
        }

        // 加载保存的点位 - 处理coordinates格式的数据
        pointsArray.current = pointsData.map((point: any) => {
          if (point.coordinates) {
            return {
              longitude: point.coordinates[0],
              latitude: point.coordinates[1],
            };
          } else {
            return {
              longitude: point.longitude,
              latitude: point.latitude,
            };
          }
        });

        // 为每个点创建标记
        pointsArray.current.forEach(point => {
          addMarkerAtPosition(point.longitude, point.latitude);
        });

        // 更新线段
        if (pointsArray.current.length >= 2) {
          updatePolyline();
        }

        // 如果点数大于等于3，闭合路径
        if (pointsArray.current.length >= 3) {
          closePolyline();
        }

        // 如果已有数据，飞到保存的视角
        if (props.projectData.mapHeight && pointsArray.current.length > 0) {
          // 计算中心点
          const center = calculateCenter(pointsArray.current);
          if (center && viewerInstance.current) {
            flyToLocation({
              viewer: viewerInstance.current,
              position: CoordTransforms.CartographicToCartesian3(
                center.longitude, center.latitude, props.projectData.mapHeight
              ),
            });
          }
        }
      } catch (e) {
        console.error('解析项目范围点数据失败:', e);
        console.error(e);
      }
    }
  };

  //关键字查询
  const keywordSearchQuery = async (keyword: string) => {
    try {
      setSearchLoading(true);
      // const data = await OpticalCableMonitoringService.keywordSearch({ Text: keyword });
      // setSearchData(data);
      setSearchLoading(false);
    } catch (e) {
      console.log('关键字查询错误.');
    }
  };

  // 更新线段
  const updatePolyline = () => {
    if (!viewerInstance.current || pointsArray.current.length < 2) return;

    // 删除现有线段
    if (polylineRef.current) {
      viewerInstance.current.entities.remove(polylineRef.current);
      polylineRef.current = null;
    }

    // 创建线段坐标数组
    const positions: number[] = [];
    pointsArray.current.forEach(point => {
      positions.push(point.longitude, point.latitude);
    });

    // 创建新线段
    polylineRef.current = viewerInstance.current.entities.add({
      polyline: {
        positions: Cartesian3.fromDegreesArray(positions),
        width: 3,
        material: Cesium.Color.fromCssColorString('#3aff24'),
        clampToGround: true
      }
    });
  };



  // 在指定的笛卡尔坐标添加点
  const addPointAtCartesian = (cartesian: Cesium.Cartesian3) => {
    if (!viewerInstance.current) return;

    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    const lon = CesiumMath.toDegrees(cartographic.longitude);
    const lat = CesiumMath.toDegrees(cartographic.latitude);

    // 添加点位
    const newPoint = { longitude: lon, latitude: lat };
    pointsArray.current.push(newPoint);

    // 创建标记
    addMarkerAtPosition(lon, lat);

    // 更新线段
    updatePolyline();
  };

  // 闭合路径
  const closePolyline = () => {
    if (!viewerInstance.current || pointsArray.current.length < 3) return;

    // 创建闭合线段坐标数组
    const positions: number[] = [];

    // 添加所有点
    pointsArray.current.forEach(point => {
      positions.push(point.longitude, point.latitude);
    });

    // 添加第一个点，形成闭合
    positions.push(
      pointsArray.current[0].longitude,
      pointsArray.current[0].latitude
    );

    // 删除现有线段
    if (polylineRef.current) {
      viewerInstance.current.entities.remove(polylineRef.current);
      polylineRef.current = null;
    }

    // 创建闭合线段
    polylineRef.current = viewerInstance.current.entities.add({
      polyline: {
        positions: Cartesian3.fromDegreesArray(positions),
        width: 3,
        material: Cesium.Color.fromCssColorString('#3aff24'),
        clampToGround: true
      }
    });
  };



  // 撤销上一个点
  const undoLastPoint = () => {
    if (pointsArray.current.length === 0 || projectStatus !== '') {
      message.info('没有点可以撤销');
      return;
    }

    // 删除最后一个点
    pointsArray.current.pop();

    // 删除最后一个标记点
    if (markersRef.current.length > 0) {
      const lastMarker = markersRef.current.pop();
      if (lastMarker && viewerInstance.current) {
        viewerInstance.current.entities.remove(lastMarker);
      }
    }

    // 更新线段
    if (pointsArray.current.length >= 2) {
      updatePolyline();
    } else if (polylineRef.current && viewerInstance.current) {
      // 如果点太少，删除线段
      viewerInstance.current.entities.remove(polylineRef.current);
      polylineRef.current = null;
    }
  };

  // 将多边形点位格式化为保存所需的格式
  const formatPointsForSave = () => {
    if (pointsArray.current.length < 3) return "[]";

    const formattedPoints = pointsArray.current.map(point => ({
      coordinates: [point.longitude, point.latitude]
    }));

    // 将对象数组转换为JSON字符串
    return JSON.stringify(formattedPoints);
  };

  // 获取当前相机高度
  const getCurrentCameraHeight = () => {
    if (!viewerInstance.current) return 0;
    return viewerInstance.current.camera.positionCartographic.height;
  };

  // 保存数据
  const handleSubmit = async () => {
    try {
      // 如果已提交，不允许再次提交
      if (projectStatus !== '') {
        message.info('项目已提交，无法修改');
        return;
      }

      // 验证表单
      const formData = await form.validateFields();
      setSubmitLoading(true);

      console.log("提交前检查点位数组:", pointsArray.current);

      const formattedPoints = formatPointsForSave();
      console.log("格式化后的点位:", formattedPoints);

      // 构建保存的数据
      const projectData: any = {
        id: props.id || 0,
        name: formData.projectName,
        status: '',
        mapHeight: getCurrentCameraHeight(),
        resourceStatistics: "[]",
        mapRangePoints: formattedPoints
      };

      console.log("保存的数据:", projectData);

      // 调用API保存
      if (props.id) {
        await ProjectService.updateProjectStatistics(projectData);
        message.success('更新成功');
      } else {
        await ProjectService.addProjectStatistics(projectData);
        message.success('添加成功');
      }

      // 关闭页面
      if (props.onClose) {
        props.onClose();
      }
    } catch (error) {
      console.error("保存失败:", error);
      message.error('保存失败，请检查输入信息');
    } finally {
      setSubmitLoading(false);
    }
  };

  const init = () => {
    if (viewerRef.current) {
      // 初始化地图
      viewerInstance.current = initViewer(viewerRef.current);

      // 调整地图容器样式确保全屏显示
      if (viewerInstance.current && viewerInstance.current.container) {
        const container = viewerInstance.current.container as HTMLElement;
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
      }

      // 设置底图
      switchBaseLayer(viewerInstance.current, 'GoogleStandard');

      // 飞到指定位置
      flyToLocation({
        viewer: viewerInstance.current,
        position: CoordTransforms.CartographicToCartesian3(
          106.629708,-6.171257, 10000
        ),
      });

      // 确保地图准备好后再设置点击事件
      setTimeout(() => {
        // 如果有项目数据，先加载项目数据
        if (props.projectData) {
          initProjectData();
        } else {
          // 否则开始新的绘制
          startDrawing();
        }
      }, 1000);

      // 禁用默认的双击事件（避免干扰）
      viewerInstance.current.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
    }
  };

  useEffect(() => {
    if (searchData.length > 0 && viewerInstance.current) {
      const r: Device = searchData.at(0)!;
      // @ts-ignore
      const lon = r.points.at(0).lon;
      // @ts-ignore
      const lat = r.points.at(0).lat;
      const cameraHeight = viewerInstance.current.camera.positionCartographic.height;
      flyToLocation({
        viewer: viewerInstance.current!,
        position: CoordTransforms.CartographicToCartesian3(lon, lat, cameraHeight),
        showMark: true,
      });
    }
  }, [searchData]);

  useEffect(() => {
    init();
    return () => {
      console.log("组件卸载，清理资源");
      // 标记组件已卸载
      isMounted.current = false;

      // 清理所有timeout
      timeoutRef.current.forEach(id => window.clearTimeout(id));
      timeoutRef.current = [];

      // 清理事件处理器
      if (handler.current) {
        try {
          handler.current.destroy();
        } catch (e) {
          console.log("销毁handler时出错:", e);
        }
        handler.current = null;
      }

      // 如果viewer存在，清理实体和viewer
      if (viewerInstance.current) {
        try {
          // 清除所有实体
          try {
            markersRef.current.forEach(marker => {
              if (marker) viewerInstance.current!.entities.remove(marker);
            });

            if (polylineRef.current) {
              viewerInstance.current.entities.remove(polylineRef.current);
            }
          } catch (e) {
            console.log("清除实体时出错:", e);
          }

          // 最后销毁viewer
          viewerInstance.current.destroy();
        } catch (e) {
          console.log("销毁viewer时出错:", e);
        }
        viewerInstance.current = null;
      }
    };
  }, []);

  return (
      <PageContainer
        style={{ backgroundColor: '#fff', margin: '0px 20px 0px 20px' }}
        breadcrumbRender={false}
        onBack={props.onClose}
        header={{
          title: props.id !== undefined ? '详情' : '新增',
          extra: [
            projectStatus !== '' && (
              <Button
                key="submit"
                type="primary"
                loading={submitLoading}
                onClick={handleSubmit}
              >
                提交
              </Button>
            ),
          ],
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Form form={form} layout="horizontal" style={{ marginBottom: 16 }}>
            <Form.Item
              name="projectName"
              label={intl.formatMessage({ id: 'Project name' }) || "Project name"}
              rules={[{ required: true }]}
              style={{ width: '300px' }}
            >
              <Input disabled={projectStatus !== ''} />
            </Form.Item>
          </Form>
        </div>
        <div
          style={{
            width: '100%',
            height: 'calc(100vh - 250px)', // 使用视口高度减去其他元素的高度
            margin: '0 auto',
            position: 'relative'
          }}
        >
          <div ref={viewerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
            <MapSearch
              viewer={viewerInstance.current!}
              onSearch={keywordSearchQuery}
              searchData={searchData}
              loading={searchLoading}
            />
            {projectStatus !== '' && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1000,
                background: 'rgba(255,255,255,0.7)',
                padding: '5px',
                borderRadius: '4px'
              }}>
                <Space>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={clearAllEntities}
                    title="清除所有点"
                  >
                    清除所有点
                  </Button>
                  <Button
                    icon={<UndoOutlined />}
                    onClick={undoLastPoint}
                    title="撤销上一个点"
                  >
                    撤销上一个点
                  </Button>
                </Space>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
  );
};

export default ProjectDetailPage;
