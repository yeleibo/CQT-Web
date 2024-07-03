import { PageContainer, ProFormText, ProFormTextArea, ProTable } from '@ant-design/pro-components';
import { Button, Col, Form, Row } from 'antd';
import React from 'react';

import WorkflowInstanceOperateRecord from '@/pages/workflow/instance/WorkflowInstanceOperateRecord';

interface PrePurchaseRequestSaveProps{
  onClose: () => void;
  title: React.ReactNode;
  //onSave: () => void;
  data: any
}

const PrePurchaseRequestSavePage: React.FC<PrePurchaseRequestSaveProps> = () => {
  let baseInfo = (
    <Form>
      <Row>
        <Col span={12}>
          <ProFormText
            label="关联的工程"
            name="name"
            labelCol={{ span: 4 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 20 }} // 设置输入控件占据的栅格数
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label="部门"
            name="deparent"
            labelCol={{ span: 4 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 20 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormText
            label="关联的工程"
            name="name"
            labelCol={{ span: 4 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 20 }} // 设置输入控件占据的栅格数
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label="部门"
            name="deparent"
            labelCol={{ span: 4 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 20 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ProFormTextArea
            label="备注"
            name="remark"
            labelCol={{ span: 2 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 22 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>
      <div>物资明细</div>
      <ProTable
        rowKey="operateDateTime"
        search={false}
        toolBarRender={false}
        pagination={false}
        columns={[
          {
            title: '序号',
            dataIndex: 'name',
            valueType: 'textarea',
            search: false,
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
            title: '单位',
            dataIndex: 'typeCode',
            ellipsis: true,
          },
          {
            title: '数量',
            dataIndex: 'contactPersonName',
            width: 100,
          },
          {
            title: '备注',
            dataIndex: 'remark',
            width: 150,
            ellipsis: true,
          },
        ]}
      />
    </Form>
  );

  return (
    <PageContainer
      breadcrumbRender={false}
      onBack={() => null}
      header={{
        title: '新建要货单',
        extra: [
          <Button key="save" type="primary">
            保存
          </Button>,
          <Button key="submit" type="primary">
            提交
          </Button>,
          <Button key="cancel">取消</Button>,
        ],
      }}
      tabList={[
        {
          tab: '基本信息',
          key: 'base',
          closable: false,
          children: baseInfo,
        },
        {
          tab: '流转记录',
          key: 'info',
          // disabled:true,
          children: (
            <WorkflowInstanceOperateRecord
            ></WorkflowInstanceOperateRecord>
          ),
        },
      ]}
    ></PageContainer>
  );
};

export default PrePurchaseRequestSavePage;
