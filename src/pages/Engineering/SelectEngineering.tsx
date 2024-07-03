import { ActionType, PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import {Button, Col, List, Modal, Row, Select, Tree} from 'antd';
import React, { useRef, useState } from 'react';
import EngineeringService from "@/pages/Engineering/EngineeringService";
import {EngineeringItem, EngineeringParams} from "@/pages/Engineering/typings";

interface Props {
  open: boolean;
  close: (selectedEngineering:EngineeringItem[]) => void;
  engineering:EngineeringItem[];
  cancel:() => void;
}

const SelectEngineering: React.FC<Props> = (props) => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedEngineering, setSelectedEngineering] = useState<EngineeringItem[]>(props.engineering);
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectRowKeys: React.Key[], selectedRows: EngineeringItem[]) => {
      setSelectedEngineering(selectedRows);
      setSelectedRowKeys(selectRowKeys);
    },
    alwaysShowAlert: true,
  };

  const handleSave = () =>{
    props.close(selectedEngineering);
  }

  const columns: ProColumns<EngineeringItem>[] = [

    {
      title: '关键字',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
    },

    {
      title: '编码',
      dataIndex: 'code',
      valueType: 'textarea',
      search: false,
    },
    {

      title: '类型',
      dataIndex: 'typeCode',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'contactPersonName',
      width: 100,
    },
    {

      title: '录入部门',
      dataIndex: 'createOrganizeName',
    },

    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
      ellipsis: true,
    },
  ];

  // 自定义表格头部标题，包含多个按钮
  return  <Modal
    title='选择工程单据'
    centered
    open={props.open}
    onOk={handleSave}
    onCancel={props.cancel}
    width={1500}
  >
    <PageContainer pageHeaderRender={false}>
      <ProTable<EngineeringItem, EngineeringParams>
        actionRef={actionRef}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        rowSelection={
          {
            type:'radio',
            ...rowSelection
          }
        }
        search={{ labelWidth: 120 ,}}
        request={async (params) => {
          return await EngineeringService.list(params);
        }}
        columns={columns}
      />
    </PageContainer>

  </Modal>;
}




export default SelectEngineering;
