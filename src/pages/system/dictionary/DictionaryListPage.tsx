import DeleteButton from '@/components/DelectButton';
import DictionaryAddPage from '@/pages/system/dictionary/DictionaryAddPage';
import DictionaryService from '@/pages/system/dictionary/DictionaryService';
import {
  DictionaryItem,
  DictionaryItemTreeData,
  DictionaryQueryParam,
} from '@/pages/system/dictionary/typings';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Col, Row, Spin, Tree, TreeDataNode, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ResizableTitle from '@/components/ResizableTitle';

const DictionaryListPage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [state, setState] = useState({
    current: undefined as DictionaryItem | undefined,
    checkedKeys: [] as string[],
    checkedId: undefined as number | undefined,
    dictionaries: [] as TreeDataNode[],
    dictionaryItems: [] as TreeDataNode[],
    isAddPage: false,
    loading: true, // 新增加载状态
  });

  // 获取具体字典项
  const fetchData = async (params: DictionaryQueryParam) => {
    if (!params.dictionaryCode) {
      return {
        success: true,
        total: 0,
        data: [],
      };
    }
    try {
      const queryParams: DictionaryQueryParam = {
        keyword: params.keyword,
        dictionaryCode: params.dictionaryCode,
      };
      let data = await DictionaryService.dictionaryItems(queryParams);
      // 设置唯一的key, 方便列表数据全部展开
      data = data.map((item, index) => ({ ...item, key: item.id || `key-${index}` }));
      const dictionaryItems = DictionaryItemTreeData(data);
      setState((prevState) => ({
        ...prevState,
        dictionaryItems,
      }));
      return {
        success: true,
        total: data.length,
        data: dictionaryItems,
      };
    } catch (error) {
      console.error('无法获取字典数据:', error);
      return {
        success: false,
        total: 0,
        data: [],
      };
    }
  };

  // 获取字典分类
  const fetchDictionaries = async () => {
    try {
      const dictionaries = await DictionaryService.all();
      const dictionariesTreeData = dictionaries.map((dict) => ({
        key: dict.code,
        title: dict.name,
        id: dict.id,
      }));
      setState((prevState) => ({ ...prevState, dictionaries: dictionariesTreeData }));
      if (dictionariesTreeData.length > 0) {
        const firstCategory = dictionariesTreeData[0].key;
        setState((prevState) => ({
          ...prevState,
          checkedKeys: [firstCategory],
          checkedId: dictionariesTreeData[0].id,
        }));
        await fetchData({ dictionaryCode: firstCategory });
      } else {
        message.warning('未获取到字典分类数据');
      }
    } catch (error) {
      console.error('无法获取字典分类:', error);
      message.error('无法获取字典分类');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setState((prevState) => ({ ...prevState, loading: true }));
      await fetchDictionaries();
      setState((prevState) => ({ ...prevState, loading: false }));
    };

    initializeData();
  }, []);

  const handleCheck = async (checkedKeys: any, info: any) => {
    const checkedKey = info.node.key;
    setState((prevState) => ({
      ...prevState,
      checkedKeys: [checkedKey],
      checkedId: info.node.id,
      current: info.node,
    }));
    await fetchData({ dictionaryCode: checkedKey });
    actionRef.current?.reload();
  };

  const openAddPage = (record?: DictionaryItem) => {
    setState((prevState) => ({ ...prevState, current: record, isAddPage: true }));
  };

  const closeAddPage = () => {
    setState((prevState) => ({ ...prevState, current: undefined, isAddPage: false }));
  };

  const [columns, setColumns] = useState<ProColumns<DictionaryItem>[]>([
    {
      title: '关键字',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
      width: 150,
    },
    {
      title: '编码',
      dataIndex: 'code',
      valueType: 'textarea',
      search: false,
      width: 150,
    },
    {
      title: '启用',
      dataIndex: 'enable',
      search: false,
      render: (_, record) => record.enable ? '是' : '否',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => [
        <Button
          type="link"
          onClick={() => {
            openAddPage(record);
          }}
          key="view"
          style={{ padding: 0 }}
        >
          编辑
        </Button>,
        <DeleteButton
          key="delete"
          onDelete={async () => {
            await DictionaryService.delete(record.id!);
            await actionRef.current?.reload();
            await fetchDictionaries();
          }}
        ></DeleteButton>,
      ],
    },
  ]);
  // 列宽拖拽处理
  const handleResize =
    (index: number) =>
      (e: React.SyntheticEvent<Element>, { size }: { size: { width: number } }) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        setColumns(nextColumns);
      };

  const mergedColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column: any) => ({
      width: column.width,
      onResize: handleResize(index),
    }) as any,
  }));

  const components = {
    header: {
      cell: ResizableTitle,
    },
  };

  if (state.loading) {
    return <Spin>加载中...</Spin>;
  }

  return (
    <Row style={{margin: '20px'}}>
      <Col span={4} style={{ width: 200,  }}>
        <div style={{ marginLeft: 10 }}>
          <h3>字典分类</h3>
        </div>
        <Tree
          treeData={state.dictionaries}
          onCheck={handleCheck}
          selectable={false}
          checkable
          checkedKeys={state.checkedKeys}
        />
      </Col>

      <Col span={20}>
        <PageContainer pageHeaderRender={false}>
          <ProTable<DictionaryItem, DictionaryQueryParam>
            actionRef={actionRef}
            pagination={false}
            headerTitle={
              <div>
                <Button
                  onClick={() => {
                    openAddPage();
                  }}
                  type="primary"
                  style={{ marginRight: 8 }}
                >
                  <PlusOutlined /> 新建
                </Button>
              </div>
            }
            rowKey="key"
            search={{ labelWidth: 120 }}
            indentSize={50}
            request={async (params) => {
              const queryParams: DictionaryQueryParam = {
                dictionaryCode: state.checkedKeys[0],
                keyword: params.keyword,
              };
              return await fetchData(queryParams);
            }}
            columns={mergedColumns}
            components={components}
            expandable={{
              expandIcon: () => null,
              defaultExpandAllRows: true,
              expandedRowKeys: state.dictionaryItems.map((node) => node.key),
            }}
          />
          {state.isAddPage && (
            <DictionaryAddPage
              open={state.isAddPage}
              close={closeAddPage}
              model={!state.current ? 'add' : 'edit'}
              data={state.current}
              dictionaryId={state.checkedId}
              dictionaryCode={state.checkedKeys[0]}
              reload={() => actionRef.current?.reload()}
            />
          )}
        </PageContainer>
      </Col>
    </Row>
  );
};

export default DictionaryListPage;
