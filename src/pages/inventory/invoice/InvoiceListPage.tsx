import DeleteButton from '@/components/DelectButton';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Select } from 'antd';
import React, { useRef, useState } from 'react';

import InvoiceService from '@/pages/inventory/invoice/InvoiceService';
import {
  FormStatusCommon,
  InventoryInvoiceListDto,
  InventoryInvoiceQueryParam,
  getStatusColor,
  getStatusLabel, InventoryInvoiceGoodDetailExcelDto, invoiceGoodHeaders, invoiceHeaders,
} from '@/pages/inventory/invoice/type';
import { SupplierSelect } from '@/pages/inventory/purchase-request/SupplierSelect';
import OrganizeTreeSelect from '@/pages/organize-manage/organize/OrganizeTreeSelect';
import ExportButton, {CellValue} from "@/components/ExcelButton/ExportButton";
import {
  InventoryPurchaseRequestListDto,
  InventoryPurchaseRequestQueryParam
} from "@/pages/inventory/purchase-request/type";
import PurchaseRequestService from "@/pages/inventory/purchase-request/PurchaseRequestService";
import {toStringOfDay} from "@/components/Extension/DateTime";

const InvoiceListPage: React.FC = () => {
  const [current, setCurrent] = useState<InventoryInvoiceListDto>();
  const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<InventoryInvoiceListDto>[] = [
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
      title: '开票日期',
      dataIndex: 'dateRange',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => ({
          startInvoiceDate: value[0],
          endInvoiceDate: value[1],
        }),
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      hideInTable: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderFormItem: (_, { defaultRender, ...rest }, form) => (
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          {...rest}
          onChange={(value) => form.setFieldValue(_.dataIndex, value)}
          options={[
            {
              value: FormStatusCommon.unStart,
              label: '未开始',
            },
            {
              value: FormStatusCommon.running,
              label: '审核中',
            },
            {
              value: FormStatusCommon.finished,
              label: '已完成',
            },
          ]}
        />
      ),
    },
    {
      title: '单据编号',
      dataIndex: 'code',
      width: 150,
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
      title: '开票日期',
      valueType: 'date',
      dataIndex: 'invoiceDate',
      search: false,
    },
    {
      title: '发票号',
      dataIndex: 'inventoryInvoiceCode',
      search: false,
    },
    {
      title: '发票金额',
      valueType: 'text',
      dataIndex: 'amountAfterTax',
      search: false,
    },
    {
      title: '录入部门',
      dataIndex: 'organizeName',
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
      width:150,
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
            await InvoiceService.delete(record.id!);
            actionRef.current?.reload();
          }}
        ></DeleteButton>,
      ],
    },
  ];

  const fetchInvoiceData = async (): Promise<{ [sheetName: string]:  InventoryInvoiceListDto[]}> => {
    let params:InventoryInvoiceQueryParam = {
      pageSize:999999999
    };
    let r= await InvoiceService.getInventoryInvoiceRequest(params);
    return  {'发票单据':r['data']};
  };

  const fetchInvoiceGoodData = async (): Promise<{ [sheetName: string]:  InventoryInvoiceGoodDetailExcelDto[]}> => {
    let params:InventoryInvoiceQueryParam = {
      pageSize:999999999
    };
    let r= await InvoiceService.getGoodsExcel(params);
    return  {'物资单据':r};
  };



  // 自定义表格头部标题，包含多个按钮
  return  <PageContainer pageHeaderRender={false}>
    <ProTable<InventoryInvoiceListDto, InventoryInvoiceQueryParam>
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
            fileName={'发票单据'}
            headers={invoiceHeaders}
            fetchData={fetchInvoiceData}
            buttonName={'导出单据'}></ExportButton>
          <ExportButton
            fileName={'物资单据'}
            headers={invoiceGoodHeaders}
            fetchData={fetchInvoiceGoodData}
            buttonName={'导出物资'}></ExportButton>
        </div>
      }

      rowKey="id"
      search={{
        labelWidth: 120,
      }}

      request={async (params) => {
        return await InvoiceService.getInventoryInvoiceRequest(params);
      }}
      columns={columns}

    />
    {/*{open &&  <PrePurchaseRequestSavePage  onClose={ ()=>{*/}
    {/*  setOpen(false);*/}
    {/*  setCurrent(undefined);*/}
    {/*}}  data={current} open={open}   title={"新增"}></PrePurchaseRequestSavePage>}*/}


  </PageContainer>;
}




export default InvoiceListPage;
