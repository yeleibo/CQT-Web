import React, {useEffect} from "react";
import {SystemConfig} from "@/pages/system/commonSystemConfig/type";
import {Form, message} from "antd";
import {ModalForm} from "@ant-design/pro-form";
import {ProFormText} from "@ant-design/pro-components";
import SystemService from '@/pages/system/service';

interface CommonEditProps {
  onClose: () => void;
  data?: SystemConfig;
  open: boolean;
}

const CommonEdit: React.FC<CommonEditProps> = (props) => {
  const { onClose, data, open} = props;
  const [form] = Form.useForm();

  // 初始化表单数据（编辑时）
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  const handleFinish = async (values: SystemConfig) => {
    const formData = await form.validateFields();
    try {
      if(formData.id ){
        await SystemService.updateConfig(formData);
        message.success('配置成功');
        if(props.onClose){
          props.onClose();
        }
      }
    }catch (e) {
      message.error('配置失败');
    }
  };

  return (
    <ModalForm
      form={form}
      title="编辑系统配置"
      open={open}
      onFinish={handleFinish}
      modalProps={{
        onCancel: onClose,
        destroyOnClose: true,
      }}
    >
      <ProFormText
        colProps={{ md: 12, xl: 12 }}
        label="参数名称"
        name="name"
        disabled={true}
        placeholder="请输入系统内置"
        rules={[{ required: true, message: '请输入系统内置' }]}
      />
      <ProFormText
        colProps={{ md: 12, xl: 12 }}
        label="参数值"
        name="value"
        placeholder="请输入参数值"
        rules={[{ required: true, message: '请输入参数值' }]}
      />
      <ProFormText
        colProps={{ md: 12, xl: 12 }}
        label="备注"
        name="remark"
      />
      <ProFormText
        colProps={{ md: 12, xl: 12 }}
        label="参数名称"
        name="id"
        hidden={true}
        placeholder="请输入参数名称"
        rules={[{ required: true, message: '请输入参数名称' }]}
      />
      <ProFormText
        colProps={{ md: 12, xl: 12 }}
        label="参数键名"
        name="configKey"
        hidden={true}
        placeholder="请输入参数键名"
        rules={[{ required: true, message: '请输入参数键名' }]}
      />

    </ModalForm>
  );
};

export default CommonEdit
