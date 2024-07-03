import React, {useRef, useState} from "react";
import { useLocation, } from '@umijs/max';
import {
  ActionType,
  type ProColumns,

  ProTable,
  PageContainer
} from "@ant-design/pro-components";
import {Button, Select} from "antd";
import {
  getInventoryOutStatusColor,
  InventoryOutListDto,
  InventoryOutMethod,
  InventoryOutQueryParam,
  getInventoryOutStatusDescription, InventoryOutStatus
} from "@/pages/inventory/out/type"
import DeleteButton from "@/components/DelectButton";
import InventoryInSavePage from "@/pages/inventory/in/InventoryInSavePage";
import {toStringOfDay} from "@/components/Extension/DateTime";
import OrganizeTreeSelect from "@/pages/organize-manage/organize/OrganizeTreeSelect";
import HouseSelect from "@/pages/inventory/purchase-request/HouseSelect";
import InventoryOutService from "@/pages/inventory/out/InventoryOutService";
import OutExecutedPage from "@/pages/inventory/out/OutExecutedPage";


const InventoryOutExecutedPage: React.FC = () => {
  const [current, setCurrent] = useState<InventoryOutListDto>();
  const [list, setList] = useState<boolean>(true);
  const [openExecuted, setOpenExecuted] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const location = useLocation();
  let method;
  if(location.pathname === '/inventory/executed/normalOutExecuted') {
    method = InventoryOutMethod.normal;
  }else if(location.pathname === '/inventory/executed/scrapOutExecuted') {
    method = InventoryOutMethod.scrapOut
  }else {
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
      hideInTable:true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderFormItem: (_, { defaultRender, ...rest }, form) => (
        <HouseSelect
          {...rest}
          onChange={(value) => form.setFieldValue(_.dataIndex, value)}
        />
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
      hideInSearch:method === InventoryOutMethod.inventorySheet,
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
      hideInSearch:method === InventoryOutMethod.inventorySheet,
      hideInTable:true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderFormItem: (_, { defaultRender, ...rest }, form) => (
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          {...rest}
          onChange={(value) => form.setFieldValue(_.dataIndex, value)}
          options={
            [{
              value: InventoryOutStatus.auditing,
              label: '审核中',
            },
              {
                value: InventoryOutStatus.unExecuted,
                label: '未执行',
              },{
              value: InventoryOutStatus.executing,
              label: '执行中',
            },{
              value:InventoryOutStatus.executed,
              label:'已执行'
            }]
          }
        />
      ),
    },
    {
      title: '单据编号',
      dataIndex: method !== InventoryOutMethod.inventorySheet?'code':'inventorySheetCode',
      valueType: 'textarea',
      search: false,
      width:150,
    },
    {

      title: '执行状态',
      search:false,
      hideInTable:method === InventoryOutMethod.inventorySheet,
      width:80,
      render: (text, record) => {
        return (
          <div style={{ backgroundColor: getInventoryOutStatusColor(record.status,false), color: getInventoryOutStatusColor(record.status,true),  padding:'5px'}}>
            {getInventoryOutStatusDescription(record.status)}
          </div>
        );
      }
    },
    {
      title: '相关工程',
      hideInTable:method === InventoryOutMethod.inventorySheet,
      dataIndex: 'engineeringName',
      valueType: 'textarea',
      search: false,
      width:250,
    },
    {
      title: method !== InventoryOutMethod.inventorySheet?'仓库':'盘点仓库',
      dataIndex: 'inventoryOutHouseName',
      valueType: 'textarea',
      width:100,
      search: false,
    },
    {

      title: '录入部门',
      dataIndex: 'organizeName',
      search:false,
      width:100,
    },
    {
      hideInTable:method === InventoryOutMethod.inventorySheet,
      title: '流程名称',
      width:100,
      dataIndex: 'workflowDefinitionName',
      search:false
    },
    {
      hideInTable:method === InventoryOutMethod.inventorySheet,
      title: '当前步骤',
      search:false,
      width:130,
      render: (_, record) =>
        (record.workflowInstanceStatus?.length === 0&&record.todoHandleUsersName?.length === 0)?'':`${record.workflowInstanceStatus}(${record.todoHandleUsersName})`
    },
    {
      hideInTable:method === InventoryOutMethod.inventorySheet,
      title: '领料人',
      width:100,
      dataIndex: 'recipient',
      search:false
    },
    {
      title: '录入人',
      width:100,
      dataIndex: 'createByName',
      search:false
    },
    {
      title: '录入日期',
      valueType:'date',
      dataIndex: 'createTime',
      width:100,
      search:false
    },
    {
      hideInTable:method === InventoryOutMethod.inventorySheet,
      title: '执行人',
      dataIndex: 'executedUserName',
      width:100,
      search:false
    },
    {
      hideInTable:method === InventoryOutMethod.inventorySheet,
      title: '执行时间',
      valueType:'date',
      width:100,
      search:false,
      render:(_,record) => {
        if(getInventoryOutStatusDescription(record.status)==='已完成' || getInventoryOutStatusDescription(record.status)==='执行中' ||
          getInventoryOutStatusDescription(record.status)==='被退回'
        ){
          return toStringOfDay(record.executedTime!);
        }else {
          return  '';
        }

      }
    },

    {
      hideInTable:method === InventoryOutMethod.inventorySheet,
      title: '备注',
      dataIndex: 'remark',
      width: 150,
      search:false,
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
          style={{padding: 0}}
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
        </Button>
        ,
        record.status === InventoryOutStatus.unExecuted?<DeleteButton
          key="delete"
          onDelete={
            async () => {
              await InventoryOutService.delete(record.id!);
              actionRef.current?.reload();
            }
          }
        >
        </DeleteButton>:null,
      ],
    },
  ];

  // 自定义表格头部标题，包含多个按钮
  return <>
    {list ? <PageContainer pageHeaderRender={false}><ProTable<InventoryOutListDto, InventoryOutQueryParam>
      actionRef={actionRef}
      pagination={{pageSize: 10}}
      scroll={{ x: 1500,  }}

      rowKey="id"
      search={{
        labelWidth: 120,
      }}

      request={async (params) => {
        params.inventoryOutMethod=method;
        params.status=[InventoryOutStatus.unExecuted,InventoryOutStatus.executing];
        return await InventoryOutService.list(params);
      }}
      columns={columns}

    />
      {openExecuted &&  <OutExecutedPage close={ ()=>{
        setOpenExecuted(false)
      }} code={current!.code!} id={current!.id} open={openExecuted}

                                        reload={()=>{
                                          actionRef.current?.reload();
                                        }}></OutExecutedPage>}

    </PageContainer> : null}
  </>
    ;
}


export default InventoryOutExecutedPage;
