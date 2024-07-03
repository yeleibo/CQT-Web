import { OrganizeTypeSelect } from '@/pages/organize-manage/organize/OrganizeSelectDialog';
import OrganizeService from '@/pages/organize-manage/organize/OrganizeService';
import OrganizeTreeSelect from '@/pages/organize-manage/organize/OrganizeTreeSelect';
import { OrganizeItem } from '@/pages/organize-manage/organize/OrganizeTypings';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Col, Form, Row, message } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  close: () => void;
  reload: () => void;
  data?: OrganizeItem;
  model: 'add' | 'edit';
}

const OrganizeAddPage = (props: Props) => {
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
    const formData = await form.validateFields();
    if (formData) {
      if (formData.id === '') {
        delete formData.id;
      }
      const extraFormData = { ...props.data, ...formData };
      setLoading(true);
      console.log(extraFormData);
      try {
        if (props.model === 'add') {
          const res: any = await OrganizeService.add(extraFormData).catch(() => {
            setLoading(false);
          });
          setLoading(false);
          message.success('添加成功');
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
          message.success('修改成功');
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
      title={props.model === 'add' ? '新增部门' : '编辑部门'}
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
              { required: true, message: '上级组织为必填项' },
              {
                validator: (rule, value) => {
                  if (value === props.data?.id) {
                    return Promise.reject(new Error('上级组织不能是当前组织'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
            label="上级组织"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          >
            <OrganizeTreeSelect></OrganizeTreeSelect>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="组织类型"
            name="type"
            rules={[{ required: true, message: '组织类型为必填项' }]}
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          >
            <OrganizeTypeSelect type={props.data?.type}></OrganizeTypeSelect>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormText
            label="名称"
            name="name"
            rules={[{ required: true, message: '部门为必填项' }]}
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <ProFormText
            label="负责人"
            name="masterName"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>
      <Col span={12}>
        <ProFormText
          label="序号"
          name="orderNumber"
          labelCol={{ span: 6 }} // 设置标签占据的栅格数
          wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
        />
      </Col>
    </ModalForm>
  );
};

export default OrganizeAddPage;
