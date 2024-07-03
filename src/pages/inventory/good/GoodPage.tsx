import DeleteButton from '@/components/DelectButton';
import ExportButton from '@/components/ExcelButton/ExportButton';
import GoodTypeService from '@/pages/inventory/good-type/GoodTypeService';
import { GoodType, GoodTypeData } from '@/pages/inventory/good-type/type';
import GoodService from '@/pages/inventory/good/GoodService';
import GoodUpdatePage from '@/pages/inventory/good/GoodUpdatePage';
import { Good, GoodQueryParam, goodHeaders } from '@/pages/inventory/good/type';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Col, Row, Tree, TreeDataNode, TreeProps } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const GoodPage: React.FC = () => {
  const [current, setCurrent] = useState<Good>();
  const [selectedKeys, setSelectedKeys] = useState<string[]>();
  const [goods, setGoods] = useState<GoodTypeData[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 嵌套物资数据
  function nestGoods(goods: GoodType[]): GoodTypeData[] {
    const goodsMap: { [key: number]: GoodTypeData } = {};

    // 首先将所有的 GoodType 转换为 GoodTypeData 并放入一个 map 中
    goods.forEach((good) => {
      goodsMap[good.id!] = { ...good, children: [] };
    });

    const nestedGoods: GoodTypeData[] = [];

    // 然后根据 parentId 构建嵌套关系
    goods.forEach((good) => {
      if (good.parentId === null) {
        nestedGoods.push(goodsMap[good.id!]);
      } else {
        const parent = goodsMap[good.parentId!];
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(goodsMap[good.id!]);
        }
      }
    });

    return nestedGoods;
  }

  function transformToTreeNode(data: GoodTypeData): TreeDataNode {
    const { sysCode, name, children } = data;
    const node: TreeDataNode = {
      title: name,
      key: sysCode, // Fallback to name if id is not available
    };

    if (children && children.length > 0) {
      node.children = children.map(transformToTreeNode);
    }

    return node;
  }

  // 获取物资类型数据
  useEffect(() => {
    GoodTypeService.getGoodType().then((goodData: GoodType[]) => {
      const nestedGoods = nestGoods(goodData);
      setGoods(nestedGoods);
    });
  }, []);

  // 根据选中的 sysCode 获取物资数据
  const fetchGoods = async (params: GoodQueryParam) => {
    const queryParams: GoodQueryParam = {
      goodTypeSysCodes: selectedKeys,
      keyword: params.keyword,
    };

    const data = await GoodService.list(queryParams);
    return {
      success: true,
      total: data.length,
      data: data,
    };
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    const checkedKeys = checkedKeysValue as string[]; // 确保类型为 string[]
    setSelectedKeys(checkedKeys);
    actionRef.current?.reload();
  };

  const treeData: TreeDataNode[] = goods.map(transformToTreeNode);

  const columns: ProColumns<Good>[] = [
    {
      title: '编码|名称',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: '编码',
      dataIndex: 'code',
      valueType: 'textarea',
      search: false,
      width: 150,
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
    },

    {
      title: '所属目录',
      dataIndex: 'goodTypeName',
      valueType: 'text',
      search: false,
      width: 100,
    },
    {
      title: '单位',
      dataIndex: 'unitName',
      valueType: 'textarea',
      search: false,
      width: 50,
    },
    {
      title: '固定资产',
      dataIndex: 'assetType',
      valueType: 'text',
      search: false,
      width: 80,
    },
    {
      title: '税前价格',
      dataIndex: 'unitPriceBeforeTax',
      valueType: 'text',
      search: false,
      width: 120,
    },
    {
      title: '税后价格',
      dataIndex: 'unitPriceAfterTax',
      valueType: 'text',
      search: false,
      width: 120,
    },
    {
      title: '最低报警数量',
      dataIndex: 'lowestSafeAmount',
      valueType: 'text',
      search: false,
      width: 100,
    },
    {
      title: '最高报警数量',
      dataIndex: 'highestSafeAmount',
      valueType: 'text',
      search: false,
      width: 100,
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
            setCurrent(record);
            setOpen(true);
          }}
          key="view"
          style={{ padding: 0 }}
        >
          编辑
        </Button>,
        <DeleteButton
          key="delete"
          onDelete={async () => {
            await GoodService.delete(record.id!);
            actionRef.current?.reload();
          }}
        ></DeleteButton>,
      ],
    },
  ];

  const fetchGoodData = async (): Promise<{ [sheetName: string]: Good[] }> => {
    let params: GoodQueryParam = {
      pageSize: 999999999,
    };
    let data = await GoodService.list(params);
    return { 物资数据: data };
  };

  return (
    <Row>
      <Col span={4}>
        <Tree treeData={treeData} onCheck={onCheck} checkedKeys={selectedKeys} checkable={true} />
      </Col>
      <Col span={20}>
        <PageContainer pageHeaderRender={false}>
          <ProTable<Good, GoodQueryParam>
            actionRef={actionRef}
            pagination={{ pageSize: 10 }}
            headerTitle={
              <div>
                <Button
                  onClick={() => {
                    setCurrent(undefined);
                    setOpen(true);
                  }}
                  type="primary"
                  style={{ marginRight: 8 }}
                >
                  <PlusOutlined /> 新建
                </Button>
                <ExportButton
                  fileName={'物资数据'}
                  headers={goodHeaders}
                  fetchData={fetchGoodData}
                  buttonName={'导出物资'}
                ></ExportButton>
              </div>
            }
            rowKey="id"
            search={{ labelWidth: 120 }}
            request={async (params) => {
              const queryParams: GoodQueryParam = {
                goodTypeSysCodes: selectedKeys,
                keyword: params.keyword,
              };
              return await fetchGoods(queryParams);
            }}
            columns={columns}
          />
          {open && (
            <GoodUpdatePage
              close={() => {
                setOpen(false);
                setCurrent(undefined);
              }}
              model={!current ? 'add' : 'edit'}
              goodData={current}
              open={open}
              reload={() => {
                actionRef.current?.reload();
              }}
            />
          )}
        </PageContainer>
      </Col>
    </Row>
  );
};

export default GoodPage;
