import { PageParams } from '@/models/page';

export type Role = {
  id?: number;
  // 名称
  name: string;
  // 备注
  remark: string;
  // 排序
  orderNumber?: number;
};

export class RoleList {
  id?: number;
  // 名称
  name: string;
  // 备注
  remark: string;
  // 排序
  orderNumber?: number;
  permissions: Permission[];
  users: User[];

  constructor(
    name: string,
    remark: string,
    orderNumber?: number,
    permissions: Permission[] = [],
    users: User[] = [],
    id?: number,
  ) {
    this.id = id;
    this.name = name;
    this.remark = remark;
    this.orderNumber = orderNumber;
    this.permissions = permissions;
    this.users = users;
  }
}

export type Permission = {
  id: number;
  //名称
  name: string;
  //编码
  sysCode: string;
  //父编码
  parentSysCode?: string;
  //父id
  parentId?: number;
  type: PermissionType;
  //备注
  remark: string;
  //排序
  orderNumber?: number;
};

export type User = {
  id: number;
  //名称
  name: string;
  //
  organizeId: number;
  branchId: number;
};

//查询
export type RolesQueryParam = PageParams & {
  organizeId?: number;
};

export enum PermissionType {
  //模块
  module = 0,
  //页面
  menu = 1,
  //按钮
  button = 2,
  //数据
  data = 3,
  //其他
  other = 4,
}

export function PermissionTreeData(data: Permission[]) {
  const map: { [key: string]: any } = {};
  const roots: any[] = [];

  data.forEach((item) => {
    const { id, name, sysCode, parentSysCode } = item;
    const node = {
      title: name,
      value: id,
      key: id,
      children: [],
    };
    map[sysCode] = node;

    if (!parentSysCode) {
      roots.push(node);
    } else {
      if (!map[parentSysCode]) {
        map[parentSysCode] = {
          children: [],
        };
      }
      map[parentSysCode].children.push(node);
    }
  });

  return roots;
}

export function PermissionFilterTreeData(modulePermissions: Permission[], data: Permission[]) {
  const map: { [key: string]: any } = {};
  const treeData: any[] = [];

  // 构建modulePermissions的树结构
  modulePermissions.forEach((modules) => {
    const { id, name, parentId } = modules;
    const node = {
      title: name,
      value: id,
      key: `organizes-${id}`,
      children: [],
      isOrganize: true,
    };
    map[id] = node;

    if (parentId === undefined || parentId === null) {
      treeData.push(node);
    } else {
      if (!map[parentId]) {
        map[parentId] = {
          children: [],
        };
      }
      map[parentId].children.push(node);
    }
  });

  // 对data进行排序
  data.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

  // 处理data
  data.forEach((dataItem) => {
    const { id, name, parentId, type, parentSysCode } = dataItem;
    const node = {
      title: name,
      value: id,
      name: name,
      parentId: parentId,
      type: type,
      key: id,
      children: [],
    };

    if (map[parentId!]) {
      map[parentId!].children.push(node);
    } else if (parentSysCode?.substring(0, 3) !== undefined) {
      const parentSysId: number = parseInt(parentSysCode.substring(0, 3), 10);
      const parentNode = map[parentSysId];

      if (parentNode) {
        const c = parentNode.children.find((item: { value: number }) => item.value === parentId);
        if (c) {
          if (!c.children) {
            c.children = [];
          }
          c.children.push(node);
        } else {
          console.warn(`权限 ${name} 不存在 parentId ${parentId} 中`);
        }
      } else {
        console.warn(`父节点 ${parentSysId} 不存在于 map 中`);
      }
    } else {
      console.warn(`权限 ${name} 不存在 parentId ${parentId} 中`);
    }
  });

  // 递归移除 modulePermissions 中 children 为空的节点
  const removeEmptyChildrenFromModulePermissions = (nodes: any[]) => {
    return nodes.filter((node) => {
      if (node.children.length > 0) {
        node.children = removeEmptyChildrenFromModulePermissions(node.children);
      }
      return node.children.length > 0 || !node.isOrganize;
    });
  };

  // 保留数据节点
  const mergeDataNodes = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (node.children.length > 0) {
        node.children = mergeDataNodes(node.children);
      }
    });
    return nodes;
  };

  const filteredTreeData = removeEmptyChildrenFromModulePermissions(treeData);
  return mergeDataNodes(filteredTreeData);
}
