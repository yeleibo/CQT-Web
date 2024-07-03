import React, { useRef, useState} from "react";
import {
  ActionType,
  type ProColumns,

  ProTable,
  PageContainer
} from "@ant-design/pro-components";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import DeleteButton from "@/components/DelectButton";
import {InventorySheetListDto, InventorySheetQueryParam} from "@/pages/inventory/sheet/type";
import InventorySheetService from "@/pages/inventory/sheet/InventorySheetService";

const InventorySheetListPage: React.FC = () => {
  const [current, setCurrent] = useState<InventorySheetListDto>();
  const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<InventorySheetListDto>[] = [

    {
      title: '关键字',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: '盘点日期',
      dataIndex: 'inventorySheetTime',
      valueType: 'date',
      search: false,
    },
    {
      title: '编号',
      dataIndex: 'code',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '盘点仓库',
      dataIndex: 'inventoryHouseName',
      valueType: 'textarea',
      search: false,
    },


    {

      title: '盘点人',
      dataIndex: 'inventorySheetUserName',
      valueType: 'text',
      search: false,
    },
    {

      title: '当前步骤',
      search:false,
      render: (_, record) =>
        (record.workflowInstanceStatus?.length === 0&&record.todoHandleUsersName?.length === 0)?'':`${record.workflowInstanceStatus}(${record.todoHandleUsersName})`
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
              await InventorySheetService.delete(record.id!);
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
    <ProTable<InventorySheetListDto, InventorySheetQueryParam>
      actionRef={actionRef}
      pagination={false}
      scroll={{ x: 1500,  }}
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
        return  await InventorySheetService.list(params);
      }}
      columns={columns}

    />
    {/*{open &&  <InventoryHouseAddPage  close={ ()=>{*/}
    {/*  setOpen(false);*/}
    {/*  setCurrent(undefined);*/}
    {/*}} model={!current ? "add" : 'edit'} houseData={current} open={open} reload={()=>{*/}
    {/*  actionRef.current?.reload();*/}
    {/*}}></InventoryHouseAddPage>}*/}


  </PageContainer>;
}




export default InventorySheetListPage;
