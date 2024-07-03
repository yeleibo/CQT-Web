import React, { useRef, useState} from "react";
import {
  ActionType,
  type ProColumns,

  ProTable,
  PageContainer
} from "@ant-design/pro-components";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {
  prePurchaseRequestHeaders,
  PrePurchaseRequestList,
  PrePurchaseRequestParam
} from "@/pages/inventory/pre-purchase-request/type";
import DeleteButton from "@/components/DelectButton";
import PrePurchaseRequestService from "@/pages/inventory/pre-purchase-request/PrePurchaseRequestService";
import PrePurchaseRequestSavePage from "@/pages/inventory/pre-purchase-request/PrePurchaseRequestSavePage";
import ExportButton, {CellValue} from "@/components/ExcelButton/ExportButton";
import {SupplierItem, SupplierParams} from "@/pages/inventory/supplier/typings";
import SupplierService from "@/pages/inventory/supplier/SupplierService";
import {InventoryHouseListDto} from "@/pages/inventory/house/type";
import {toStringOfDay} from "@/components/Extension/DateTime";

const PrePurchaseRequestListPage: React.FC = () => {
  const [current, setCurrent] = useState<PrePurchaseRequestList>();
  const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<PrePurchaseRequestList>[] = [

    {
      title: '关键字',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },

    {
      title: '编号',
      dataIndex: 'code',
      valueType: 'textarea',
      search: false,
    },
    {

      title: '录入人',
      dataIndex: 'createByName',
      search:false
    },
    {
      title: '录入日期',
      valueType: 'date',
      dataIndex: 'createTime',
      search:false
    },
    {

      title: '录入部门',
      dataIndex: 'organizeName',
      search:false
    },
    {

      title: '处理人',
      search:false,
      render: (_, record) =>
        (record.workflowInstanceStatus?.length === 0&&record.todoHandleUsersName?.length === 0)?'':`${record.workflowInstanceStatus}(${record.todoHandleUsersName})`
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
      ellipsis: true,
      search:false
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
          详情
        </Button>,
        <DeleteButton
          key="delete"
          onDelete={
            async () => {
              await PrePurchaseRequestService.delete(record.id!);
              actionRef.current?.reload();
            }
          }
        >
        </DeleteButton>,
      ],
    },
  ];

  const fetchPrePurchaseRequestData = async (): Promise<{ [sheetName: string]:  PrePurchaseRequestList[]}> => {
    let params:PrePurchaseRequestParam = {
      pageSize:999999999
    };
    let r= await PrePurchaseRequestService.list(params);
    return  {'要货单据':r["data"]};
  };


  // 自定义表格头部标题，包含多个按钮
  return  <PageContainer pageHeaderRender={false}>
    <ProTable<PrePurchaseRequestList, PrePurchaseRequestParam>
      actionRef={actionRef}
      pagination={{ pageSize: 10 }}
      scroll={{ x: 1500,  }}
      headerTitle={
        <div>
          <Button onClick={() => {
            setCurrent(undefined);
            setOpen(true);
          }} type="primary" style={{marginRight: 8}}>
            <PlusOutlined/> 新建
          </Button>
          <ExportButton
            fetchData={
              fetchPrePurchaseRequestData
            }
            fileName={'要货单据'}
            headers={
              prePurchaseRequestHeaders
            }
            buttonName={'导出单据'}></ExportButton>
        </div>
      }

      rowKey="id"
      search={{
        labelWidth: 120,
      }}

      request={async (params) => {
        return await PrePurchaseRequestService.list(params);
      }}
      columns={columns}

    />
    {open &&  <PrePurchaseRequestSavePage  onClose={ ()=>{
      setOpen(false);
      setCurrent(undefined);
    }}  data={current}    title={"新增"}  ></PrePurchaseRequestSavePage>}


  </PageContainer>;
}




export default PrePurchaseRequestListPage;
