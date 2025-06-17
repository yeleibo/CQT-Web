/**
 * 检查盒子端口电缆代码是否有效
 * @param code 电缆代码
 * @param type 盒子类型
 * @param name 端口名称
 * @returns 是否有效
 */
export function checkBoxPortCableCode(code: string, type: string, name: string): boolean {
  // 在实际实现中，这里应该有根据盒子类型和端口名称验证电缆代码的逻辑
  // 这里简化为始终返回true
  return true;
}

/**
 * 端口颜色枚举
 */
export enum PortColor {
  Red = 'Red',
  Green = 'Green',
  Blue = 'Blue',
  Yellow = 'Yellow',
  Purple = 'Purple',
  Orange = 'Orange'
}

/**
 * 获取端口颜色
 * @param color 颜色枚举
 * @returns 颜色代码
 */
export function getPortColor(color: PortColor): string {
  switch (color) {
    case PortColor.Red:
      return 'red';
    case PortColor.Green:
      return 'green';
    case PortColor.Blue:
      return 'blue';
    case PortColor.Yellow:
      return 'yellow';
    case PortColor.Purple:
      return 'purple';
    case PortColor.Orange:
      return 'orange';
    default:
      return 'gray';
  }
} 