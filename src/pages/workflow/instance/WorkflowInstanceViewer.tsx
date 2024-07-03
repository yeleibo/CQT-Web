import React from "react";

interface  Props{
  workflowInstanceId?:string;
}
///工作流实例预览
const WorkflowInstanceViewer: React.FC<Props> = (props) => {
  return <>
    工作流预览{props.workflowInstanceId}
  </>
}

export  default  WorkflowInstanceViewer;
