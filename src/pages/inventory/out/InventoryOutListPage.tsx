import DeleteButton from '@/components/DelectButton';
import ExportButton from '@/components/ExcelButton/ExportButton';
import { toStringOfDay } from '@/components/Extension/DateTime';
import InventoryOutService from '@/pages/inventory/out/InventoryOutService';
import {
  InventoryOutGoodExcelDetail,
  InventoryOutListDto,
  InventoryOutMethod,
  InventoryOutQueryParam,
  InventoryOutStatus,
  getInventoryOutStatusColor,
  getInventoryOutStatusDescription,
  inventoryOutHeaders,
  outGoodHeader,
} from '@/pages/inventory/out/type';
import HouseSelect from '@/pages/inventory/purchase-request/HouseSelect';
import OrganizeTreeSelect from '@/pages/organize-manage/organize/OrganizeTreeSelect';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { useLocation } from '@umijs/max';
import { Button, Select } from 'antd';
import React, { useRef, useState } from 'react';

const InventoryOutListPage: React.FC = () => {
  const [current, setCurrent] = useState<InventoryOutListDto>();
  const [list, setList] = useState<boolean>(true);
  const actionRef = useRef<ActionType>();
  const location = useLocation();
  let method;
  if (location.pathname === '/inventory/out/normal') {
    method = InventoryOutMethod.normal;
  } else if (location.pathname === '/inventory/out/scrapOut') {
    method = InventoryOutMethod.scrapOut;
  } else if (location.pathname === '/inventory/out/inventorySheet') {
    method = InventoryOutMethod.inventorySheet;
  } else {
    method = InventoryOutMethod.returnGood;
  }
  const columns: ProColumns<InventoryOutListDto>[] = [
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
      dataIndex: 'inventoryOutHouseIds',
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
      hideInSearch: method === InventoryOutMethod.inventorySheet,
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
      hideInSearch: method === InventoryOutMethod.inventorySheet,
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
              value: InventoryOutStatus.auditing,
              label: '审核中',
            },
            {
              value: InventoryOutStatus.unExecuted,
              label: '未执行',
            },
            {
              value: InventoryOutStatus.executing,
              label: '执行中',
            },
            {
              value: InventoryOutStatus.executed,
              label: '已执行',
            },
          ]}
        />
      ),
    },
    {
      title: '单据编号',
      dataIndex: method !== InventoryOutMethod.inventorySheet ? 'code' : 'inventorySheetCode',
      valueType: 'textarea',
      search: false,
      width: 150,
    },
    {
      title: '执行状态',
      search: false,
      hideInTable: method === InventoryOutMethod.inventorySheet,
      width: 80,
      render: (text, record) => {
        return (
          <div
            style={{
              backgroundColor: getInventoryOutStatusColor(record.status, false),
              color: getInventoryOutStatusColor(record.status, true),
              padding: '5px',
            }}
          >
            {getInventoryOutStatusDescription(record.status)}
          </div>
        );
      },
    },
    {
      title: '相关工程',
      hideInTable: method === InventoryOutMethod.inventorySheet,
      dataIndex: 'engineeringName',
      valueType: 'textarea',
      search: false,
      width: 250,
    },
    {
      title: method !== InventoryOutMethod.inventorySheet ? '仓库' : '盘点仓库',
      dataIndex: 'inventoryOutHouseName',
      valueType: 'textarea',
      search: false,
      width: 100,
    },
    {
      title: '录入部门',
      dataIndex: 'organizeName',
      search: false,
      width: 100,
    },
    {
      hideInTable: method === InventoryOutMethod.inventorySheet,
      title: '流程名称',
      dataIndex: 'workflowDefinitionName',
      search: false,
      width: 100,
    },
    {
      hideInTable: method === InventoryOutMethod.inventorySheet,
      title: '当前步骤',
      search: false,
      width: 130,
      render: (_, record) =>
        record.workflowInstanceStatus?.length === 0 && record.todoHandleUsersName?.length === 0
          ? ''
          : `${record.workflowInstanceStatus}(${record.todoHandleUsersName})`,
    },
    {
      hideInTable: method === InventoryOutMethod.inventorySheet,
      title: '领料人',
      dataIndex: 'recipient',
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
      hideInTable: method === InventoryOutMethod.inventorySheet,
      title: '执行人',
      dataIndex: 'executedUserName',
      search: false,
      width: 100,
    },
    {
      hideInTable: method === InventoryOutMethod.inventorySheet,
      title: '执行时间',
      valueType: 'date',
      search: false,
      width: 100,
      render: (_, record) => {
        if (
          getInventoryOutStatusDescription(record.status) === '已完成' ||
          getInventoryOutStatusDescription(record.status) === '执行中' ||
          getInventoryOutStatusDescription(record.status) === '被退回'
        ) {
          return toStringOfDay(record.executedTime!);
        } else {
          return '';
        }
      },
    },

    {
      hideInTable: method === InventoryOutMethod.inventorySheet,
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
            await InventoryOutService.delete(record.id!);
            actionRef.current?.reload();
          }}
        ></DeleteButton>,
      ],
    },
  ];

  const fetchInventoryOutData = async (): Promise<{
    [sheetName: string]: InventoryOutListDto[];
  }> => {
    let params: InventoryOutQueryParam = {
      pageSize: 999999999,
      inventoryOutMethod: method,
    };
    let r = await InventoryOutService.list(params);
    return { 出库单据: r['data'] };
  };

  const fetchInventoryOutGoodData = async (): Promise<{
    [sheetName: string]: InventoryOutGoodExcelDetail[];
  }> => {
    let params: InventoryOutQueryParam = {
      pageSize: 999999999,
      inventoryOutMethod: method,
    };
    let r = await InventoryOutService.getGoodExcel(params);
    return { 物资信息: r };
  };

  // 自定义表格头部标题，包含多个按钮
  return (
    <>
      {list ? (
        <PageContainer pageHeaderRender={false}>
          <ProTable<InventoryOutListDto, InventoryOutQueryParam>
            actionRef={actionRef}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1500 }}
            headerTitle={
              <div>
                <Button
                  onClick={() => {
                    setCurrent(undefined);
                    setList(false);
                  }}
                  type="primary"
                  style={{ marginRight: 8 }}
                >
                  <PlusOutlined /> 新建
                </Button>
                <ExportButton
                  fileName={'出库单据'}
                  headers={inventoryOutHeaders}
                  fetchData={fetchInventoryOutData}
                  buttonName={'导出单据'}
                ></ExportButton>
                <ExportButton
                  fileName={'物资信息'}
                  headers={outGoodHeader}
                  fetchData={fetchInventoryOutGoodData}
                  buttonName={'导出物资'}
                ></ExportButton>
              </div>
            }
            rowKey="id"
            search={{
              labelWidth: 120,
            }}
            request={async (params) => {
              params.inventoryOutMethod = method;
              return await InventoryOutService.list(params);
            }}
            columns={columns}
          />{' '}
        </PageContainer>
      ) : null}
    </>
  );
};

export default InventoryOutListPage;
