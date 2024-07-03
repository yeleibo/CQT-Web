import OrganizeTreeSelect from '@/pages/organize-manage/organize/OrganizeTreeSelect';
import UserService from '@/pages/organize-manage/user/UserService';
import { UserItem } from '@/pages/organize-manage/user/UserTypings';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Col, Form, Row, message } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  close: () => void;
  reload: () => void;
  data?: UserItem;
  model: 'add' | 'edit';
}

const UserAddPage = (props: Props) => {
  const { data, open, close } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // 初始化
      form.setFieldsValue(data);
    }
  }, [open]);

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
        res = await UserService.add(extraFormData);
        message.success('添加成功');
      } else {
        res = await UserService.edit(extraFormData);
        message.success('修改成功');
      }

      form.resetFields();
      props.close();
      props.reload();

      if ((window as any).onTabSaveSuccess) {
        (window as any).onTabSaveSuccess(res);
        setTimeout(() => window.close(), 300);
      }
    } catch (ex) {
      message.error('操作失败'); // 提供错误反馈
    } finally {
      setLoading(false); // 统一处理加载状态
    }
  };

  return (
    <ModalForm
      loading={loading}
      layout="vertical"
      form={form}
      title={props.model === 'add' ? '新增用户' : '编辑用户'}
      open={open}
      onOpenChange={(open) => {
        form.resetFields();
        if (!open) {
          close();
        }
      }}
      onFinish={handleSave}
    >
      <Row>
        <Col span={12}>
          <ProFormText
            rules={[
              {
                required: true,
                message: '账号为必填项',
              },
            ]}
            label="账号"
            name="account"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <ProFormText
            rules={[
              {
                required: true,
                message: '姓名为必填项',
              },
            ]}
            label="姓名"
            name="name"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormText
            label="手机号"
            name="phoneNumber"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <Form.Item
            name="organizeId"
            rules={[{ required: true, message: '部门为必填项' }]}
            label="部门"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          >
            <OrganizeTreeSelect></OrganizeTreeSelect>
          </Form.Item>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default UserAddPage;
