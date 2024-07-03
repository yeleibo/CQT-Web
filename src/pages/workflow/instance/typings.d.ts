export  type HandleRecord ={
  /**
   * 备注
   */
  remark?: string;

  /**
   * 处理人用户名
   */
  handleUserName: string;

  /**
   * 处理人用户ID
   */
  handleUserId?: number; // 注意，Dart的int在TS中通常是number

  /**
   * 活动ID
   */
  activityId?: string;

  /**
   * 活动名称
   */
  activityName: string;

  /**
   * 操作名称
   */
  operateName: string;

  /**
   * 操作时间
   */
  operateDateTime: Date;

  /**
   * 签名数据
   */
  signature?: Uint8Array; // Dart的Uint8List在TS中对应Uint8Array
}

