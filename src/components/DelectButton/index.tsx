import PermissionButton from "@/components/PermissionButton";
import React from "react";

interface  DeleteButtonProps{
  onDelete: (id:any) =>void;
}

const DeleteButton:React.FC<DeleteButtonProps> = (props) => {

  return   <PermissionButton

    danger
    color="red"
    key="delete"
    type="link"
    isPermission={true}
    popConfirm={{
      title: "是否删除?",
      onConfirm: props.onDelete,
    }}

    style={{padding: 0}}
  >
    删除
  </PermissionButton>;
}
export  default  DeleteButton;
