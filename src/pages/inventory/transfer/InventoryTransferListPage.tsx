import DeleteButton from '@/components/DelectButton';
import { toStringOfDay } from '@/components/Extension/DateTime';
import InventoryInSavePage from '@/pages/inventory/in/InventoryInSavePage';
import HouseSelect from '@/pages/inventory/purchase-request/HouseSelect';
import TransferService from '@/pages/inventory/transfer/TransferService';
import {
  InventoryTransferListDto,
  InventoryTransferMethod,
  InventoryTransferQueryParam,
  InventoryTransferStatus,
  getStatusColor,
  getStatusLabel, transferHeaders, transferGoodHeader, InventoryTransferGoodExcelDetail,
} from '@/pages/inventory/transfer/type';
import OrganizeTreeSelect from '@/pages/organize-manage/organize/OrganizeTreeSelect';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { useLocation } from '@umijs/max';
import { Button, Select } from 'antd';
import React, { useRef, useState } from 'react';
import ExportButton, {CellValue} from "@/components/ExcelButton/ExportButton";
import {
  InventoryPurchaseRequestListDto,
  InventoryPurchaseRequestQueryParam
} from "@/pages/inventory/purchase-request/type";
import PurchaseRequestService from "@/pages/inventory/purchase-request/PurchaseRequestService";

const InventoryTransferListPage: React.FC = () => {
  const [current, setCurrent] = useState<InventoryTransferListDto>();
  const [list, setList] = useState<boolean>(true);
  const actionRef = useRef<ActionType>();
  const location = useLocation();
  let method;
  if (location.pathname === '/inventory/transfer/mainToSecondary') {
    method = InventoryTransferMethod.mainToSecondary;
  } else if (location.pathname === '/inventory/transfer/secondaryToMain') {
    method = InventoryTransferMethod.secondaryToMain;
  } else {
    method = InventoryTransferMethod.secondaryToSecondary;
  }
  const columns: ProColumns<InventoryTransferListDto>[] = [
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
      title: '出库仓库',
      dataIndex: 'inventoryOutHouseIds',
      valueType: 'select',
      hideInTable: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderFormItem: (_, { defaultRender, ...rest }, form) => (
        <HouseSelect {...rest} onChange={(value) => form.setFieldValue(_.dataIndex, value)} />
      ),
    },
    {
      title: '入库仓库',
      dataIndex: 'inventoryInHouseIds',
      valueType: 'select',
      hideInTable: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderFormItem: (_, { defaultRender, ...rest }, form) => (
        <HouseSelect {...rest} onChange={(value) => form.setFieldValue(_.dataIndex, value)} />
      ),
    },
    {
      title: '录入时间',
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
      title: '执行时间',
      dataIndex: 'executedTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => ({
          startExecutedTime: value[0],
          endExecutedTime: value[1],
        }),
      },
    },
    {
      title: '执行状态',
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
              value: InventoryTransferStatus.auditing,
              label: '审核中',
            },
            {
              value: InventoryTransferStatus.unExecuted,
              label: '未执行',
            },
            {
              value: InventoryTransferStatus.executing,
              label: '执行中',
            },
            {
              value: InventoryTransferStatus.executed,
              label: '已执行',
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
      width:150,
    },
    {
      title: '执行状态',
      search: false,
      width: 80,
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
      title: method === InventoryTransferMethod.secondaryToSecondary ? '调出工程' : '相关工程',
      dataIndex:
        method === InventoryTransferMethod.mainToSecondary
          ? 'inventoryInEngineeringName'
          : 'inventoryOutEngineeringName',
      valueType: 'textarea',
      search: false,
      width:250,
    },
    {
      title: '调入工程',
      dataIndex: 'inventoryInEngineeringName',
      valueType: 'textarea',
      hideInTable: method !== InventoryTransferMethod.secondaryToSecondary,
      search: false,
      width:250,
    },
    {
      title: '录入部门',
      dataIndex: 'organizeName',
      search: false,
      width:100,
    },
    {
      title: '流程名称',
      dataIndex: 'workflowDefinitionName',
      search: false,
      width:100,
    },
    {
      title: '当前步骤',
      search:false,
      width:130,
      render: (_, record) =>
        (record.workflowInstanceStatus?.length === 0&&record.todoHandleUsersName?.length === 0)?'':`${record.workflowInstanceStatus}(${record.todoHandleUsersName})`
    },
    {
      title: '出库仓库',
      dataIndex: 'inventoryOutHouseName',
      search: false,
      width:100,
    },
    {
      title: '入库仓库',
      dataIndex: 'inventoryInHouseName',
      search: false,
      width:100,
    },
    {
      title: '录入人',
      dataIndex: 'createByName',
      search: false,
      width:100,
    },
    {
      title: '录入日期',
      valueType: 'date',
      dataIndex: 'createTime',
      search: false,
      width:100,
    },
    {
      title: '执行人',
      dataIndex: 'executedUserName',
      search: false,
      width:100,
    },
    {
      title: '执行时间',
      valueType: 'date',
      search: false,
      width:100,
      render: (_, record) => {
        if (
          getStatusLabel(record.status) === '已完成' ||
          getStatusLabel(record.status) === '执行中' ||
          getStatusLabel(record.status) === '被退回'
        ) {
          return toStringOfDay(record.executedTime!);
        } else {
          return '';
        }
      },
    },

    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
      search: false,
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
            setList(false);
          }}
          key="view"
          style={{ padding: 0 }}
        >
          详情
        </Button>,
        <DeleteButton
          key="delete"
          onDelete={async () => {
            await TransferService.delete(record.id!);
            actionRef.current?.reload();
          }}
        ></DeleteButton>,
      ],
    },
  ];

  const fetchInventoryTransferData = async (): Promise<{ [sheetName: string]:  InventoryTransferListDto[]}> => {
    let params:InventoryTransferQueryParam = {
      pageSize:99999999,
      inventoryTransferMethod:method
    };
    let r= await TransferService.list(params);
    return  {'移库单据':r["data"]};
  };

  const fetchInventoryTransferGoodData = async (): Promise<{ [sheetName: string]:  InventoryTransferGoodExcelDetail[]}> => {
    let params:InventoryTransferQueryParam = {
      pageSize:99999999,
      inventoryTransferMethod:method
    };
    let r= await TransferService.getGoodExcel(params);
    return  {'物资信息':r};
  };

  // 自定义表格头部标题，包含多个按钮
  return <>
    {list ? <PageContainer pageHeaderRender={false}><ProTable<InventoryTransferListDto, InventoryTransferQueryParam>
      actionRef={actionRef}
      pagination={{pageSize: 10}}
      scroll={{ x: 1500,  }}
      headerTitle={
        <div>
          <Button onClick={() => {
            setCurrent(undefined);
            setList(false);

          }} type="primary" style={{marginRight: 8}}>
            <PlusOutlined/> 新建
          </Button>
          <ExportButton
            fileName={'移库单据'}
            headers={transferHeaders}
            fetchData={fetchInventoryTransferData}
            buttonName={'导出单据'}></ExportButton>
          <ExportButton
            fileName={'物资信息'}
            headers={transferGoodHeader}
            fetchData={fetchInventoryTransferGoodData}
            buttonName={'导出物资'}></ExportButton>
        </div>
      }

      rowKey="id"
      search={{
        labelWidth: 120,
      }}

      request={async (params) => {
        params.inventoryTransferMethod=method;
        return await TransferService.list(params);
      }}
      columns={columns}

    /> </PageContainer> : null}
  </>
    ;
}


export default InventoryTransferListPage;
