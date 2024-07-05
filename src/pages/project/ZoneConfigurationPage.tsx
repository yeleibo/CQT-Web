import React, {useRef, useState} from "react";
import {AreaDto, AreaStatisticsQueryParam} from "@/pages/project/type";
import {ActionType, PageContainer, ProColumns, ProTable} from "@ant-design/pro-components";
import {Button, message} from "antd";
import UserService from "@/pages/organize-manage/user/UserService";
import DeleteButton from "@/components/DelectButton";
import {PlusOutlined} from "@ant-design/icons";
import UserAddPage from "@/pages/organize-manage/user/UserAddPage";
import AreaService from "@/pages/project/AreaService";

const ZoneConfigurationPage:React.FC = ()=>{
   const [areaDto, setAreaDto] = useState<AreaDto>();
  const [list, setList] = React.useState<boolean>(true);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<AreaDto>[] = [
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

    },
    {
      title: '状态',
      dataIndex: 'organizeName',
      valueType: 'textarea',
      search: false,

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
        <Button key='export' type='text'>
           导出
        </Button>,
        <Button
          type="link"
          onClick={async () => {

          }}
          key="submit"
          style={{ padding: 0 }}
        >
          提交
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
     <PageContainer pageHeaderRender={false}>
       <ProTable<AreaDto, AreaStatisticsQueryParam>
         actionRef={actionRef}
         pagination={{ pageSize: 10 }}
         headerTitle={
           <Button onClick={() => {}} type="primary" style={{ marginRight: 8 }}>
             <PlusOutlined /> 新建
           </Button>
         }
         rowKey="id"
         search={{ labelWidth: 120 }}
         columns={columns}
         request={async (params) => {
           const areas = await AreaService.getAreaStatistics(params);
           return { data: areas, success: true, total: areas.length };
         }}
       />
     </PageContainer>
   </>
}

export default ZoneConfigurationPage
