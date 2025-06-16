import DeleteButton from '@/components/DelectButton';
import TenantDetailPage from '@/pages/tenant/TenantDetailPage';
import TenantService from '@/pages/tenant/TenantService';
import { Tenant, TenantParams } from '@/pages/tenant/type';
import { useIntl } from '@@/plugin-locale';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, type ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';

const TenantListPage: React.FC = () => {
  const [current, setCurrent] = useState<Tenant>();
  const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const columns: ProColumns<Tenant>[] = [
    {
      title: intl.formatMessage({ id: 'keyword' }),
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: intl.formatMessage({ id: 'customerName' }),
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
    },

    {
      title: intl.formatMessage({ id: 'address' }),
      dataIndex: 'address',
      valueType: 'textarea',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'contactPersonName' }),
      dataIndex: 'contactPersonName',
      valueType: 'text',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'contactPersonPhoneNumber' }),
      dataIndex: 'contactPersonPhoneNumber',
      valueType: 'textarea',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'email' }),
      dataIndex: 'email',
      valueType: 'text',
      search: false,
    },

    {
      title: intl.formatMessage({ id: 'server' }),
      valueType: 'text',
      search: false,
      dataIndex: 'server',
    },
    {
      title: intl.formatMessage({ id: 'group' }),
      dataIndex: 'group',
      valueType: 'text',
      width: 100,
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'remark' }),
      dataIndex: 'remark',
      width: 200,
      valueType: 'text',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'operate' }),
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => [
        <Button
          type={'link'}
          onClick={() => {
            setCurrent(record);
            setOpen(true);
          }}
          key="view"
          style={{ padding: 0 }}
        >
          {intl.formatMessage({ id: 'edit' })}
        </Button>,
        <DeleteButton
          key="delete"
          onDelete={async () => {
            await TenantService.delete(record.id);
            actionRef.current?.reload();
          }}
        ></DeleteButton>,
      ],
    },
  ];

  // 自定义表格头部标题，包含多个按钮
  return (
    <PageContainer pageHeaderRender={false} style={{margin: '20px'}}>
      <ProTable<Tenant, TenantParams> 
        actionRef={actionRef}

        pagination={false}
        headerTitle={
          <div>
            <Button
              onClick={() => {
                setCurrent(undefined);
                setOpen(true);
              }}
              type="primary"
              style={{ marginRight: 8 }}
            >
              <PlusOutlined /> {intl.formatMessage({ id: 'add' })}
            </Button>
          </div>
        }
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async (params) => {
          return await TenantService.list(params);
        }}
        columns={columns}
      />
      {open && (
        <TenantDetailPage
          close={() => {
            setOpen(false);
            setCurrent(undefined);
          }}
          model={!current ? intl.formatMessage({ id: 'add' }) : intl.formatMessage({ id: 'edit' })}
          tenantData={current}
          open={open}
          reload={() => {
            actionRef.current?.reload();
          }}
        ></TenantDetailPage>
      )}
    </PageContainer>
  );
};

export default TenantListPage;
