import OrganizeTreeSelect from '@/pages/organize-manage/organize/OrganizeTreeSelect';
import UserService from '@/pages/organize-manage/user/UserService';
import { UserItem } from '@/pages/organize-manage/user/UserTypings';
import { useIntl } from '@@/plugin-locale';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Col, Form, Row, message } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  close: () => void;
  reload: () => void;
  data?: UserItem;
  model: string;
}

const UserAddPage = (props: Props) => {
  const { data, open, close } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

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
      if (props.model === intl.formatMessage({ id: 'add' })) {
        res = await UserService.add(extraFormData);
        message.success(intl.formatMessage({ id: 'addSuccessful' }));
      } else {
        res = await UserService.edit(extraFormData);
        message.success(intl.formatMessage({ id: 'modifySuccessful' }));
      }

      form.resetFields();
      props.close();
      props.reload();

      if ((window as any).onTabSaveSuccess) {
        (window as any).onTabSaveSuccess(res);
        setTimeout(() => window.close(), 300);
      }
    } catch (ex) {
      message.error(intl.formatMessage({ id: 'failedOpera' })); // 提供错误反馈
    } finally {
      setLoading(false); // 统一处理加载状态
    }
  };

  return (
    <ModalForm
      loading={loading}
      layout="vertical"
      form={form}
      title={
        props.model === intl.formatMessage({ id: 'add' })
          ? intl.formatMessage({ id: 'newUser' })
          : intl.formatMessage({ id: 'modifyUser' })
      }
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
                message: intl.formatMessage({ id: 'accountRequired' }),
              },
            ]}
            label={intl.formatMessage({ id: 'account' })}
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
                message: intl.formatMessage({ id: 'nameRequired' }),
              },
            ]}
            label={intl.formatMessage({ id: 'name' })}
            name="name"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormText
            label={intl.formatMessage({ id: 'phoneNumber' })}
            name="phoneNumber"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <Form.Item
            name="organizeId"
            rules={[{ required: true, message: intl.formatMessage({ id: 'departmentRequired' }) }]}
            label={intl.formatMessage({ id: 'department' })}
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
