import { Col, Form, Row, message } from 'antd';
import { useEffect, useState } from 'react';

import service from '@/pages/Engineering/EngineeringService';
import { EngineeringItem } from '@/pages/Engineering/typings';
import OrganizeTreeSelect from '@/pages/organize-manage/organize/OrganizeTreeSelect';
import DictionaryTreeSelect from '@/pages/system/dictionary/DictionaryTreeSelect';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';

interface Props {
  open: boolean;
  close: () => void;
  reload: () => void;
  data?: EngineeringItem;
  model: 'add' | 'edit';
}

const Save = (props: Props) => {
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
          const res: any = await service.add(extraFormData).catch(() => {
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
          const res = await service.update(extraFormData);
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
      title={props.model === 'add' ? '新增' : '编辑'}
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
                message: '规则名称为必填项',
              },
            ]}
            label="名称"
            name="name"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <ProFormText
            label="编号"
            name="code"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <Form.Item
            name="organizeId"
            rules={[{ required: true, message: '部门为必填项' }]}
            label="分公司"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          >
            <OrganizeTreeSelect
            //  defaultValue={props.data?.organizeId}
            ></OrganizeTreeSelect>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="typeCode"
            rules={[{ required: true, message: '工程类型为必填项' }]}
            label="工程类型"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          >
            <DictionaryTreeSelect
              initialValue={props.data?.typeCode}
              isSelectId={true}
              onChange={(value) => {
                form.setFieldsValue({ typeCode: value });
              }}
              dictionaryCode="工程类型"
            ></DictionaryTreeSelect>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormSelect
            options={[
              { label: '设计', value: 1 },
              { label: '审核', value: 2 },
              { label: '施工', value: 3 },
              { label: '竣工', value: 4 },
              { label: '验收', value: 6 },
              { label: '审计', value: 7 },
              { label: '完成', value: 8 },
            ]}
            initialValue={3}
            label="状态"
            name="status"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <ProFormTextArea
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
export default Save;
