import PermissionButton from "@/components/PermissionButton";
import React from "react";
import {useIntl} from "@@/plugin-locale";

interface  DeleteButtonProps{
  onDelete: (id:any) =>void;
}

const DeleteButton:React.FC<DeleteButtonProps> = (props) => {
  const intl = useIntl();

  return   <PermissionButton

    danger
    color="red"
    key="delete"
    type="link"
    isPermission={true}
    popConfirm={{
      title: `${intl.formatMessage({id:'confirmDelete'})}?`,
      onConfirm: props.onDelete,
    }}
    style={{padding: 0}}
  >
    {intl.formatMessage({id: "delete"})}
  </PermissionButton>;
}
export  default  DeleteButton;
