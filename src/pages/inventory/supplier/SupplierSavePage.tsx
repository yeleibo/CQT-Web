import { Col, Form, Row, message } from 'antd';
import { useEffect, useState } from 'react';

import SupplierService from '@/pages/inventory/supplier/SupplierService';
import { SupplierItem } from '@/pages/inventory/supplier/typings';
import DictionaryTreeSelect from '@/pages/system/dictionary/DictionaryTreeSelect';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';

interface Props {
  open: boolean;
  close: () => void;
  reload: () => void;
  supplierData?: SupplierItem;
  model: 'add' | 'edit';
}

const SupplierSave = (props: Props) => {
  const { supplierData, open, close } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // 初始化
      form.setFieldsValue(supplierData);
    }
  }, [open]);

  const handleSave = async () => {
    const formData = await form.validateFields();
    if (formData) {
      if (formData.id === '') {
        delete formData.id;
      }
      const extraFormData = { ...props.supplierData, ...formData };
      setLoading(true);
      try {
        if (props.model === 'add') {
          const res: any = await SupplierService.add(extraFormData).catch(() => {
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
          const res = await SupplierService.update(extraFormData);
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
                message: '供应商名称为必填项',
              },
            ]}
            label="供应商名称"
            name="name"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <ProFormText
            rules={[
              {
                required: true,
                message: '供应商编号为必填项',
              },
            ]}
            label="供应商编号"
            name="code"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormText
            name="address"
            rules={[{ required: true, message: '地址为必填项' }]}
            label="地址"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <ProFormText
            name="contactPersonName"
            rules={[{ required: true, message: '联系人为必填项' }]}
            label="联系人"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormText
            name="contactPhoneNumber"
            label="联系电话"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <ProFormText
            name="bankAccountNumber"
            label="银行账号"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <Form.Item
            name="groupCode"
            rules={[{ required: true, message: '所属分组为必填项' }]}
            label="所属分组"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          >
            <DictionaryTreeSelect
              isSelectId={false}
              initialValue={props.supplierData?.groupCode}
              onChange={(value) => {
                form.setFieldsValue({ groupCode: value });
              }}
              dictionaryCode="供应商所属分组"
            ></DictionaryTreeSelect>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="depositoryBank"
            rules={[{ required: true, message: '所属分组为必填项' }]}
            label="开户银行"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          >
            <DictionaryTreeSelect
              isSelectId={false}
              initialValue={props.supplierData?.depositoryBank}
              onChange={(value) => {
                form.setFieldsValue({ depositoryBank: value });
              }}
              dictionaryCode="银行"
            ></DictionaryTreeSelect>
          </Form.Item>
        </Col>
      </Row>
      <Row>
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
export default SupplierSave;
