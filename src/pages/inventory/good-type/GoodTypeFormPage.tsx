import React, { useEffect, useState } from 'react';
import { Col, Form,  message,  Row} from 'antd';

import {ModalForm,  ProFormText, ProFormTextArea} from "@ant-design/pro-components";
import {GoodType} from "@/pages/inventory/good-type/type";
import GoodTypeService from "@/pages/inventory/good-type/GoodTypeService";
import GoodTypeSelect from "@/pages/inventory/good-type/GoodTypeSelect";

interface Props {
  open: boolean;
  close: () => void;
  reload: () => void;
  goodTypeData?: GoodType;
  model: 'add' | 'edit';
}


const GoodTypeFormPage = (props: Props) => {
  const {goodTypeData,open,close } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);




  useEffect(() => {

    if (open) {
      // 初始化
      form.setFieldsValue(goodTypeData);
    }
  }, [open]);


  const handleSave = async () => {
    const formData = await form.validateFields();
    if (formData) {
      if (formData.id === '') {
        delete formData.id;
      }
      const extraFormData = {...props.goodTypeData,...formData};
      setLoading(true);
      try{
        if (props.model === 'add') {
          const res: any = await GoodTypeService.addGoodType(extraFormData).catch(()=>{
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
          const res = await GoodTypeService.updateGoodType(extraFormData);
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
      }catch (ex){
        setLoading(false);
      }

    }
  };


  return (

    <ModalForm

      loading={loading}
      layout="vertical"
      form={form}
      title={props.model==="add" ? "新增" : '编辑'}
      open={open}

      onOpenChange={(open) => {
        form.resetFields();
        if(!open){
          close();
        }
      }}
      onFinish={handleSave}>
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
            labelCol={{ span: 6 }}  // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }}  // 设置输入控件占据的栅格数
          />
        </Col>

        <Col span={12}>
          <Form.Item  name='parentId'
                      label="上级目录"    labelCol={{ span: 6 }}  // 设置标签占据的栅格数
                      wrapperCol={{ span: 18 }}  // 设置输入控件占据的栅格数
          >
            <GoodTypeSelect
              //  defaultValue={props.data?.organizeId}
            ></GoodTypeSelect>

          </Form.Item>


        </Col>
      </Row>


      <Row>
        <Col span={12}>
          <ProFormText  name='orderNumber'
                        label="排序"    labelCol={{ span: 6 }}  // 设置标签占据的栅格数
                        wrapperCol={{ span: 18 }}  // 设置输入控件占据的栅格数
          />

        </Col>

        <Col span={12}>
          <ProFormTextArea
            label="备注"
            name="remark"
            labelCol={{ span: 6 }}  // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }}  // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

    </ModalForm>
  );
};
export default GoodTypeFormPage;
