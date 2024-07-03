import RoleService from '@/pages/organize-manage/role/RoleService';
import {
  Permission,
  PermissionFilterTreeData,
  PermissionTreeData,
  PermissionType,
  RoleList,
} from '@/pages/organize-manage/role/RoleTypings';
import { Checkbox, Col, Modal, Row, Spin, Tree, message } from 'antd';
import type { BaseOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';

interface PermissionSelectProps {
  open: boolean;
  close: () => void;
  role: RoleList;
  reload: () => void;
}

const PermissionSelectDialog: React.FC<PermissionSelectProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [allPermissions, setAllPermissions] = useState<Permission[]>();

  const initModule = props.role.permissions
    .filter((e) => e.type === PermissionType.module)
    .map((e) => e.id);
  const initMenu = props.role.permissions
    .filter((e) => e.type === PermissionType.menu)
    .map((e) => e.id);
  const initButton = props.role.permissions
    .filter((e) => e.type === PermissionType.button)
    .map((e) => e.id);
  const initData = props.role.permissions
    .filter((e) => e.type === PermissionType.data)
    .map((e) => e.id);
  const [selectedModulePermissions, setSelectedModulePermissions] = useState<number[]>(initModule);
  const [selectedMenuPermissions, setSelectedMenuPermissions] = useState<number[]>(initMenu);
  const [selectedButtonPermissions, setSelectedButtonPermissions] = useState<number[]>(initButton);
  const [selectedDataPermissions, setSelectedDataPermissions] = useState<number[]>(initData);
  const [permissions, setPermissions] = useState({
    module: [] as BaseOptionType[],
    menu: [] as BaseOptionType[],
    button: [] as Permission[],
    data: [] as Permission[],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dto = await RoleService.allPermissions();
        setAllPermissions(dto);
        const modulePermissions = dto.filter((e) => e.type === PermissionType.module);
        const menuPermissions = dto.filter((e) => e.type === PermissionType.menu);
        const buttonPermissions = dto.filter((e) => e.type === PermissionType.button);
        const dataPermissions = dto.filter((e) => e.type === PermissionType.data);
        setPermissions({
          module: PermissionTreeData(modulePermissions),
          menu: PermissionFilterTreeData(modulePermissions, menuPermissions),
          button: buttonPermissions,
          data: dataPermissions,
        });
      } catch (error) {
        message.error('获取权限数据失败');
        console.error('获取权限数据失败', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const selectedPermissions = [
        ...selectedModulePermissions,
        ...selectedMenuPermissions,
        ...selectedButtonPermissions,
        ...selectedDataPermissions,
      ];
      await RoleService.editPermissions(props.role.id!, selectedPermissions);
      message.success('设置成功');
      props.close();
      if (props.reload) {
        props.reload();
      }
    } catch (ex) {
      message.error('设置失败');
      console.error('错误信息', ex);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="设置权限"
      width="40%"
      open={props.open}
      onCancel={props.close}
      onOk={handleSubmit}
    >
      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: 16 }}>
              <h3>模块权限</h3>
              <Tree
                checkable
                selectable
                treeData={permissions.module}
                checkedKeys={selectedModulePermissions}
                onCheck={(checkedKeys) => setSelectedModulePermissions(checkedKeys as number[])}
              />
            </div>
          </Col>

          <Col span={12}>
            <div style={{ marginBottom: 16 }}>
              <h3>页面权限</h3>
              <Tree
                checkable
                checkedKeys={selectedMenuPermissions}
                treeData={permissions.menu}
                onCheck={(checkedKeys) => setSelectedMenuPermissions(checkedKeys as number[])}
              />
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: 16 }}>
              <h3>按钮权限</h3>
              <Checkbox.Group
                options={permissions.button.map((perm) => ({
                  label: perm.name,
                  value: perm.id,
                }))}
                value={selectedButtonPermissions}
                onChange={(checkedValues) =>
                  setSelectedButtonPermissions(checkedValues as number[])
                }
              />
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 16 }}>
              <h3>数据权限</h3>
              <Checkbox.Group
                options={permissions.data.map((perm) => ({
                  label: perm.name,
                  value: perm.id,
                }))}
                value={selectedDataPermissions}
                onChange={(checkedValues) => setSelectedDataPermissions(checkedValues as number[])}
                style={{ display: 'flex', flexDirection: 'column' }}
              />
            </div>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};

export default PermissionSelectDialog;
