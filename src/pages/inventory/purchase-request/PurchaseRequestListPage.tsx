import DeleteButton from '@/components/DelectButton';
import HouseSelect from '@/pages/inventory/purchase-request/HouseSelect';
import PurchaseRequestService from '@/pages/inventory/purchase-request/PurchaseRequestService';
import { StatusSelect, SupplierSelect } from '@/pages/inventory/purchase-request/SupplierSelect';
import {
  InventoryPurchaseRequestListDto,
  InventoryPurchaseRequestQueryParam,
  getStatusColor,
  getStatusLabel,
  purchaseRequestHeaders, purchaseRequestGoodHeaders, InventoryPurchaseRequestGoodExcelDto
} from '@/pages/inventory/purchase-request/type';
import OrganizeTreeSelect from '@/pages/organize-manage/organize/OrganizeTreeSelect';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';
import ExportButton from "@/components/ExcelButton/ExportButton";


const PurchaseRequestListPage: React.FC = () => {
  const [current, setCurrent] = useState<InventoryPurchaseRequestListDto>();
  const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<InventoryPurchaseRequestListDto>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: '部门',
      dataIndex: 'organizeIds',
      valueType: 'treeSelect',
      hideInTable: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderFormItem: (_, { defaultRender, ...rest }, form) => (
        <OrganizeTreeSelect
          {...rest}
          style={{ width: 300 }}
          value={form.getFieldValue(_.dataIndex)}
          onChange={(value) => form.setFieldValue(_.dataIndex, value)}
          multiple
        />
      ),
    },
    {
      title: '供应商',
      dataIndex: 'supplierIds',
      valueType: 'select',
      hideInTable: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderFormItem: (_, { defaultRender, ...rest }, form) => (
        <SupplierSelect {...rest} onChange={(value) => form.setFieldValue(_.dataIndex, value)} />
      ),
    },
    {
      title: '采购仓库',
      dataIndex: 'inventoryInHouseIds',
      valueType: 'select',
      hideInTable: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderFormItem: (_, { defaultRender, ...rest }, form) => (
        <HouseSelect {...rest} onChange={(value) => form.setFieldValue(_.dataIndex, value)} />
      ),
    },
    {
      title: '时间范围',
      dataIndex: 'dateRange',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => ({
          startCreateTime: value[0],
          endCreateTime: value[1],
        }),
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      hideInTable:true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderFormItem: (_, { defaultRender, ...rest }, form) => (
        <StatusSelect {...rest} onChange={(value) => form.setFieldValue(_.dataIndex, value)} />
      ),
    },

    {
      title: '单据编号',
      dataIndex: 'code',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '状态',
      search: false,
      width: 70,
      render: (text, record) => {
        return (
          <div
            style={{
              backgroundColor: getStatusColor(record.status, false),
              color: getStatusColor(record.status, true),
              padding: '5px',
            }}
          >
            {getStatusLabel(record.status)}
          </div>
        );
      },
    },
    {
      title: '供应商名称',
      valueType: 'text',
      dataIndex: 'supplierName',
      width: 250,
      search: false,
    },
    {
      title: '录入部门',
      dataIndex: 'organizeName',
      search: false,
    },
    {
      title: '采购仓库',
      dataIndex: 'inventoryInHouseName',
      search: false,
    },
    {
      title: '流程名称',
      dataIndex: 'workflowDefinitionName',
      search: false,
    },
    {
      title: '当前步骤',
      search:false,
      render: (_, record) =>
        (record.workflowInstanceStatus?.length === 0&&record.todoHandleUsersName?.length === 0)?'':`${record.workflowInstanceStatus}(${record.todoHandleUsersName})`
    },
    {
      title: '录入人',
      dataIndex: 'createByName',
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      search: false,
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
          style={{ padding: 0 }}
        >
          详情
        </Button>,
        <DeleteButton
          key="delete"
          onDelete={async () => {
            await PurchaseRequestService.delete(record.id!);
            actionRef.current?.reload();
          }}
        ></DeleteButton>,
      ],
    },
  ];

  const fetchPurchaseRequestData = async (): Promise<{ [sheetName: string]:  InventoryPurchaseRequestListDto[]}> => {
    let params:InventoryPurchaseRequestQueryParam = {
      pageSize:999999999
    };
    let r= await PurchaseRequestService.getInventoryPurchaseRequest(params);
    return  {'采购单据':r["data"]};
  };

  const fetchPurchaseRequestGoodData = async (): Promise<{ [sheetName: string]:  InventoryPurchaseRequestGoodExcelDto[]}> => {
    let params:InventoryPurchaseRequestQueryParam = {
      pageSize:999999999
    };
    let r= await PurchaseRequestService.getGoodExcel(params);
    return  {'物资信息':r};
  };


  // 自定义表格头部标题，包含多个按钮
  return  <PageContainer pageHeaderRender={false}>
    <ProTable<InventoryPurchaseRequestListDto, InventoryPurchaseRequestQueryParam>
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
            fetchPurchaseRequestData
            }
            fileName={'采购单据'}
            headers={
              purchaseRequestHeaders
            }
            buttonName={'导出单据'}></ExportButton>
          <ExportButton
            fileName={'物资信息'}
            headers={purchaseRequestGoodHeaders}
            fetchData={fetchPurchaseRequestGoodData}
            buttonName={'导出物资'}></ExportButton>
        </div>
      }

      rowKey="id"
      search={{
        labelWidth: 120,
      }}

      request={async (params) => {
        return await PurchaseRequestService.getInventoryPurchaseRequest(params);
      }}
      columns={columns}

    />
    {/*{open &&  <PrePurchaseRequestSavePage  onClose={ ()=>{*/}
    {/*  setOpen(false);*/}
    {/*  setCurrent(undefined);*/}
    {/*}}  data={current} open={open}   title={"新增"}></PrePurchaseRequestSavePage>}*/}


  </PageContainer>;
}




export default PurchaseRequestListPage;
