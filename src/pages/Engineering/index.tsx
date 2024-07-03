import React, { useRef, useState} from "react";
import {
  ActionType,
  type ProColumns,

  ProTable,
  PageContainer
} from "@ant-design/pro-components";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import EngineeringService from "@/pages/Engineering/EngineeringService";
import {EngineeringItem, EngineeringParams} from "./typings";
import DeleteButton from "@/components/DelectButton";
import Save from "@/pages/Engineering/Save";

const Engineering: React.FC = () => {
  const [current, setCurrent] = useState<EngineeringItem>();
  const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<EngineeringItem>[] = [

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
    },

    {
      title: '编码',
      dataIndex: 'code',
      valueType: 'textarea',
      search: false,
    },
    {

      title: '类型',
      dataIndex: 'typeCode',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'contactPersonName',
      width: 100,
    },
    {

      title: '录入部门',
      dataIndex: 'createOrganizeName',
    },

    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
      ellipsis: true,
    },
    {

      title: '操作',
      valueType: 'option',
      width: 200,
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
              await EngineeringService.delete(record.id!);
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
    <ProTable<EngineeringItem, EngineeringParams>
      actionRef={actionRef}
      pagination={{ pageSize: 10 }}
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
        return await EngineeringService.list(params);
      }}
      columns={columns}

    />
    {open &&  <Save  close={ ()=>{
      setOpen(false);
      setCurrent(undefined);
    }} model={!current ? "add" : 'edit'} data={current} open={open} reload={()=>{
      actionRef.current?.reload();
    }}></Save>}


  </PageContainer>;
}




export default Engineering;
