import {TreeSelect, TreeSelectProps} from "antd";
import React, {useEffect, useState} from "react";
import {BaseOptionType} from "rc-tree-select/lib/TreeSelect";
import {mapToTreeDataType} from "@/models/treeModel";
import GoodTypeService from "@/pages/inventory/good-type/GoodTypeService";


///物资选择组件
const GoodTypeSelect: React.FC<TreeSelectProps> = (props: TreeSelectProps) => {
  const [organizeTreeData, setOrganizeTreeData] = useState<BaseOptionType[]>([]);
  useEffect(() => {
    GoodTypeService.getGoodType().then((organizeTreeData:BaseOptionType[]) => {
      const treeData = mapToTreeDataType(organizeTreeData.map(item=>{
        return {
          key:item.id,
          id:item.id,
          value:item.id,
          parentId:item.parentId,
          title:item.name
        };

      }));
      setOrganizeTreeData(treeData)
    });
  }, []);
  return <TreeSelect
    {...props}
    showSearch
    style={{width: '100%'}}
    //value={value}
    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}

    placeholder="请选择"
    allowClear
    treeDefaultExpandAll
    treeData={organizeTreeData}
  />;

}


export default GoodTypeSelect;
