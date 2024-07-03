import React, { useRef, useState} from "react";
import {
  ActionType,
  type ProColumns,

  ProTable,
  PageContainer
} from "@ant-design/pro-components";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import SupplierService from "@/pages/inventory/supplier/SupplierService"
import {supplierHeaders, SupplierItem, SupplierParams} from "@/pages/inventory/supplier/typings";
import DeleteButton from "@/components/DelectButton";
import SupplierSave from "@/pages/inventory/supplier/SupplierSavePage"
import ExportButton from "@/components/ExcelButton/ExportButton";

const Supplier: React.FC = () => {
  const [current, setCurrent] = useState<SupplierItem>();
  const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<SupplierItem>[] = [

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
      width: 250,
      search: false,
    },

    {
      title: '编码',
      dataIndex: 'code',
      width: 100,
      valueType: 'textarea',
      search: false,
    },
    {

      title: '所属分组',
      dataIndex: 'groupCode',
      valueType: 'text',
      width: 80,      search: false,
    },
    {
      title: '地址',
      dataIndex: 'address',
      valueType: 'textarea',
      ellipsis: true,
      width: 200,
      search: false,
    },
    {

      title: '联系人',
      dataIndex: 'contactPersonName',
      valueType: 'text',
      width: 70,
      search: false,
    },

    {
      title: '联系电话',
      dataIndex: 'contactPhoneNumber',
      valueType:'text',
      width: 200,
      search: false,
    },
    {
      title: '开户银行',
      dataIndex: 'depositoryBank',
      valueType:'text',
      width: 100,
      search: false,
    },
    {
      title: '银行账号',
      dataIndex: 'bankAccountNumber',
      valueType:'text',
      width: 100,
      search: false,
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
              await SupplierService.delete(record.id!);
              actionRef.current?.reload();
            }
          }
        >
        </DeleteButton>,
      ],
    },
  ];

  const fetchSupplierData = async (): Promise<{ [sheetName: string]: SupplierItem[] }> => {
    let params:SupplierParams = {
      pageSize:999999999
    };
    let data =  await SupplierService.list(params);
    return {'供应商数据':data}
  };



  // 自定义表格头部标题，包含多个按钮
  return  <PageContainer pageHeaderRender={false}>
    <ProTable<SupplierItem, SupplierParams>
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

          <ExportButton fetchData={fetchSupplierData}
                        fileName={'供应商信息'}
                        buttonName={'导出供应商'}
                        headers={
                          supplierHeaders
                        }></ExportButton>

        </div>
      }

      rowKey="id"
      search={{
        labelWidth: 120,
      }}

      request={async (params) => {
        let r= await SupplierService.list(params);
        return {
          success:true,
          total:r.length,
          data:r
        };
      }}
      columns={columns}

    />
    {open &&  <SupplierSave  close={ ()=>{
      setOpen(false);
      setCurrent(undefined);
    }} model={!current ? "add" : 'edit'} supplierData={current} open={open} reload={()=>{
      actionRef.current?.reload();
    }}></SupplierSave>}


  </PageContainer>;
}




export default Supplier;
