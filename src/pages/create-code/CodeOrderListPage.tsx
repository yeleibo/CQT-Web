import DeleteButton from '@/components/DelectButton';
import CodeOrderDetailPage from '@/pages/create-code/CodeOrderDetailPage';
import { CodeOrder, CodeOrderParam } from '@/pages/create-code/codeType';
import ISPService from '@/pages/isp/ISPService';
import { useIntl } from '@@/plugin-locale';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, type ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';

const CodeOrderListPage: React.FC = () => {
  const [current, setCurrent] = useState<CodeOrder>();
  const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const columns: ProColumns<CodeOrder>[] = [
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
            await ISPService.delete(record.id);
            actionRef.current?.reload();
          }}
        ></DeleteButton>,
      ],
    },
  ];
  return (
    <PageContainer pageHeaderRender={false}>
      <ProTable<CodeOrder, CodeOrderParam>
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
            {/*<ExportButton*/}
            {/*  fetchData={fetchHouseData}*/}
            {/*  fileName={'仓库信息'}*/}
            {/*  buttonName={'导出仓库'}*/}
            {/*  headers={houseHeaders}*/}
            {/*></ExportButton>*/}
          </div>
        }
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        dataSource={[]}
        // request={async (params) => {
        //   let r = await ISPService.list(params);
        //   return {
        //     success: true,
        //     total: r.length,
        //     data: r,
        //   };
        // }}
        columns={columns}
      />
      {open && (
        <CodeOrderDetailPage
          close={() => {
            setOpen(false);
            setCurrent(undefined);
          }}
          model={!current ? intl.formatMessage({ id: 'add' }) : intl.formatMessage({ id: 'edit' })}
          codeOrderData={current}
          open={open}
          reload={() => {
            actionRef.current?.reload();
          }}
        ></CodeOrderDetailPage>
      )}
    </PageContainer>
  );
};

export default CodeOrderListPage;
