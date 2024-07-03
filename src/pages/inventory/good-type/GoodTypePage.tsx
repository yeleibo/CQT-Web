import DeleteButton from '@/components/DelectButton';
import GoodTypeFormPage from '@/pages/inventory/good-type/GoodTypeFormPage';
import GoodTypeService from '@/pages/inventory/good-type/GoodTypeService';
import { GoodType, GoodTypeData } from '@/pages/inventory/good-type/type';
import { DownOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';

const GoodTypePage: React.FC = () => {
  const [current, setCurrent] = useState<GoodTypeData>();
  const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
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

    // 去除空的 children 属性
    const removeEmptyChildren = (items: GoodTypeData[]): GoodTypeData[] => {
      return items.map((item) => {
        if (item.children && item.children.length === 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { children, ...rest } = item;
          return rest;
        } else if (item.children) {
          return { ...item, children: removeEmptyChildren(item.children) };
        } else {
          return item;
        }
      });
    };

    return removeEmptyChildren(nestedGoods);
  }

  const customExpandIcon = (props: any) => {
    const style = { marginRight: '10px' }; // 调整左边距
    if (props.expanded) {
      return <DownOutlined style={style} onClick={(e) => props.onExpand(props.record, e)} />;
    } else {
      return <RightOutlined style={style} onClick={(e) => props.onExpand(props.record, e)} />;
    }
  };

  const columns: ProColumns<GoodTypeData>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
    },

    {
      title: '排序',
      dataIndex: 'orderNumber',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'text',
      width: 80,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => [
        <Button
          type={'link'}
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
            await GoodTypeService.delete(record.id!);
            actionRef.current?.reload();
          }}
        ></DeleteButton>,
      ],
    },
  ];

  // 自定义表格头部标题，包含多个按钮
  return (
    <PageContainer pageHeaderRender={false}>
      <ProTable<GoodType>
        actionRef={actionRef}
        pagination={false}
        expandable={{
          expandIcon: customExpandIcon,
        }}
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
          </div>
        }
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async () => {
          let r = await GoodTypeService.getGoodType();
          const nestedGoods = nestGoods(r);
          return {
            success: true,
            total: r.length,
            data: nestedGoods,
          };
        }}
        columns={columns}
      />
      {open && (
        <GoodTypeFormPage
          close={() => {
            setOpen(false);
            setCurrent(undefined);
          }}
          model={!current ? 'add' : 'edit'}
          goodTypeData={current}
          open={open}
          reload={() => {
            actionRef.current?.reload();
          }}
        ></GoodTypeFormPage>
      )}
    </PageContainer>
  );
};

export default GoodTypePage;
