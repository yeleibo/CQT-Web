import React from "react";

interface  Props{
  workflowDefinitionId?:string;
}
///工作流设计器
const WorkflowDefinitionDesigner: React.FC<Props> = (props) => {
  return <>
    工作流设计器{props.workflowDefinitionId}
  </>
}

export  default  WorkflowDefinitionDesigner;
