import OpticalFibersService from '@/pages/inventory/optical-fibers/OpticalFibersService';
import SelectRecipient from '@/pages/inventory/optical-fibers/SelectRecipient';
import { InventoryOutOpticalFiberListDto, fibers } from '@/pages/inventory/optical-fibers/type';
import OrganizeTreeSelect from '@/pages/organize-manage/organize/OrganizeTreeSelect';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Col, Form, Row, Select, message } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  close: () => void;
  reload: () => void;
  houseData?: InventoryOutOpticalFiberListDto;
  model: 'add' | 'edit';
}

const OpticalFibersForm = (props: Props) => {
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
          const res: any = await OpticalFibersService.add(extraFormData).catch(() => {
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
          const res = await OpticalFibersService.update(extraFormData);
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
                message: '光缆盘号为必填项',
              },
            ]}
            label="光缆盘号"
            name="code"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <ProFormText
            rules={[
              {
                required: true,
                message: '光缆长度为必填项',
              },
            ]}
            label="光缆长度"
            name="length"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <Form.Item
            name="goodId"
            label="光缆类型"
            labelCol={{ span: 8 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          >
            <Select
              defaultValue={props.houseData?.goodName}
              style={{ width: '100%' }}
              onChange={(value: string) => {
                form.setFieldsValue({ goodId: value });
              }}
              options={Object.entries(fibers).map(([key, value]) => ({
                value: parseInt(key, 10),
                label: value,
              }))}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <ProFormText
            label="物资单号"
            name="inventoryCode"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      {props.model !== 'add' && (
        <Row>
          <Col span={12}>
            <Form.Item
              name="inventoryOutOrganizeId"
              label="出库部门"
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
              name="recipient"
              label="领料人"
              labelCol={{ span: 6 }} // 设置标签占据的栅格数
              wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
            >
              <SelectRecipient
              //  defaultValue={props.data?.organizeId}
              ></SelectRecipient>
            </Form.Item>
          </Col>
        </Row>
      )}

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
export default OpticalFibersForm;
