import { ActionType, PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import {Button, Col, List, Modal, Row, Select, Tree} from 'antd';
import React, { useRef, useState } from 'react';

import { SupplierSelect } from '@/pages/inventory/purchase-request/SupplierSelect';
import InventoryPurchaseStatusSelect from '@/pages/inventory/purchase/InventoryPurchaseStatusSelect';
import PurchaseService from '@/pages/inventory/purchase/PurchaseService';
import {
  InventoryPurchaseListDto,
  InventoryPurchaseQueryParam,
  getStatusColor,
  getStatusLabel, FormStatusCommon,
} from '@/pages/inventory/purchase/type';
import OrganizeTreeSelect from '@/pages/organize-manage/organize/OrganizeTreeSelect';
import {InventoryInMethod} from "@/pages/inventory/in/type";

interface Props {
  open: boolean;
  close: (selectedPurchaseList:InventoryPurchaseListDto[]) => void;
  purchase:InventoryPurchaseListDto[];
  cancel:() => void;
  inventoryInMethod:InventoryInMethod;
}

const SelectPurchase: React.FC<Props> = (props) => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedPurchaseList, setSelectedPurchaseList] = useState<InventoryPurchaseListDto[]>(props.purchase);
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectRowKeys: React.Key[], selectedRows: InventoryPurchaseListDto[]) => {
      setSelectedPurchaseList(selectedRows);
      setSelectedRowKeys(selectRowKeys);
    },
    alwaysShowAlert: true,
  };

  const handleSave = () =>{
    props.close(selectedPurchaseList);
  }

  const columns: ProColumns<InventoryPurchaseListDto>[] = [
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
      title: '时间范围',
      dataIndex: 'dateRange',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => ({
          startBuyTime: value[0],
          endBuyTime: value[1],
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
        <InventoryPurchaseStatusSelect
          {...rest}
          onChange={(value) => form.setFieldValue(_.dataIndex, value)}
        />
      ),
    },
    {
      title: '开票状态',
      dataIndex: 'isCorrelationInventoryInvoice',
      valueType: 'select',
      hideInTable: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderFormItem: (_, { defaultRender, ...rest }, form) => (
        <Select
          style={{ width: '100%' }}
          {...rest}
          onChange={(value) => form.setFieldValue(_.dataIndex, value)}
          options={[
            {
              value: false,
              label: '未开票',
            },
            {
              value: true,
              label: '已开票',
            },
          ]}
        />
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
      title: '进货仓库',
      dataIndex: 'inventoryInHouseName',
      search: false,
    },
    {
      title: '批次编号',
      dataIndex: 'batchNumber',
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
      title: '进货日期',
      valueType: 'date',
      dataIndex: 'buyTime',
      search: false,
    },
    {
      title: '录入日期',
      valueType: 'date',
      dataIndex: 'createTime',
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      search: false,
    },
  ];

  // 自定义表格头部标题，包含多个按钮
  return  <Modal
    title='选择进货单据'
    centered
    open={props.open}
    onOk={handleSave}
    onCancel={props.cancel}
    width={1500}
  >
        <PageContainer pageHeaderRender={false}>
          <ProTable<InventoryPurchaseListDto, InventoryPurchaseQueryParam>
            actionRef={actionRef}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            rowSelection={
              {
                type:'radio',
                ...rowSelection
              }
            }
            search={{ labelWidth: 120 ,}}
            request={async (params) => {
              params.status = [FormStatusCommon.finished];
              params.isCorrelationInventoryIn = false;
              params.isMainInventoryHouse = props.inventoryInMethod===InventoryInMethod.inMain;
              return await PurchaseService.getInventoryPurchaseRequest(params);
            }}
            columns={columns}
          />
        </PageContainer>

  </Modal>;
}




export default SelectPurchase;
