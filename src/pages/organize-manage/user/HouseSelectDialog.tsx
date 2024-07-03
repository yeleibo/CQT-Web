import InventoryHouseService from '@/pages/inventory/house/InventoryHouseService';
import { InventoryHouseListDto } from '@/pages/inventory/house/type';
import UserService from '@/pages/organize-manage/user/UserService';
import { ModalForm } from '@ant-design/pro-form';
import { Form, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';

interface OrganizeTreeSelectProps {
  open: boolean;
  close: () => void;
  userId: number;
  houseIds: number[];
}

const HouseSelectDialog: React.FC<OrganizeTreeSelectProps> = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [houseData, setHouseData] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await InventoryHouseService.getAllInventoryHouse();
        setHouseData(
          data.map((house: InventoryHouseListDto) => ({ id: house.id!, name: house.name })),
        );
      } catch (error) {
        console.error('获取仓库数据失败', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (formData: { inventoryHouseIds: number[] }) => {
    setLoading(true);
    try {
      await UserService.UserManagementInventoryHouses(props.userId, formData.inventoryHouseIds);
      setLoading(false);
      props.close();
      message.success('设置成功');
    } catch (ex) {
      setLoading(false);
      message.error('设置失败');
      console.error('错误', ex);
    }
  };

  const filterOption = (input: string, option?: { label: string; value: number }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <ModalForm
      form={form}
      title="选择管理仓库"
      open={props.open}
      onFinish={async () => {
        try {
          const values = await form.validateFields();
          await handleSubmit(values);
        } catch (errorInfo) {
          console.error('Validation Failed:', errorInfo);
        }
      }}
      modalProps={{
        style: {
          height: '400px', // Set the desired height here
          overflowY: 'auto', // Enable scrolling if content overflows
        },
      }}
      onOpenChange={(open) => {
        if (!open) {
          props.close();
        }
      }}
    >
      <Form.Item name="inventoryHouseIds" rules={[{ required: true, message: '请选择管理仓库' }]}>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择"
          allowClear
          defaultValue={props.houseIds}
          options={houseData.map((house) => ({ value: house.id, label: house.name }))}
          filterOption={filterOption}
          onChange={(value) => {
            form.setFieldsValue({ inventoryHouseIds: value });
          }}
        />
      </Form.Item>
    </ModalForm>
  );
};

export default HouseSelectDialog;
