export type TreeModel = {
  parentId: any;
  id: any;
  title?: React.ReactNode;
  label?: React.ReactNode;
};

// export function mapToTreeDataType<T extends TreeModel>(
//   allData: T[],
//   item?: T
// ): TreeDataType<T>[] {
//   return allData
//     .filter(element => {
//       if (item) {
//         // 如果 item 不为 null，直接取出 item 的子元素
//         return element.getParentId() === item.getId();
//       } else {
//         // 如果 item 为 null，代表是最外层，则取出父 id 不在 allData 里的数据
//         const allIds = allData.map(e => e.getId());
//         return !allIds.includes(element.getParentId());
//       }
//     })
//     .map(e => {
//       const result = new TreeDataType<T>(
//         e.getTitle(),
//         e,
//         mapToTreeDataType(allData, e)
//       );
//       return result;
//     });
// }

export function mapToTreeDataType(
  allData: { id: any; parentId?: any; title: any; key: any }[],
  item?: { id: any },
): any[] {
  return allData
    .filter((element) => {
      if (!item) {
        // 如果 item 为 null，代表是最外层，则取出父 id 不在 allData 里的数据
        const allIds = allData.map((e) => e.id);
        return !allIds.includes(element.parentId);
      } else {
        // 如果 item 不为 null，直接取出 item 的子元素
        return element.parentId === item.id;
      }
    })
    .map((e) => {
      const result = {
        ...e,
        children: mapToTreeDataType(allData, e),
      };

      return result;
    });
}
