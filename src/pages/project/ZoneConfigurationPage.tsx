import React, {useRef, useState} from "react";
import {AreaDto} from "@/pages/project/type";
import {ActionType, ProColumns} from "@ant-design/pro-components";
import {UserItem} from "@/pages/organize-manage/user/UserTypings";
import {Button, message} from "antd";
import UserService from "@/pages/organize-manage/user/UserService";
import DeleteButton from "@/components/DelectButton";

const ZoneConfigurationPage:React.FC = ()=>{
   const [areaDto, setAreaDto] = useState<AreaDto>();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<UserItem>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },

    {
      title: '序号',
      valueType: 'text',
      search: false,
      render:(text, record,index) =>
        index+1
      ,
    },
    {
      title: '地区名',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'organizeName',
      valueType: 'textarea',
      search: false,
      width: 100,
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 300,
      render: (_, record) => [
        <Button type="link" onClick={() => {}} key="edit" style={{ padding: 0 }}>
          编辑
        </Button>,
        <Button
          type="link"
          onClick={async () => {
            try {
              await UserService.resetPassWord(record.id!);
              message.success('操作成功');
              await actionRef.current?.reload();
            } catch (error) {
              message.error('操作失败');
            }
          }}
          key="reset"
          style={{ padding: 0 }}
        >
          密码重置
        </Button>,

        <DeleteButton
          key="delete"
          onDelete={async () => {
            await UserService.delete(record.id!);
            actionRef.current?.reload();
          }}
        />,
      ],
    },
  ];
   return <>

   </>
}

export default ZoneConfigurationPage
