import {
  Cartesian2,
  Cartographic,
  Math,
  WebMercatorProjection,
  WebMercatorTilingScheme,
} from 'cesium';
import CoordTransforms from '@/pages/map/map-tools/CoordinateTransform';

// 定义类 AmapMercatorTilingScheme，继承自 WebMercatorTilingScheme
class GCJMercatorTilingScheme extends WebMercatorTilingScheme {
  private baseProjection: WebMercatorProjection; // 原始投影参考

  constructor() {
    super();

    // 创建新的 WebMercatorProjection 实例
    this.baseProjection = new WebMercatorProjection();

    // 重写 _projection 的 project 方法
    this._projection.project = this.project.bind(this);

    // 重写 _projection 的 unproject 方法
    this._projection.unproject = this.unproject.bind(this);
  }

  /**
   * 将 Cartographic 坐标系转换为 Web Mercator 坐标系，包含从 WGS-84 到 GCJ-02 的坐标转换
   */
  private project(cartographic: Cartographic): Cartesian2 {
    // 将经纬度从弧度转换为度
    const [longitude, latitude] = [
      Math.toDegrees(cartographic.longitude),
      Math.toDegrees(cartographic.latitude),
    ];

    // 将 WGS-84 坐标转换为 GCJ-02 坐标
    const gcj02 = CoordTransforms.WGS84ToGCJ02(longitude, latitude);

    // 将 GCJ-02 坐标转换为 Cartographic 类型
    const cartographicGCJ02 = new Cartographic(Math.toRadians(gcj02[0]), Math.toRadians(gcj02[1]));

    // 使用 baseProjection 转换为平面坐标，避免调用自身
    const projected = this.baseProjection.project(cartographicGCJ02);

    // 返回 Cartesian2 类型的平面坐标
    return new Cartesian2(projected.x, projected.y);
  }

  /**
   * 将 Web Mercator 坐标系转换回 Cartographic 坐标系，包含从 GCJ-02 到 WGS-84 的坐标转换
   */
  private unproject(cartesian: Cartesian2): Cartographic {
    // 将 Cartesian2 坐标转换为 Cartographic 类型
    const cartographic = this.baseProjection.unproject(cartesian);

    // 将 GCJ-02 坐标转换为 WGS-84 坐标
    const wgs84 = CoordTransforms.GCJ02ToWGS84(
      Math.toDegrees(cartographic.longitude),
      Math.toDegrees(cartographic.latitude),
    );

    // 返回 WGS-84 坐标
    return new Cartographic(Math.toRadians(wgs84[0]), Math.toRadians(wgs84[1]));
  }
}

export default GCJMercatorTilingScheme;

export class GCJ02ToWGS84TilingScheme extends WebMercatorTilingScheme {
  private baseProjection: WebMercatorProjection;

  constructor() {
    super();
    // 使用 baseProjection 避免递归调用自身
    this.baseProjection = new WebMercatorProjection();

    // 重写 _projection 的 project 方法
    this._projection.project = this.project.bind(this);

    // 重写 _projection 的 unproject 方法
    this._projection.unproject = this.unproject.bind(this);
  }

  /**
   * 将 GCJ-02 坐标转换为 WGS-84 并投影为 Web Mercator 坐标系
   * @param cartographic - 输入的 GCJ-02 坐标
   * @returns 转换为 WGS-84 后的 Cartesian2 平面坐标
   */
  private project(cartographic: Cartographic): Cartesian2 {
    // 将 GCJ-02 坐标转换为 WGS-84 坐标
    const [longitude, latitude] = CoordTransforms.GCJ02ToWGS84(
      Math.toDegrees(cartographic.longitude),
      Math.toDegrees(cartographic.latitude),
    );

    // 创建 WGS-84 坐标的 Cartographic 对象
    const cartographicWGS84 = new Cartographic(Math.toRadians(longitude), Math.toRadians(latitude));

    // 使用 baseProjection 转换 WGS-84 坐标到 Web Mercator 平面坐标
    const projected = this.baseProjection.project(cartographicWGS84);

    return new Cartesian2(projected.x, projected.y);
  }

  /**
   * 将 Web Mercator 平面坐标转换回 GCJ-02 的 Cartographic 坐标
   * @param cartesian - 输入的平面坐标（WGS-84 坐标系）
   * @returns 转换为 GCJ-02 坐标的 Cartographic 对象
   */
  private unproject(cartesian: Cartesian2): Cartographic {
    // 将平面坐标转换为 WGS-84 的 Cartographic 坐标
    const cartographicWGS84 = this.baseProjection.unproject(cartesian);

    // 将 WGS-84 坐标转换为 GCJ-02 坐标
    const [longitude, latitude] = CoordTransforms.WGS84ToGCJ02(
      Math.toDegrees(cartographicWGS84.longitude),
      Math.toDegrees(cartographicWGS84.latitude),
    );

    // 返回 GCJ-02 坐标的 Cartographic 对象
    return new Cartographic(Math.toRadians(longitude), Math.toRadians(latitude));
  }
}
