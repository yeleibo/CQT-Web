import RoleService from '@/pages/organize-manage/role/RoleService';
import { RoleList } from '@/pages/organize-manage/role/RoleTypings';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Col, Form, Row, message } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  close: () => void;
  reload: () => void;
  data?: RoleList;
  model: 'add' | 'edit';
}

const RoleAddPage = (props: Props) => {
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
      try {
        if (props.model === 'add') {
          const res: any = await RoleService.add(extraFormData).catch(() => {
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
          const res = await RoleService.edit(extraFormData);
          setLoading(false);
          form.resetFields();
          message.success('修改成功');
          props.close();
          if (props.reload) {
            props.reload();
          }

          // if ((window as any).onTabSaveSuccess) {
          //   (window as any).onTabSaveSuccess(res);
          //   setTimeout(() => window.close(), 300);
          // }
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
      title={props.model === 'add' ? '新增角色' : '编辑角色'}
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
                message: '角色名称',
              },
            ]}
            label="角色名称"
            name="name"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <ProFormText
            label="排序"
            name="orderNumber"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormText
            label="备注"
            name="remark"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default RoleAddPage;
