import DesignableService from '@/pages/Designable/DesignableService';
import { UploadOutlined } from '@ant-design/icons';
import { ProFormText } from '@ant-design/pro-components';
import { FormItem, Input, Select, Upload } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';
import { Button, InputNumber, Modal, message } from 'antd';
import { FC, useCallback } from 'react';

interface Props {
  open: boolean;
  close: () => void;
  reload: () => void;
  model: 'add' | 'edit';
  data?: Record<string, any>;
}

const NormalUpload: FC<{ value: any }> = ({ value }) => (
  <Upload
    {...value}
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    headers={{ authorization: 'authorization-text' }}
  >
    <Button icon={<UploadOutlined />}>上传文件</Button>
  </Upload>
);

const AddPage: FC<Props> = ({ open, close, model, data = {} }) => {
  const form = createForm({ initialValues: data });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Select,
      ProFormText,
      Input,
      InputNumber,
      Upload,
      NormalUpload,
    },
  });

  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: '名称',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-validator': [{ required: true, message: '名称不能为空' }],
      },
      unit: {
        title: '单位',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-validator': [{ required: true, message: '单位不能为空' }],
        enum: [
          { label: '米', value: '米' },
          { label: '个', value: '个' },
        ],
      },
      price: {
        type: 'number',
        title: '单价',
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-validator': [{ required: true, message: '单价不能为空', exclusiveMinimum: 0 }],
      },
      mount: {
        type: 'number',
        title: '数量',
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-validator': [{ required: true, message: '数量不能为空', exclusiveMinimum: 0 }],
      },
      total: {
        type: 'number',
        title: '合计金额',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        default: 0,
        'x-reactions': {
          dependencies: ['price', 'mount'],
          fulfill: {
            state: {
              value: '{{ $deps[0] * $deps[1] }}',
            },
          },
        },
      },
      files: {
        type: 'array',
        title: '文件上传',
        'x-decorator': 'FormItem',
        'x-component': 'NormalUpload',
      },
    },
  };

  const handleSubmit = useCallback(async () => {
    try {
      await form.validate();
      const values = form.values;
      if (model === 'add') {
        await DesignableService.add(values);
        message.success('添加成功');
      } else if (model === 'edit') {
        await DesignableService.edit(values);
        message.success('编辑成功');
      }
      close();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  }, [form, model, close]);

  return (
    <Modal
      title={model === 'add' ? '新建' : '编辑'}
      open={open}
      onOk={handleSubmit}
      onCancel={close}
      okText="提交"
      cancelText="取消"
    >
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
    </Modal>
  );
};

export default AddPage;
