import InventoryHouseService from '@/pages/inventory/house/InventoryHouseService';
import { InventoryHouseListDto } from '@/pages/inventory/house/type';
import OrganizeTreeSelect from '@/pages/organize-manage/organize/OrganizeTreeSelect';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Checkbox, Col, Form, Row, message } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  close: () => void;
  reload: () => void;
  houseData?: InventoryHouseListDto;
  model: 'add' | 'edit';
}

const InventoryHouseAddPage = (props: Props) => {
  const { houseData, open, close } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // 初始化
      form.setFieldsValue(houseData);
    }
  }, [open]);

  const handleSave = async () => {
    const formData = await form.validateFields();
    if (formData) {
      if (formData.id === '') {
        delete formData.id;
      }
      const extraFormData = { ...props.houseData, ...formData };
      setLoading(true);
      try {
        if (props.model === 'add') {
          const res: any = await InventoryHouseService.add(extraFormData).catch(() => {
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
          const res = await InventoryHouseService.update(extraFormData);
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
                message: '仓库名称为必填项',
              },
            ]}
            label="仓库名称"
            name="name"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <ProFormText
            label="仓库地址"
            name="address"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormText
            name="orderNumber"
            label="排序"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <Form.Item
            name="organizeId"
            rules={[{ required: true, message: '部门为必填项' }]}
            label="所属部门"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          >
            <OrganizeTreeSelect
            //  defaultValue={props.data?.organizeId}
            ></OrganizeTreeSelect>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <Form.Item
            name="auxiliaryOrganizeIds"
            label="附属部门"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          >
            <OrganizeTreeSelect
              multiple={true}
              //  defaultValue={props.data?.organizeId}
            ></OrganizeTreeSelect>
          </Form.Item>
        </Col>

        <Col span={12}>
          <ProFormText
            name="receiver"
            label="收货人"
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
        <Col span={12}>
          <Form.Item
            name="isMain"
            valuePropName="checked"
            label="是否主库"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Checkbox>Checkbox</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </ModalForm>
  );
};
export default InventoryHouseAddPage;
