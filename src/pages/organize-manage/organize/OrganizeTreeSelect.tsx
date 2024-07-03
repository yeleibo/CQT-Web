import OrganizeService from '@/pages/organize-manage/organize/OrganizeService';
import { TreeSelect, TreeSelectProps } from 'antd';
import { BaseOptionType } from 'rc-tree-select/lib/TreeSelect';
import React, { useEffect, useState } from 'react';

///组织机构选择组件
const OrganizeTreeSelect: React.FC<TreeSelectProps> = (props) => {
  const [organizeTreeData, setOrganizeTreeData] = useState<BaseOptionType[]>([]);
  useEffect(() => {
    OrganizeService.tree().then((organizeTreeData: BaseOptionType[]) => {
      setOrganizeTreeData(organizeTreeData);
    });
  }, []);
  return (
    <TreeSelect
      {...props}
      showSearch
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择"
      allowClear
      treeDefaultExpandAll
      treeData={organizeTreeData}
      treeCheckable={props.treeCheckable}
    />
  );
};

export default OrganizeTreeSelect;
