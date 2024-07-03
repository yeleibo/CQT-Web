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
  getInventoryRollbackStatusColor,
  getInventoryRollbackStatusDescription,
  InventoryRollbackListDto,
  InventoryRollbackMethod,
  InventoryRollbackQueryParam, InventoryRollbackStatus
} from "@/pages/inventory/rollback/type"
import DeleteButton from "@/components/DelectButton";
import {toStringOfDay} from "@/components/Extension/DateTime";
import OrganizeTreeSelect from "@/pages/organize-manage/organize/OrganizeTreeSelect";
import InventoryInSavePage from "@/pages/inventory/in/InventoryInSavePage"
import RollbackService from "@/pages/inventory/rollback/RollbackService";
import InExecutedPage from "@/pages/inventory/in/InExecutedPage";
import RollbackExecutedPage from "@/pages/inventory/rollback/RollBackExecutedPage";


const InventoryRollbackExecutePage: React.FC = () => {
  const [current, setCurrent] = useState<InventoryRollbackListDto>();
  const [list, setList] = useState<boolean>(true);
  const [openExecuted, setOpenExecuted] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const location = useLocation();
  let method;
  if(location.pathname === '/inventory/executed/inMainRollbackExecuted') {
    method = InventoryRollbackMethod.inventoryInMainRollback;
  }else if(location.pathname === '/inventory/executed/mainToSecondaryRollbackExecuted') {
    method = InventoryRollbackMethod.inventoryTransferMainToSecondaryRollback
  }else {
    method = InventoryRollbackMethod.inventoryOutNormal;
  }
  const columns: ProColumns<InventoryRollbackListDto>[] = [

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
              value: InventoryRollbackStatus.auditing,
              label: '审核中',
            },
              {
                value: InventoryRollbackStatus.unExecuted,
                label: '未执行',
              },{
              value: InventoryRollbackStatus.executing,
              label: '执行中',
            },{
              value:InventoryRollbackStatus.executed,
              label:'已执行'
            }]
          }
        />
      ),
    },
    {
      title: '单据编号',
      dataIndex: 'code',
      valueType: 'textarea',
      width:150,
      search: false,
    },
    {

      title: '执行状态',
      search:false,
      width:80,
      render: (text, record) => {
        return (
          <div style={{ backgroundColor: getInventoryRollbackStatusColor(record.status,false), color: getInventoryRollbackStatusColor(record.status,true),  padding:'5px'}}>
            {getInventoryRollbackStatusDescription(record.status)}
          </div>
        );
      }
    },
    {
      title: '相关工程',
      dataIndex: 'engineeringName',
      valueType: 'textarea',
      search: false,
      width:250,
    },
    {

      title: '录入部门',
      dataIndex: 'organizeName',
      width:100,
      search:false
    },
    {
      title: '流程名称',
      dataIndex: 'workflowDefinitionName',
      width:100,
      search:false
    },
    {
      title: '当前步骤',
      search:false,
      width:130,
      render: (_, record) =>
        (record.workflowInstanceStatus?.length === 0&&record.todoHandleUsersName?.length === 0)?'':`${record.workflowInstanceStatus}(${record.todoHandleUsersName})`
    },
    {
      title: '录入人',
      dataIndex: 'createByName',
      width:100,
      search:false
    },
    {
      title: '录入日期',
      valueType:'date',
      width:100,
      dataIndex: 'createTime',
      search:false
    },
    {
      title: '执行人',
      width:100,
      dataIndex: 'executedUserName',
      search:false
    },
    {
      title: '执行时间',
      valueType:'date',
      search:false,
      width:100,
      render:(_,record) => {
        if(getInventoryRollbackStatusDescription(record.status)==='已完成' || getInventoryRollbackStatusDescription(record.status)==='执行中' ||
          getInventoryRollbackStatusDescription(record.status)==='被退回'
        ){
          return toStringOfDay(record.executedTime!);
        }else {
          return  '';
        }

      }
    },

    {
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
          编辑
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
        record.status === InventoryRollbackStatus.unExecuted?<DeleteButton
          key="delete"
          onDelete={
            async () => {
              await RollbackService.delete(record.id!);
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
    {list ? <PageContainer pageHeaderRender={false}><ProTable<InventoryRollbackListDto, InventoryRollbackQueryParam>
      actionRef={actionRef}
      pagination={{pageSize: 10}}
      scroll={{ x: 1500,  }}

      rowKey="id"
      search={{
        labelWidth: 120,
      }}

      request={async (params) => {
        params.inventoryRollbackMethod=method;
        params.status = [InventoryRollbackStatus.unExecuted,InventoryRollbackStatus.executing];
        return await RollbackService.list(params);
      }}
      columns={columns}

    />

      {openExecuted &&  <RollbackExecutedPage close={ ()=>{
        setOpenExecuted(false)
      }} code={current!.code!} id={current!.id} open={openExecuted}

                                        reload={()=>{
                                          actionRef.current?.reload();
                                        }}></RollbackExecutedPage>}
    </PageContainer> : null}
  </>
    ;
}


export default InventoryRollbackExecutePage;
