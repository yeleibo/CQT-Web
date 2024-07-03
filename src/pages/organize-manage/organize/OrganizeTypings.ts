//部门
import { UserItem } from '@/pages/organize-manage/user/UserTypings';

export type OrganizeItem = {
  id: number;
  name: string;
  parentOrganizeId?: number;
  parentOrganizeName?: string;
  sysCode?: string;
  masterId?: number;
  enableContract: boolean;
  masterName?: string;
  orderNumber?: number;
  type: OrganizeType;
};

export enum OrganizeType {
  '总公司' = 0,
  '分公司' = 1,
  '部门' = 2,
  '施工单位' = 3,
}

export function getOrganizeTypeLabel(status?: OrganizeType): string {
  switch (status) {
    case OrganizeType.总公司:
      return '总公司';
    case OrganizeType.分公司:
      return '分公司';
    case OrganizeType.部门:
      return '部门';
    case OrganizeType.施工单位:
      return '施工单位';
    default:
      return '';
  }
}

export function organizeToTreeDataType(allData: OrganizeItem[], item?: { id: any }): any[] {
  return allData
    .filter((element) => {
      if (!item) {
        // 如果 item 为 null，代表是最外层，则取出父 id 不在 allData 里的数据
        const allIds = allData.map((e) => e.id);
        return !allIds.includes(element.parentOrganizeId!);
      } else {
        // 如果 item 不为 null，直接取出 item 的子元素
        return element.parentOrganizeId === item.id;
      }
    })
    .map((e) => {
      const result = {
        ...e,
        children: organizeToTreeDataType(allData, e),
      };

      return result;
    });
}

export function OrganizeTreeData(data: OrganizeItem[]) {
  const map: { [key: number]: any } = {};
  const roots: any[] = [];

  // 先按照parentOrganizeId排序，确保父节点在子节点之前被处理
  data.sort((a, b) => (a.parentOrganizeId ?? 0) - (b.parentOrganizeId ?? 0));

  data.forEach((item) => {
    const { id, name, parentOrganizeId } = item;
    const node = {
      title: name,
      value: id,
      key: id,
      children: [],
    };
    map[id] = node;

    if (parentOrganizeId === undefined || parentOrganizeId === null) {
      roots.push(node);
    } else {
      if (!map[parentOrganizeId]) {
        map[parentOrganizeId] = {
          children: [],
        };
      }
      map[parentOrganizeId].children.push(node);
    }
  });

  return roots;
}

export function buildTreeDataWithUsers(organizes: OrganizeItem[], users: UserItem[]) {
  const map: { [key: number]: any } = {};
  const roots: any[] = [];

  organizes.forEach((organize) => {
    const { id, name, parentOrganizeId } = organize;
    const node = {
      title: name,
      value: id,
      key: `organizes-${id}`,
      children: [],
      isOrganize: true,
    };
    map[id] = node;

    if (parentOrganizeId === undefined || parentOrganizeId === null) {
      roots.push(node);
    } else {
      if (!map[parentOrganizeId]) {
        map[parentOrganizeId] = {
          children: [],
        };
      }
      map[parentOrganizeId].children.push(node);
    }
  });

  users.forEach((user) => {
    const { id, name, organizeId, organizeName } = user;
    const node = {
      title: name,
      value: id,
      name: name,
      organizeId: organizeId,
      organizeName: organizeName,
      key: id,
      isOrganize: false,
    };
    if (map[organizeId]) {
      map[organizeId].children.push(node);
    } else {
      console.warn(`用户 ${name}没有设置部门`);
    }
  });

  return roots;
}
