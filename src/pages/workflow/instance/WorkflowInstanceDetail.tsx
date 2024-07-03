import {PageContainer} from "@ant-design/pro-components";
import {Button,  message} from "antd";
import WorkflowInstanceOperateRecord from "@/pages/workflow/instance/WorkflowInstanceOperateRecord";
import React from "react";

export interface WorkflowInstanceDetailProps {
  title: React.ReactNode;
  workflowInstanceId?: string;
  onClose?: () => void;
  //保存
  onSave?: () => void;
  //提交
  onSubmit?: () => void;
}
///通用工作流页面，如果比较特殊的最好自己再写一个
const WorkflowInstanceDetail: React.FC<WorkflowInstanceDetailProps & {children:React.ReactNode}> = (props) => {

  let operationButtons = props.workflowInstanceId ? [
    <Button key="handle" type="primary" onClick={() => {
      message.info("弹窗");
    }}>提交</Button>,
    <Button key="rollback" type="primary">退回</Button>,
  ] :[
    (!props.onSave?<></>:<Button key="save" type="primary">保存</Button>),
    <Button key="submit" type="primary">提交</Button>,
  ] ;

  return <PageContainer

    style={{backgroundColor:"#fff",margin:"0px 20px 0px 20px"}}
    breadcrumbRender={false}
    onBack={props.onClose}
    header={{
      title: props.title,
      extra: operationButtons,
    }}
    tabList={[
      {
        tab: '基本信息',
        key: 'base',
        closable: false,
        children: props.children,
      },
      ...(!props.workflowInstanceId ? [] : [{
        tab: '流转记录',
        key: 'info',
        // disabled:true,
        children: <WorkflowInstanceOperateRecord
          workflowInstanceId={props.workflowInstanceId}></WorkflowInstanceOperateRecord>,
      }]),
    ]}

  ></PageContainer>;
};
export default WorkflowInstanceDetail;
