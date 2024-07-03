import React, {useEffect, useRef, useState} from "react";
import {Button, Col, List, Modal, Row, Tree, TreeDataNode, TreeProps} from "antd";
import {GoodType, GoodTypeData} from "@/pages/inventory/good-type/type";
import {ActionType, PageContainer, type ProColumns, ProTable} from '@ant-design/pro-components';
import GoodTypeService from "@/pages/inventory/good-type/GoodTypeService";
import {Good, GoodQueryParam} from "@/pages/inventory/good/type";
import GoodService from "@/pages/inventory/good/GoodService";
import {CloseOutlined} from "@ant-design/icons";


interface Props {
  open: boolean;
  close: (selectedGood:Good[]) => void;
  goodIds:number[];
  cancel:() => void;
}

const GoodSelect: React.FC<Props> = (props:Props) =>{
  const [selectedKeys, setSelectedKeys] = useState<string[]>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [goodTypes, setGoodTypes] = useState<GoodTypeData[]>([]);
  const [selectedGood, setSelectedGood] = useState<Good[]>([]);
  const actionRef = useRef<ActionType>();
  // 嵌套物资数据
  function nestGoods(goods: GoodType[]): GoodTypeData[] {
    const goodsMap: { [key: number]: GoodTypeData } = {};

    // 首先将所有的 GoodType 转换为 GoodTypeData 并放入一个 map 中
    goods.forEach(good => {
      goodsMap[good.id!] = { ...good, children: [] };
    });

    const nestedGoods: GoodTypeData[] = [];

    // 然后根据 parentId 构建嵌套关系
    goods.forEach(good => {
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

  // 获取物资类型数据
  useEffect(() => {
    GoodTypeService.getGoodType().then((goodData:GoodType[]) => {
      const nestedGoods = nestGoods(goodData);
      setGoodTypes(nestedGoods);
    });
  }, []);

  function transformToTreeNode(data: GoodTypeData): TreeDataNode  {
    const { sysCode, name, children } = data;
    const node: TreeDataNode  = {
      title: name,
      key: sysCode
    };

    if (children && children.length > 0) {
      node.children = children.map(transformToTreeNode);
    }

    return node;
  }

  // 根据选中的 sysCode 获取物资数据
  const fetchGoods = async (goodParams: GoodQueryParam) => {
    const queryParams: GoodQueryParam = {
      goodTypeSysCodes: selectedKeys,
      keyword: goodParams.keyword,
    };

    const data = await GoodService.list(queryParams);

    const commonGoods = data.filter(
      good => props.goodIds.some(goodId => good.id === goodId)
    )
    setSelectedGood(commonGoods);
    setSelectedRowKeys(commonGoods.map((item) => item.id));
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

  const treeData: TreeDataNode[] = goodTypes.map(transformToTreeNode);

  const handleSave = () =>{
     props.close(selectedGood);
  }

  const handleClearAll = () => {
    setSelectedGood([]);
    setSelectedRowKeys([]);
  };

  const handleRemoveGood = (goodId: number) => {
    setSelectedGood(selectedGood.filter((good) => good.id !== goodId));
    setSelectedRowKeys(selectedGood.filter((good) => good.id !== goodId).map(g => g.id));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectRowKeys: React.Key[], selectedRows: Good[]) => {
      setSelectedGood(selectedRows);
      setSelectedRowKeys(selectRowKeys);
    },
    alwaysShowAlert: true,
  };

  const columns: ProColumns<Good>[] = [
    {
      title: '编码|名称',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
      fieldProps: {
        style: { width: 250 }, // 设置搜索框的宽度
      },

    },{
      title: '编码',
      dataIndex: 'code',
      valueType: 'textarea',
      search: false,
      width:150
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
      width:100
    },
  ];

    return <Modal
      title='选择物资'
      centered
      open={props.open}
      onOk={handleSave}
      onCancel={props.cancel}
      width={1500}
    >

      <Row>
           <Col span={4}>
             <Tree treeData={treeData} onCheck={onCheck} checkedKeys={selectedKeys} checkable={true}/>
           </Col>
          <Col span={14}>

              <PageContainer pageHeaderRender={false}>
                <ProTable<Good,GoodQueryParam>
                  actionRef={actionRef}
                  pagination={{ pageSize: 10 }}
                  rowKey="id"
                  rowSelection={
                     rowSelection
                  }
                  search={{ labelWidth: 120 ,}}
                  request={async (params) => {
                    const queryParams: GoodQueryParam = {
                      goodTypeSysCodes: selectedKeys,
                      keyword: params.keyword,
                    };
                    return await fetchGoods(queryParams);
                  }}
                  columns={columns}
                />
              </PageContainer>
          </Col>
        <Col span={6}>
          <List
            style={{ height: 750, overflowY: 'auto' }}
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>已选物资</span>
                <Button type="link" onClick={handleClearAll}>
                  清空
                </Button>
              </div>
            }
            bordered
            dataSource={selectedGood}
            renderItem={(good: Good) => (
              <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div>{good.name}</div>
                  <div>物资编码: {good.code}</div>
                </div>
                <Button
                  type="link"
                  icon={<CloseOutlined />}
                  onClick={() => handleRemoveGood(good.id)}
                />
              </List.Item>
            )}
          />
        </Col>

      </Row>

    </Modal>
}

export default GoodSelect;
