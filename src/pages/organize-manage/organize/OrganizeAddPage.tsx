import { OrganizeTypeSelect } from '@/pages/organize-manage/organize/OrganizeSelectDialog';
import OrganizeService from '@/pages/organize-manage/organize/OrganizeService';
import OrganizeTreeSelect from '@/pages/organize-manage/organize/OrganizeTreeSelect';
import { OrganizeItem } from '@/pages/organize-manage/organize/OrganizeTypings';
import { useIntl } from '@@/plugin-locale';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Col, Form, Row, message } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  close: () => void;
  reload: () => void;
  data?: OrganizeItem;
  model: string;
}

const OrganizeAddPage = (props: Props) => {
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
    const formData = await form.validateFields();
    if (formData) {
      if (formData.id === '') {
        delete formData.id;
      }
      const extraFormData = { ...props.data, ...formData };
      setLoading(true);
      console.log(extraFormData);
      try {
        if (props.model === intl.formatMessage({ id: 'add' })) {
          const res: any = await OrganizeService.add(extraFormData).catch(() => {
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
          const res = await OrganizeService.edit(props.data!.id, extraFormData);
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
          ? intl.formatMessage({ id: 'newDepartment' })
          : intl.formatMessage({ id: 'modifyDepartment' })
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
          <Form.Item
            name="parentOrganizeId"
            rules={[
              { required: true, message: intl.formatMessage({ id: 'parentDepartmentRequired' }) },
              {
                validator: (rule, value) => {
                  if (value === props.data?.id) {
                    return Promise.reject(new Error(intl.formatMessage({ id: 'departmentError' })));
                  }
                  return Promise.resolve();
                },
              },
            ]}
            label={intl.formatMessage({ id: 'parentDepartment' })}
            labelCol={{ span: 8 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 16 }} // 设置输入控件占据的栅格数
          >
            <OrganizeTreeSelect></OrganizeTreeSelect>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={intl.formatMessage({ id: 'departmentType' })}
            name="type"
            rules={[
              { required: true, message: intl.formatMessage({ id: 'departmentTypeRequired' }) },
            ]}
            labelCol={{ span: 8 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 16 }} // 设置输入控件占据的栅格数
          >
            <OrganizeTypeSelect type={props.data?.type}></OrganizeTypeSelect>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormText
            label={intl.formatMessage({ id: 'departmentName' })}
            name="name"
            rules={[
              { required: true, message: intl.formatMessage({ id: 'departmentNameRequired' }) },
            ]}
            labelCol={{ span: 8 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 16 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <ProFormText
            label={intl.formatMessage({ id: 'masterName' })}
            name="masterName"
            labelCol={{ span: 8 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 16 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>
      <Col span={12}>
        <ProFormText
          label={intl.formatMessage({ id: 'sort' })}
          name="orderNumber"
          labelCol={{ span: 8 }} // 设置标签占据的栅格数
          wrapperCol={{ span: 16 }} // 设置输入控件占据的栅格数
        />
      </Col>
    </ModalForm>
  );
};

export default OrganizeAddPage;
