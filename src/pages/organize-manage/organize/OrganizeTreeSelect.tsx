import OrganizeService from '@/pages/organize-manage/organize/OrganizeService';
import { useIntl } from '@@/plugin-locale';
import { TreeSelect, TreeSelectProps } from 'antd';
import { BaseOptionType } from 'rc-tree-select/lib/TreeSelect';
import React, { useEffect, useState } from 'react';

///组织机构选择组件
const OrganizeTreeSelect: React.FC<TreeSelectProps> = (props) => {
  const [organizeTreeData, setOrganizeTreeData] = useState<BaseOptionType[]>([]);
  const intl = useIntl();
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
      placeholder={intl.formatMessage({ id: 'pleaseSelect' })}
      allowClear
      treeDefaultExpandAll
      treeData={organizeTreeData}
      treeCheckable={props.treeCheckable}
    />
  );
};

export default OrganizeTreeSelect;
