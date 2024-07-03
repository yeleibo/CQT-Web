import { PageParams } from '@/models/page';

export type Dictionary = {
  id: number;
  name: string;
  code: string;
  parentId?: number;
  dictionaryItems: DictionaryItem[];
};

export type DictionaryItem = {
  id: number;
  name: string;
  code: string;
  //备注
  remark: string;
  //排序
  orderNumber?: number;
  //是否启用
  enable: boolean;
  parent?: DictionaryItem;
  parentId?: number;
  dictionaryId: number;
};

export type DictionaryQueryParam = PageParams & {
  keyword?: string;
  dictionaryCode?: string;
};

export function DictionaryItemTreeData(allData: DictionaryItem[], item?: { id: any }): any[] {
  return allData
    .filter((element) => {
      if (!item) {
        // 如果 item 为 null，代表是最外层，则取出父 id 不在 allData 里的数据
        const allIds = allData.map((e) => e.id);
        return !allIds.includes(element.parentId!);
      } else {
        // 如果 item 不为 null，直接取出 item 的子元素
        return element.parentId === item.id;
      }
    })
    .map((e) => {
      return {
        ...e,
        children: DictionaryItemTreeData(allData, e),
      };
    });
}

export function DictionaryItemTree(data: DictionaryItem[], isSelectId: boolean) {
  const map: { [key: number]: any } = {};
  const roots: any[] = [];

  data.sort((a, b) => (a.parentId ?? 0) - (b.parentId ?? 0));

  data.forEach((item) => {
    const { id, name, code, parentId } = item;
    const node = {
      title: name,
      name: name,
      code: code,
      value: isSelectId ? id : name,
      key: name,
      children: [],
    };
    map[id] = node;

    if (parentId === undefined || parentId === null) {
      roots.push(node);
    } else {
      if (!map[parentId]) {
        map[parentId] = {
          children: [],
        };
      }
      map[parentId].children.push(node);
    }
  });

  return roots;
}
