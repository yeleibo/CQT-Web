import React, { useRef, useState} from "react";
import {
  ActionType,
  type ProColumns,

  ProTable,
  PageContainer
} from "@ant-design/pro-components";
import {Button, Select} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import DeleteButton from "@/components/DelectButton";
import {
  InventoryOutOpticalFiberListDto,
  InventoryOutOpticalFibersQueryParam,
  fibers
} from "@/pages/inventory/optical-fibers/type";
import OpticalFibersService from "@/pages/inventory/optical-fibers/OpticalFibersService";
import OpticalFibersForm from "@/pages/inventory/optical-fibers/OpticalFibersForm";

const OpticalFibersListPage: React.FC = () => {
  const [current, setCurrent] = useState<InventoryOutOpticalFiberListDto>();
  const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<InventoryOutOpticalFiberListDto>[] = [

    {
      title: '光缆盘号',
      dataIndex: 'code',
      valueType: 'textarea',
    },
    {
      title: '光缆状态',
      dataIndex: 'isOut',
      valueType: 'select',
      hideInTable:true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderFormItem: (_, { defaultRender, ...rest }, form) => (
        <Select
          style={{ width: '100%' }}
          {...rest}
          onChange={(value) => form.setFieldValue(_.dataIndex, value)}
          options={
            [{
              value: true,
              label: '出库',
            },
              {
                value: false,
                label: '库存',
              }]
          }
        />
      ),
    },
    {
      title: '光缆类型',
      dataIndex: 'goodId',
      valueType: 'select',
      hideInTable:true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderFormItem: (_, { defaultRender, ...rest }, form) => (
        <Select
          style={{ width: '100%' }}
          {...rest}
          onChange={(value) => form.setFieldValue(_.dataIndex, value)}
          options={
            Object.entries(fibers).map(([key, value]) => ({
              value: parseInt(key, 10),
              label: value,
            }))
          }
        />
      ),
    },
    {
      title: '最小长度',
      dataIndex: 'minLength',
      valueType: 'textarea',
      hideInTable:true
    },
    {
      title: '最大长度',
      dataIndex: 'maxLength',
      valueType: 'textarea',
      hideInTable:true
    },

    {
      title: '光缆长度',
      dataIndex: 'length',
      valueType: 'textarea',
      search: false,
    },
    {

      title: '光缆类型',
      dataIndex: 'goodName',
      valueType: 'text',
      search: false,
    },
    {
      title: '光缆状态',
      dataIndex: 'status',
      valueType: 'textarea',
      width: 200,
      search: false,
    },
    {

      title: '录入时间',
      dataIndex:'createTime',
      valueType: 'date',
      ellipsis:true,
      search: false
    },

    {
      title: '出库部门',
      valueType:'text',
      search: false,
      dataIndex:'inventoryOutOrganizeName'
    },
    {
      title: '物资单号',
      dataIndex: 'inventoryCode',
      valueType:'text',
      width: 100,
      search: false,
    },
    {
      title: '出库时间',
      valueType:'date',
      search: false,
      dataIndex:'inventoryOutTime'
    },
    {
      title: '领料人',
      valueType:'text',
      search: false,
      dataIndex:'recipient'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      valueType:'text',
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
          style={{padding: 0}}
        >
          编辑
        </Button>,
        <DeleteButton
          key="delete"
          onDelete={
            async () => {
              await OpticalFibersService.delete(record.id!);
              actionRef.current?.reload();
            }
          }
        >
        </DeleteButton>,
      ],
    },
  ];

  // 自定义表格头部标题，包含多个按钮
  return  <PageContainer pageHeaderRender={false}>
    <ProTable<InventoryOutOpticalFiberListDto, InventoryOutOpticalFibersQueryParam>
      actionRef={actionRef}
      pagination={false}

      headerTitle={
        <div>
          <Button onClick={() => {
            setCurrent(undefined);
            setOpen(true);
          }} type="primary" style={{marginRight: 8}}>
            <PlusOutlined/> 新建
          </Button>
        </div>
      }

      rowKey="id"
      search={{
        labelWidth: 120,
      }}

      request={async (params) => {
        return  await OpticalFibersService.list(params);
      }}
      columns={columns}

    />
    {open &&  <OpticalFibersForm  close={ ()=>{
      setOpen(false);
      setCurrent(undefined);
    }} model={!current ? "add" : 'edit'} houseData={current} open={open} reload={()=>{
      actionRef.current?.reload();
    }}></OpticalFibersForm>}


  </PageContainer>;
}




export default OpticalFibersListPage;
