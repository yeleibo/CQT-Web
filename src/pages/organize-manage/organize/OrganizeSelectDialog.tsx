import OrganizeService from '@/pages/organize-manage/organize/OrganizeService';
import {
  OrganizeItem,
  OrganizeTreeData,
  OrganizeType,
  getOrganizeTypeLabel,
} from '@/pages/organize-manage/organize/OrganizeTypings';
import { filterTreeData } from '@/pages/organize-manage/role/RoleUserSelect';
import UserService from '@/pages/organize-manage/user/UserService';
import { CloseOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-form';
import {
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  Select,
  Spin,
  Tree,
  TreeSelect,
  message,
  type TreeSelectProps,
} from 'antd';
import type { BaseOptionType } from 'antd/es/select';
import Row from 'antd/lib/row';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface OrganizeTreeSelectProps extends TreeSelectProps {
  open: boolean;
  close: () => void;
  userId: number;
  organizeIds: number[];
  reload: () => void;
}

interface TreeNodeType {
  label: string;
  value: number;
}

/**部门选择弹窗一*/
const OrganizeSelectDialog: React.FC<OrganizeTreeSelectProps> = (props) => {
  const [form] = Form.useForm();
  const [organizeTreeData, setOrganizeTreeData] = useState<BaseOptionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    OrganizeService.all().then((organizeTreeData) => {
      const treeData = OrganizeTreeData(organizeTreeData);
      setOrganizeTreeData(treeData);
    });
  }, []);

  const handleSubmit = async (formData: { organizeIds: number[] }) => {
    setLoading(true);
    try {
      await UserService.userManagementOrganizes(props.userId, formData.organizeIds);
      setLoading(false);
      props.close();
      message.success('设置成功');
      if (props.reload) {
        props.reload();
      }
    } catch (ex) {
      setLoading(false);
      message.error('设置失败');
      console.error('Notification sending failed', ex);
    }
  };
  const defaultTreeNodeValues = props.organizeIds.map((id) => ({ label: '', value: id }));

  return (
    <ModalForm
      form={form}
      title="选择管理部门"
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
          overflowY: 'auto',
        },
      }}
      onOpenChange={(open) => {
        if (!open) {
          props.close();
        }
      }}
    >
      <Form.Item name="organizeIds" rules={[{ required: true, message: '请选择管理部门' }]}>
        <TreeSelect
          showSearch
          treeCheckable
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="请选择"
          allowClear
          treeDefaultExpandAll
          treeData={organizeTreeData}
          defaultValue={defaultTreeNodeValues}
          treeCheckStrictly={true}
          onChange={(value: TreeNodeType[]) => {
            const organizeIds = value.map((item) => item.value);
            form.setFieldsValue({ organizeIds });
          }}
        />
      </Form.Item>
    </ModalForm>
  );
};

export default OrganizeSelectDialog;

/**
 * 获取部门数据
 */
const useOrganizeData = () => {
  const [allOrganize, setAllOrganize] = useState<OrganizeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 初始化加载状态为 true
  const fetchData = useCallback(async () => {
    try {
      const [organizeData] = await Promise.all([OrganizeService.all()]);
      setAllOrganize(organizeData);
    } catch (error) {
      console.error('获取数据错误', error);
    } finally {
      setLoading(false); // 数据获取完成后设置加载状态为 false
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { allOrganize, loading };
};

/**
 * 部门选择弹窗二
 */
const OrganizeSelectDialog2: React.FC<OrganizeTreeSelectProps> = (props) => {
  const { allOrganize, loading } = useOrganizeData();
  const [selectedOrganize, setSelectedOrganize] = useState<number[]>(props.organizeIds);
  const [searchValue, setSearchValue] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false); // Separate loading state for submit

  const filteredTreeData = useMemo(
    () => filterTreeData(OrganizeTreeData(allOrganize), searchValue),
    [allOrganize, searchValue],
  );

  const handleCheck = (checkedKeys: any, info: { checkedNodes: any[] }) => {
    const Organizes = info.checkedNodes.map((node) => node.value);
    setSelectedOrganize(Organizes);
  };

  const selectedOrganizes = useMemo(
    () => allOrganize.filter((e) => selectedOrganize.includes(e.id!)),
    [selectedOrganize, allOrganize],
  );

  const handleRemoveOrganize = (userId: number) => {
    setSelectedOrganize(selectedOrganize.filter((id) => id !== userId));
  };

  const handleClearAll = () => {
    setSelectedOrganize([]);
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    try {
      await UserService.userManagementOrganizes(props.userId, selectedOrganize);
      setLoadingSubmit(false);
      if (props.reload) {
        props.reload();
      }
      props.close();
      message.success('设置成功');
    } catch (ex) {
      setLoadingSubmit(false);
      message.error('设置失败');
      console.error('Notification sending failed', ex);
    }
  };
  return (
    <Modal
      open={props.open}
      title="设置管理部门"
      onCancel={props.close}
      onOk={handleSubmit}
      confirmLoading={loadingSubmit} // 显示提交按钮的加载状态
      width={800}
    >
      {loading ? (
        <Spin tip="正在加载中..." />
      ) : (
        <Row gutter={16}>
          <Col span={11}>
            <Input.Search
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="搜索部门"
              style={{ marginBottom: 8 }}
            />
            <Tree
              treeData={filteredTreeData}
              checkable
              selectable
              checkedKeys={selectedOrganize}
              onCheck={handleCheck}
            />
          </Col>
          <Col span={1} />
          <Col span={12}>
            <List
              header={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>已选部门</span>
                  <Button type="link" onClick={handleClearAll}>
                    清空
                  </Button>
                </div>
              }
              bordered
              dataSource={selectedOrganizes}
              renderItem={(organize: OrganizeItem) => (
                <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div>{organize.name}</div>
                    <div>类型: {getOrganizeTypeLabel(organize.type)}</div>
                  </div>
                  <Button
                    type="link"
                    icon={<CloseOutlined />}
                    onClick={() => handleRemoveOrganize(organize.id!)}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      )}
    </Modal>
  );
};

export { OrganizeSelectDialog2 };

/**
 * 部门类型选择
 */
interface OrganizeTypeSelectProps {
  onChange?: (value: string) => void;
  type?: OrganizeType;
}

const OrganizeTypeSelect: React.FC<OrganizeTypeSelectProps> = ({ type, onChange }) => {
  const organizeTypeOptions = [
    OrganizeType.总公司,
    OrganizeType.分公司,
    OrganizeType.部门,
    OrganizeType.施工单位,
  ];
  const handleSelectChange = (selectedValues: string) => {
    if (onChange) {
      onChange(selectedValues);
    }
  };
  return (
    <Select
      style={{ width: '100%' }}
      onChange={handleSelectChange}
      defaultValue={getOrganizeTypeLabel(type)}
      options={organizeTypeOptions.map((type) => ({
        value: type,
        label: getOrganizeTypeLabel(type),
      }))}
    />
  );
};

export { OrganizeTypeSelect };
