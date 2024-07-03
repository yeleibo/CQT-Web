import { Col, Form, Row, Select, message } from 'antd';
import { useEffect, useState } from 'react';

import GoodTypeSelect from '@/pages/inventory/good-type/GoodTypeSelect';
import GoodService from '@/pages/inventory/good/GoodService';
import { Good } from '@/pages/inventory/good/type';
import DictionaryTreeSelect from '@/pages/system/dictionary/DictionaryTreeSelect';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';

interface Props {
  open: boolean;
  close: () => void;
  reload: () => void;
  goodData?: Good;
  model: 'add' | 'edit';
}

const GoodUpdatePage = (props: Props) => {
  const { goodData, open, close } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const assetTypes = ['光缆', '钢饺绳', '监控', '电杆', 'PON板', '光交箱', '机房', 'onu'];

  useEffect(() => {
    if (open) {
      // 初始化
      form.setFieldsValue(goodData);
    }
  }, [open]);

  const handleSave = async () => {
    const formData = await form.validateFields();
    if (formData) {
      if (formData.id === '') {
        delete formData.id;
      }
      const extraFormData = { ...props.goodData, ...formData };
      setLoading(true);
      try {
        if (props.model === 'add') {
          const res: any = await GoodService.add(extraFormData).catch(() => {
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
          const res = await GoodService.update(extraFormData);
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
                message: '名称为必填项',
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
            rules={[
              {
                required: true,
                message: '编码为必填项',
              },
            ]}
            label="编码"
            name="code"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <Form.Item
            name="goodTypeId"
            label="所属目录"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          >
            <GoodTypeSelect
            //  defaultValue={props.data?.organizeId}
            ></GoodTypeSelect>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="unitName"
            rules={[{ required: true, message: '单位为必填项' }]}
            label="单位"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          >
            <DictionaryTreeSelect
              isSelectId={false}
              initialValue={props.goodData?.unitName}
              onChange={(value) => {
                form.setFieldsValue({ depositoryBank: value });
              }}
              dictionaryCode="GoodUnitName"
            ></DictionaryTreeSelect>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            name="assetType"
            label="所属固定资产"
            labelCol={{ span: 8 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          >
            <Select
              defaultValue={props.goodData?.assetType}
              style={{ width: '100%' }}
              onChange={(value: string) => {
                form.setFieldsValue({ assetType: value });
              }}
              options={assetTypes.map((type, index) => ({
                value: index.toString(), // 使用索引作为 value
                label: type, // 使用元素值作为 label
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <ProFormText
            rules={[
              {
                required: true,
                message: '税前价格为必填项',
              },
            ]}
            label="税前价格"
            name="unitPriceBeforeTax"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <ProFormText
            rules={[
              {
                required: true,
                message: '税后价格为必填项',
              },
            ]}
            label="税后价格"
            name="unitPriceAfterTax"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label="最低报警数量"
            name="lowestSafeAmount"
            labelCol={{ span: 8 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <ProFormText
            label="最高报警数量"
            name="highestSafeAmount"
            labelCol={{ span: 8 }} // 设置标签占据的栅格数
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
export default GoodUpdatePage;
