import { ActionType, PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { useLocation } from '@umijs/max';
import { Button, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import DeleteButton from '@/components/DelectButton';
import { toStringOfDay } from '@/components/Extension/DateTime';
import InExecutedPage from '@/pages/inventory/in/InExecutedPage';
import InventoryInService from '@/pages/inventory/in/InventoryInService';
import {
  InventoryInListDto,
  InventoryInMethod,
  InventoryInQueryParam,
  InventoryInStatus,
  getInventoryInStatusColor,
  getInventoryInStatusLabel,
} from '@/pages/inventory/in/type';
import HouseSelect from '@/pages/inventory/purchase-request/HouseSelect';
import { SupplierSelect } from '@/pages/inventory/purchase-request/SupplierSelect';
import OrganizeTreeSelect from '@/pages/organize-manage/organize/OrganizeTreeSelect';

const InventoryInExecutedPage: React.FC = () => {
  const [current, setCurrent] = useState<InventoryInListDto>();
  const [list, setList] = useState<boolean>(true);
  const [openExecuted, setOpenExecuted] = useState<boolean>(false);
  const [method, setMethod] = useState<InventoryInMethod>(InventoryInMethod.inMain);
  const actionRef = useRef<ActionType>();
  const location = useLocation();
  useEffect(() => {
    let methodTemp: InventoryInMethod;

    if (location.pathname === '/inventory/executed/mainExecuted') {
      methodTemp = InventoryInMethod.inMain;
    } else {
      methodTemp = InventoryInMethod.inSecondary;
    }

    setMethod(methodTemp);
  }, [location.pathname]);
  const columns: ProColumns<InventoryInListDto>[] = [
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
      title: '相关仓库',
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
      hideInSearch: method === InventoryInMethod.inventorySheet,
      hideInTable: true,
      search: {
        transform: (value) => ({
          startExecutedTime: value[0],
          endExecutedTime: value[1],
        }),
      },
    },
    {
      title: '供应商',
      dataIndex: 'supplierIds',
      valueType: 'select',
      hideInSearch: method === InventoryInMethod.inventorySheet,
      hideInTable: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderFormItem: (_, { defaultRender, ...rest }, form) => (
        <SupplierSelect {...rest} onChange={(value) => form.setFieldValue(_.dataIndex, value)} />
      ),
    },
    {
      title: '执行状态',
      dataIndex: 'status',
      valueType: 'select',
      hideInSearch: method === InventoryInMethod.inventorySheet,
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
              value: InventoryInStatus.unExecuted,
              label: '未执行',
            },
            {
              value: InventoryInStatus.executing,
              label: '执行中',
            },
            {
              value: InventoryInStatus.executed,
              label: '已执行',
            },
          ]}
        />
      ),
    },
    {
      title: '单据编号',
      dataIndex: method !== InventoryInMethod.inventorySheet ? 'code' : 'inventorySheetCode',
      valueType: 'textarea',
      width: 150,
      search: false,
    },
    {
      title: '执行状态',
      search: false,
      hideInTable: method === InventoryInMethod.inventorySheet,
      width: 80,
      render: (text, record) => {
        return (
          <div
            style={{
              backgroundColor: getInventoryInStatusColor(record.status, false),
              color: getInventoryInStatusColor(record.status, true),
              padding: '5px',
            }}
          >
            {getInventoryInStatusLabel(record.status)}
          </div>
        );
      },
    },
    {
      title:
        method === InventoryInMethod.inMain
          ? '供应商名称'
          : method === InventoryInMethod.inSecondary
          ? '相关工程'
          : '盘点仓库',
      dataIndex:
        method === InventoryInMethod.inMain
          ? 'supplierName'
          : method === InventoryInMethod.inSecondary
          ? 'engineeringName'
          : 'inventoryInHouseName',
      valueType: 'textarea',
      search: false,
      width: 200,
    },
    {
      title: '录入部门',
      dataIndex: 'organizeName',
      search: false,
      width: 100,
    },
    {
      hideInTable: method === InventoryInMethod.inventorySheet,
      title: '流程名称',
      dataIndex: 'workflowDefinitionName',
      search: false,
      width: 100,
    },
    {
      hideInTable: method === InventoryInMethod.inventorySheet,
      title: '当前步骤',
      width: 130,
      search: false,
      render: (_, record) =>
        record.workflowInstanceStatus?.length === 0 && record.todoHandleUsersName?.length === 0
          ? ''
          : `${record.workflowInstanceStatus}(${record.todoHandleUsersName})`,
    },
    {
      hideInTable: method === InventoryInMethod.inventorySheet,
      title: '入库仓库',
      dataIndex: 'inventoryInHouseName',
      search: false,
      width: 100,
    },
    {
      hideInTable: method === InventoryInMethod.inventorySheet,
      title: '存放位置',
      dataIndex: 'inventoryInStorageLocation',
      search: false,
      width: 100,
    },
    {
      title: '录入人',
      dataIndex: 'createByName',
      search: false,
      width: 100,
    },
    {
      title: '录入日期',
      valueType: 'date',
      dataIndex: 'createTime',
      search: false,
      width: 100,
    },
    {
      hideInTable: method === InventoryInMethod.inventorySheet,
      title: '执行人',
      dataIndex: 'executedUserName',
      search: false,
      width: 100,
    },
    {
      hideInTable: method === InventoryInMethod.inventorySheet,
      title: '执行时间',
      valueType: 'date',
      width: 100,
      search: false,
      render: (_, record) => {
        if (
          getInventoryInStatusLabel(record.status) === '已完成' ||
          getInventoryInStatusLabel(record.status) === '执行中' ||
          getInventoryInStatusLabel(record.status) === '被退回'
        ) {
          return toStringOfDay(record.executedTime!);
        } else {
          return '';
        }
      },
    },

    {
      hideInTable: method === InventoryInMethod.inventorySheet,
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

        <Button
          type={'link'}
          onClick={() => {
            setCurrent(record);
            setOpenExecuted(true);
          }}
          key="execute"
          style={{ padding: 0 }}
        >
          执行
        </Button>,
        record.status === InventoryInStatus.unExecuted ? (
          <DeleteButton
            key="delete"
            onDelete={async () => {
              await InventoryInService.delete(record.id!);
              actionRef.current?.reload();
            }}
          ></DeleteButton>
        ) : null,
      ],
    },
  ];

  // 自定义表格头部标题，包含多个按钮
  return (
    <>
      {list ? (
        <PageContainer pageHeaderRender={false}>
          <ProTable<InventoryInListDto, InventoryInQueryParam>
            actionRef={actionRef}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1500 }}
            rowKey="id"
            search={{
              labelWidth: 120,
            }}
            request={async (params) => {
              params.inventoryInMethod = method;
              params.status = [InventoryInStatus.unExecuted, InventoryInStatus.executing];
              return await InventoryInService.list(params);
            }}
            columns={columns}
          />
          {openExecuted && (
            <InExecutedPage
              close={() => {
                setOpenExecuted(false);
              }}
              code={current!.code!}
              id={current!.id}
              open={openExecuted}
              reload={() => {
                actionRef.current?.reload();
              }}
            ></InExecutedPage>
          )}
        </PageContainer>
      ) : null}
    </>
  );
};

export default InventoryInExecutedPage;
