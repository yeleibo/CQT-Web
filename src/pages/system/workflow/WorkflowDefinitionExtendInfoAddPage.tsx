import OrganizeTreeSelect from '@/pages/organize-manage/organize/OrganizeTreeSelect';
import WorkflowDefinitionService from '@/pages/system/workflow/WorkflowDefinitionService';
import WorkflowDefinitionTypeSelect from '@/pages/system/workflow/WorkflowDefinitionTypeSelect';
import {
  WorkflowDefinitionExtendInfo,
  WorkflowDefinitionType,
} from '@/pages/system/workflow/typings';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Col, Form, Row, message } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  close: () => void;
  reload: () => void;
  data?: WorkflowDefinitionExtendInfo;
  model: 'add' | 'edit';
}

const WorkflowDefinitionExtendInfoAddPage = (props: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showFormConfig, setShowFormConfig] = useState(false);

  useEffect(() => {
    if (props.open) {
      // 初始化表单
      if (props.model === 'edit') {
        form.setFieldsValue(props.data);
      }
      if (props.data?.type === WorkflowDefinitionType.commonForm) {
        setShowFormConfig(true);
      } else {
        setShowFormConfig(false);
      }
    }
  }, [props.open, props.data]);

  const handleSave = async () => {
    try {
      const formData = await form.validateFields();
      if (!formData) return;
      if (formData.id === '') {
        delete formData.id;
      }

      const extraFormData = { ...props.data, ...formData };
      setLoading(true);
      let res;
      if (props.model === 'add') {
        res = await WorkflowDefinitionService.add(extraFormData);
        message.success('添加成功');
      } else {
        res = await WorkflowDefinitionService.edit(extraFormData);
        message.success('修改成功');
      }
      if (props.reload) {
        props.reload();
      }
      props.close();
      form.resetFields();
      if ((window as any).onTabSaveSuccess) {
        (window as any).onTabSaveSuccess(res);
        setTimeout(() => window.close(), 300);
      }
    } catch (error) {
      setLoading(false);
      console.error('Failed to save:', error);
    }
  };

  return (
    <ModalForm
      form={form}
      title={props.model === 'add' ? '新增流程' : '编辑流程'}
      open={props.open}
      onOpenChange={(open) => {
        form.resetFields();
        if (!open) {
          props.close();
        }
      }}
      onFinish={handleSave}
      submitter={{
        submitButtonProps: {
          loading: loading,
        },
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText label="名称" name="name" labelCol={{ span: 10 }} wrapperCol={{ span: 18 }} />
        </Col>

        <Col span={12}>
          <Form.Item
            label="类型"
            name="type"
            rules={[
              {
                required: true,
                message: '类型不能为空',
              },
            ]}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 18 }}
          >
            <WorkflowDefinitionTypeSelect
              onChange={(value) => {
                form.setFieldsValue({ type: value });
                if (value === WorkflowDefinitionType.commonForm) {
                  setShowFormConfig(true);
                } else {
                  setShowFormConfig(false);
                }
              }}
            ></WorkflowDefinitionTypeSelect>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="所属部门"
            name="organizeIds"
            rules={[
              {
                required: true,
                message: '类型不能为空',
              },
            ]}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 18 }}
          >
            <OrganizeTreeSelect treeCheckable></OrganizeTreeSelect>
          </Form.Item>
        </Col>

        <Col span={12}>
          <ProFormText
            label="备注"
            name="remark"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 18 }}
          />
        </Col>
      </Row>
      {showFormConfig && (
        <>
          <Row>
            <Col span={12}>
              <ProFormText
                label="分组名称"
                name={['designable', 'groupName']}
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 18 }}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label="子分组名称"
                name={['designable', 'subGroupName']}
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 18 }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <ProFormText
                label="表单配置"
                name={['designable', 'formSchema']}
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 18 }}
              />
            </Col>
          </Row>
        </>
      )}
    </ModalForm>
  );
};

export default WorkflowDefinitionExtendInfoAddPage;
