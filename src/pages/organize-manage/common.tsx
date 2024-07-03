import { filterTreeData } from '@/pages/organize-manage/role/RoleUserSelect';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Input, List, message, Modal, Spin, Tree } from 'antd';
import Row from 'antd/lib/row';
import React, { useEffect, useMemo, useState } from 'react';

interface TreeSelectProps {
  open: boolean;
  close: () => void;
  reload: () => void;
  userId: number;
  title: string;
  initSelectedIds: number[];
  onSubmit: (selectedIds: number[]) => Promise<void>;
  fetchFunction: object;
}

const useGetData = (fetchFunction: object) => {
  const [data, setData] = useState<{ id: number; name: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFunction;
        setData(response);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction]);

  return { data, loading };
};

const CommonSelectDialog: React.FC<TreeSelectProps> = (props) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(props.initSelectedIds);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false); // Separate loading state for submit
  const { data, loading } = useGetData(props.fetchFunction);

  const FilteredData = useMemo(
    () =>
      filterTreeData(
        data.map((item) => ({
          title: item.name,
          value: item.id,
          key: item.id,
        })),
        searchTerm,
      ),
    [data, searchTerm],
  );

  const selectedOrganizes = useMemo(
    () => data.filter((e) => selectedIds.includes(e.id!)),
    [selectedIds, data],
  );
  const handleCheck = (checkedKeys: any, info: { checkedNodes: any[] }) => {
    const checkValues = info.checkedNodes.map((node) => node.value);
    setSelectedIds(checkValues);
  };

  const handleRemove = (removeId: number) => {
    setSelectedIds(selectedIds.filter((id) => id !== removeId));
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    try {
      await props.onSubmit(selectedIds);
      setLoadingSubmit(false);
      message.success('操作成功');
      props.close();
      if (props.reload) {
        props.reload();
      }
    } catch (error) {
      setLoadingSubmit(false);
      message.error('操作失败');
      console.error('Submit Error:', error);
    }
  };

  return (
    <Modal
      open={props.open}
      title={props.title}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索"
              style={{ marginBottom: 8 }}
            />
            <Tree
              treeData={FilteredData}
              checkable
              selectable
              checkedKeys={selectedIds}
              onCheck={handleCheck}
            />
          </Col>
          <Col span={1} />
          <Col span={12}>
            <List
              header={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>已选</span>
                  <Button type="link" onClick={handleClearAll}>
                    清空
                  </Button>
                </div>
              }
              bordered
              dataSource={selectedOrganizes}
              renderItem={(organize) => (
                <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div>{organize.name}</div>
                    {/*<div>类型: {getOrganizeTypeLabel(organize.type)}</div>*/}
                  </div>
                  <Button
                    type="link"
                    icon={<CloseOutlined />}
                    onClick={() => handleRemove(organize.id!)}
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

export default CommonSelectDialog;
