import OrganizeService from '@/pages/organize-manage/organize/OrganizeService';
import {
  OrganizeItem,
  buildTreeDataWithUsers,
} from '@/pages/organize-manage/organize/OrganizeTypings';
import RoleService from '@/pages/organize-manage/role/RoleService';
import { RoleList } from '@/pages/organize-manage/role/RoleTypings';
import UserService from '@/pages/organize-manage/user/UserService';
import { UserItem } from '@/pages/organize-manage/user/UserTypings'; // 假设你有一个 types 文件定义了这些类型
import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Input, List, Modal, Spin, Tree, message } from 'antd';
import Row from 'antd/lib/row';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface RoleUserSelectDialogProps {
  open: boolean;
  close: () => void;
  reload: () => void;
  role: RoleList;
}

const useOrganizeData = () => {
  const [allOrganize, setAllOrganize] = useState<OrganizeItem[]>([]);
  const [allUsers, setAllUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 初始化加载状态为 true

  const fetchData = useCallback(async () => {
    try {
      const [organizeData, userData] = await Promise.all([
        OrganizeService.all(),
        UserService.all(),
      ]);
      setAllOrganize(organizeData);
      setAllUsers(userData);
    } catch (error) {
      console.error('获取数据错误', error);
    } finally {
      setLoading(false); // 数据获取完成后设置加载状态为 false
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { allOrganize, allUsers, loading };
};
/**
 * 树结构数据搜索筛选
 * @param treeData
 * @param searchValue
 */
const filterTreeData = (treeData: any[], searchValue: string) => {
  if (!searchValue) return treeData;

  const filterNode = (node: any) => {
    if (node.children) {
      const filteredChildren = node.children.map(filterNode).filter((child: any) => child);
      if (filteredChildren.length) {
        return { ...node, children: filteredChildren };
      }
    }
    if (node.title.toLowerCase().includes(searchValue.toLowerCase())) {
      return node;
    }
    return null;
  };

  return treeData.map(filterNode).filter((node: any) => node);
};

export { filterTreeData };

const RoleUserSelect: React.FC<RoleUserSelectDialogProps> = (props) => {
  const { allOrganize, allUsers, loading } = useOrganizeData();
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(
    props.role.users.map((user) => user.id),
  );
  const [searchValue, setSearchValue] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false); // Separate loading state for submit

  const filteredTreeData = useMemo(
    () => filterTreeData(buildTreeDataWithUsers(allOrganize, allUsers), searchValue),
    [allOrganize, allUsers, searchValue],
  );

  const handleCheck = (checkedKeys: any, info: { checkedNodes: any[] }) => {
    if (info.checkedNodes) {
      const users = info.checkedNodes
        .filter((node) => node.isOrganize === false)
        .map((e) => e.value);
      setSelectedUserIds(users);
    }
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
  };

  const handleClearAll = () => {
    setSelectedUserIds([]);
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    try {
      await RoleService.editUsers(props.role.id!, selectedUserIds);
      props.close();
      if (props.reload) {
        props.reload();
      }
      message.success('设置成功');
    } catch (ex) {
      message.error('设置失败');
      console.error('错误信息', ex);
    } finally {
      setLoadingSubmit(false); // 提交完成后设置加载状态为 false
    }
  };

  const selectedUsers = useMemo(
    () => allUsers.filter((user) => selectedUserIds.includes(user.id!)),
    [selectedUserIds, allUsers],
  );

  return (
    <Modal
      open={props.open}
      title="选择用户"
      onCancel={props.close}
      onOk={handleSubmit}
      confirmLoading={loadingSubmit} // 显示提交按钮的加载状态
      width={800}
    >
      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col span={11}>
            <Input.Search
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="搜索用户"
              style={{ marginBottom: 8 }}
            />
            <Tree
              treeData={filteredTreeData}
              checkable
              selectable
              checkedKeys={selectedUserIds}
              onCheck={handleCheck}
            />
          </Col>
          <Col span={1} />
          <Col span={12}>
            <List
              header={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>已选用户</span>
                  <Button type="link" onClick={handleClearAll}>
                    清空
                  </Button>
                </div>
              }
              bordered
              dataSource={selectedUsers}
              renderItem={(user: UserItem) => (
                <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div>{user.name}</div>
                    <div>所属部门: {user.organizeName}</div>
                  </div>
                  <Button
                    type="link"
                    icon={<CloseOutlined />}
                    onClick={() => handleRemoveUser(user.id!)}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};

export default RoleUserSelect;
