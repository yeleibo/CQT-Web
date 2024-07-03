import DictionaryService from '@/pages/system/dictionary/DictionaryService';
import { DictionaryItemTree, DictionaryQueryParam } from '@/pages/system/dictionary/typings';
import { TreeSelect, TreeSelectProps } from 'antd';
import { BaseOptionType } from 'rc-tree-select/lib/TreeSelect';
import React, { useEffect, useState } from 'react';

///组织机构选择组件
const DictionaryTreeSelect: React.FC<
  TreeSelectProps & { isSelectId: boolean; dictionaryCode: string; initialValue?: any | any[] }
> = (props) => {
  const [dictionaryTreeData, setDictionaryTreeData] = useState<BaseOptionType[]>([]);
  useEffect(() => {
    const queryParams: DictionaryQueryParam = {
      dictionaryCode: props.dictionaryCode,
    };
    DictionaryService.dictionaryItems(queryParams).then((dictionaryData) => {
      setDictionaryTreeData(DictionaryItemTree(dictionaryData, props.isSelectId));
    });
  }, []);
  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      onChange={props.onChange}
      placeholder="请选择"
      allowClear
      treeDefaultExpandAll
      treeData={dictionaryTreeData}
    />
  );
};

export default DictionaryTreeSelect;
