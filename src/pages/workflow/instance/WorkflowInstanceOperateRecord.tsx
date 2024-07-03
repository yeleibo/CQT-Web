import {type ProColumns, ProTable} from "@ant-design/pro-components";
import React, {useEffect, useState} from "react";
import {HandleRecord} from "@/pages/Workflow/Instance/typings";
import {  Image } from 'antd';
interface Props {
  ///工作实例id
  workflowInstanceId?:string;
}
const WorkflowInstanceOperateRecord: React.FC<Props> = (props) => {
  const [data,setData]=useState<HandleRecord[]>([])
  useEffect(()=>{
    if(props.workflowInstanceId){
      setData([
        {
          activityName: '开始节点',
          handleUserName: '张三',
          operateDateTime: new Date(),
          operateName: '发起',
          remark: '发起流程',
        },
        {
          activityName: '审批节点',
          handleUserName: '李四12',
          operateDateTime: new Date(),
          operateName: '同意',
        }
      ])
   }
  },[])
  let columns:ProColumns<HandleRecord>[]=[
    {
      title: '节点名称',
      dataIndex: 'activityName',
      ellipsis: true,
    },
    {
      title: '操作人',
      dataIndex: 'handleUserName',
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'operateDateTime',
      ellipsis: true,
      render: (text,record) => {
         return <>{record.operateDateTime.toLocaleString()}</>;
      }
    },
    {
      title: '执行动作',
      dataIndex: 'operateName',
      ellipsis: true,
    },
    {
      title: '签名',
      dataIndex: 'operateName',
      hideInSearch:true,
      ellipsis: true,
      render: (text,record) => {
        if (!record.signature) {
          return null;
        }

        // 将 Uint8Array 转换为 Base64
        let base64String = btoa(String.fromCharCode(...record.signature));

        return (
          <Image
            width={60}
            height={30}
            src={`data:image/png;base64,${base64String}`}
          ></Image>
        );
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
    },
  ]
  return  <ProTable<HandleRecord,any>
    rowKey="operateDateTime"
    search={false}
    toolBarRender={false}
    pagination={false}
    columns={columns}
    dataSource={data}

  />
}

export  default  WorkflowInstanceOperateRecord;
