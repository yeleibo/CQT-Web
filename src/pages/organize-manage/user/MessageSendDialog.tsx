import UserService from '@/pages/organize-manage/user/UserService';
import { SendNotificationParam } from '@/pages/organize-manage/user/UserTypings';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { useState } from 'react';

interface Props {
  open: boolean;
  close: () => void;
  id: number;
}

const MessageSendDialog = (props: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (formData: SendNotificationParam) => {
    setLoading(true);
    const notificationParams: SendNotificationParam = {
      userIds: [props.id],
      message: formData.message,
      isSendNotificationByMobileApp: true,
      isSendNotificationBySMS: true,
    };

    try {
      await UserService.sendNotification(notificationParams);
      setLoading(false);
      props.close();
      message.success('发送成功');
    } catch (ex) {
      setLoading(false);
      message.success('发送失败');
      console.error('Notification sending failed', ex);
    }
  };

  return (
    <ModalForm
      form={form}
      title="发送消息"
      open={props.open}
      onFinish={handleSubmit}
      onOpenChange={(open) => {
        if (!open) {
          props.close();
        }
      }}
      submitter={{
        submitButtonProps: { loading },
      }}
    >
      <ProFormTextArea
        rules={[
          {
            required: true,
            message: '内容不能为空',
          },
        ]}
        label="内容"
        name="message"
      />
    </ModalForm>
  );
};

export default MessageSendDialog;
