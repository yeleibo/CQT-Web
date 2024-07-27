import ISPService from '@/pages/isp/ISPService';
import { ISP } from '@/pages/isp/type';
import { useIntl } from '@@/plugin-locale';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Col, Form, Row, message } from 'antd';
import { useEffect, useState } from 'react';

interface ISPProp {
  open: boolean;
  close: () => void;
  reload: () => void;
  ispData?: ISP;
  model: string;
}

const ISPDetailPage = (props: ISPProp) => {
  const { ispData, open, close } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    if (open) {
      // 初始化
      form.setFieldsValue(ispData);
    }
  }, [open]);

  const handleSave = async () => {
    const formData = await form.validateFields();
    if (formData) {
      if (formData.id === '') {
        delete formData.id;
      }
      const extraFormData = { ...props.ispData, ...formData };
      setLoading(true);
      try {
        if (props.model === intl.formatMessage({ id: 'add' })) {
          const res: any = await ISPService.add(extraFormData).catch(() => {
            setLoading(false);
          });
          setLoading(false);

          message.success(intl.formatMessage({ id: 'addSuccessful' }));
          if (props.reload) {
            props.reload();
          }
          props.close();
          form.resetFields();
          if ((window as any).onTabSaveSuccess) {
            (window as any).onTabSaveSuccess(res);
            setTimeout(() => window.close(), 300);
          }
        } else {
          const res = await ISPService.update(extraFormData);
          setLoading(false);
          form.resetFields();
          message.success(intl.formatMessage({ id: 'modifySuccessful' }));
          if (props.reload) {
            props.reload();
          }
          props.close();
          if ((window as any).onTabSaveSuccess) {
            (window as any).onTabSaveSuccess(res);
            setTimeout(() => window.close(), 300);
          }
        }
      } catch (ex) {
        setLoading(false);
      }
    }
  };

  return (
    <ModalForm
      loading={loading}
      layout="vertical"
      form={form}
      title={
        props.model === intl.formatMessage({ id: 'add' })
          ? intl.formatMessage({ id: 'add' })
          : intl.formatMessage({ id: 'edit' })
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
                message: intl.formatMessage({ id: 'customerNameRequired' }),
              },
            ]}
            label={intl.formatMessage({ id: 'customerName' })}
            name="name"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <ProFormText
            label={intl.formatMessage({ id: 'address' })}
            name="address"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormText
            name="contactPersonName"
            label={intl.formatMessage({ id: 'contactPersonName' })}
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <ProFormText
            name="contactPersonPhoneNumber"
            label={intl.formatMessage({ id: 'contactPersonPhoneNumber' })}
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormText
            name="email"
            label={intl.formatMessage({ id: 'email' })}
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <ProFormText
            name="server"
            label={intl.formatMessage({ id: 'server' })}
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormText
            name="group"
            label={intl.formatMessage({ id: 'group' })}
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
        <Col span={12}>
          <ProFormTextArea
            label={intl.formatMessage({ id: 'remark' })}
            name="remark"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ISPDetailPage;
