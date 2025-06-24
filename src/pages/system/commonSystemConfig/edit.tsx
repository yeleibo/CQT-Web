import React, {useEffect, useState} from "react";
import {ModalForm} from "@ant-design/pro-form";
import {Form, message, Upload} from "antd";
import {SystemConfig} from "@/pages/system/commonSystemConfig/type";
import {PlusOutlined} from "@ant-design/icons";
import {UploadFile} from "antd/es/upload/interface";
import SystemConfigService from "@/pages/system/commonSystemConfig/service";
import Token from "@/utils/token";

interface SystemConfigEditProps {
  onClose: () => void;
  data?: SystemConfig;
  open: boolean;
}

const SystemConfigEdit: React.FC<SystemConfigEditProps> = (props) => {
  const [form] = Form.useForm();
  const {data, onClose} = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = (info: { fileList: UploadFile[] }) => {

    setFileList(info.fileList);
  };
  // 提交表单
  const handleFinish = async (values: any) => {
    const imageUrls = fileList
      .filter((file) => file.status === 'done' && file.response) // 过滤出已上传成功的文件
      .map((file) => {
        return {
          uid: file.uid,
          name: file.name,
          url: file.response,
          type: file.type,
        };
      }); // 提取每个文件的 URL

    const updatedData: SystemConfig = {
      ...data!,
      value: JSON.stringify(imageUrls), // 用逗号拼接成字符串
    };

    await SystemConfigService.update(updatedData);
    onClose();
  };

  // 初始化表单数据（编辑时）
  useEffect(() => {
    if (data) {
      // 如果有图片 URL 字符串，解析成文件对象数组
      if (data.value) {
        const urls:UploadFile[] = JSON.parse(data.value);
        setFileList(urls);
      }
    }
  }, [data]);


  return (
    <ModalForm
      form={form}
      title="编辑系统配置"
      open={props.open}
      onFinish={handleFinish}
      modalProps={{
        onCancel: props.onClose,
        destroyOnClose: true,
      }}
    >
      <Form.Item
        name="value"
        label="上传图片"
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e && e.fileList;
        }}

      >
        <Upload
          action="/api/files" // 上传的接口
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          accept="image/*" // 只接受图片格式
          headers={{ Authorization:`Bearer ${Token.get()}`, }}
          beforeUpload={(file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
              message.error('只能上传图片文件!');
            }
            return isImage || Upload.LIST_IGNORE;
          }}
        >
          {fileList.length >= 18 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传</div>
            </div>
          )}
        </Upload>
      </Form.Item>
    </ModalForm>
  );
}

export default SystemConfigEdit;
