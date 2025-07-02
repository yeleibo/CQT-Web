import DictionaryService from '@/pages/system/dictionary/DictionaryService';
import DictionaryTreeSelect from '@/pages/system/dictionary/DictionaryTreeSelect';
import { DictionaryItem } from '@/pages/system/dictionary/typings';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Col, Form, Row, Switch, message } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  close: () => void;
  reload: () => void;
  data?: DictionaryItem;
  model: 'add' | 'edit';
  dictionaryId?: number;
  dictionaryCode: string;
}

const DictionaryAddPage = (props: Props) => {
  const { data, open, close, model, dictionaryId, dictionaryCode } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // 初始化表单
      if (model === 'add') {
        const initialValues = { dictionaryId, enable: true };
        form.setFieldsValue(initialValues);
      } else {
        const initialValues = { ...data, enable: data?.enable ?? true };
        form.setFieldsValue(initialValues);
      }
    }
  }, [open, data, form, model, dictionaryId]);

  const handleSave = async () => {
    try {
      const formData = await form.validateFields();
      if (formData.id === '') {
        delete formData.id;
      }

      let extraFormData: DictionaryItem;
      if (model === 'add') {
        extraFormData = { ...formData, dictionaryId: dictionaryId }; // 使用传递的 dictionaryId
      } else {
        extraFormData = { ...data, ...formData,dictionaryCode: dictionaryCode };
      }

      setLoading(true);
      let res;
      if (model === 'add') {
        res = await DictionaryService.add(extraFormData);
        message.success('添加成功');
      } else {
        res = await DictionaryService.edit(extraFormData);
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
      title={model === 'add' ? '新增字典项' : '编辑字典项'}
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.resetFields();
          close();
        }
      }}
      onFinish={handleSave}
      submitter={{
        submitButtonProps: {
          loading: loading,
        },
      }}
      // initialValues={
      //   model === 'add' ? { dictionaryId, enable: true } : { ...data, enable: data?.enable ?? true }
      // } // 使用initialValues来初始化表单值
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="parentId"
            label="父节点"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          >
            <DictionaryTreeSelect
              isSelectId={true}
              onChange={(value) => {
                form.setFieldsValue({ parentId: value });
              }}
              dictionaryCode={dictionaryCode}
            ></DictionaryTreeSelect>
          </Form.Item>
        </Col>

        <Col span={12}>
          <ProFormText
            label="字典项名称"
            name="name"
            rules={[
              {
                required: true,
                message: '字典项名称不能为空',
              },
            ]}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 18 }}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <ProFormText
            label="字典项编码"
            name="code"
            rules={[
              {
                required: true,
                message: '字典项编码不能为空',
              },
            ]}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 18 }}
          />
        </Col>

        <Col span={12}>
          <ProFormText
            label="排序"
            name="orderNumber"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 18 }}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="是否启用" name="enable" valuePropName="checked">
            <Switch />
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
    </ModalForm>
  );
};

export default DictionaryAddPage;
