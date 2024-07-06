import DeleteButton from '@/components/DelectButton';
import ExportButton from '@/components/ExcelButton/ExportButton';
import UserService from '@/pages/organize-manage/user/UserService';
import AreaService from '@/pages/project/AreaService';
import { AreaDto, AreaStatisticsQueryParam } from '@/pages/project/type';
import chaoqianService from '@/pages/topology/chaoqianService';
import {
  ChaoqianBoxDto,
  ChaoqianTopologyParam,
  chaoqianBoxDtoHeaders,
} from '@/pages/topology/type';
import { useIntl } from '@@/plugin-locale';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';

const ZoneConfigurationPage: React.FC = () => {
  const [areaDto, setAreaDto] = useState<AreaDto>();
  const [list, setList] = React.useState<boolean>(true);
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const columns: ProColumns<AreaDto>[] = [
    {
      title: intl.formatMessage({ id: 'keyword' }),
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },

    {
      title: intl.formatMessage({ id: 'index' }),
      valueType: 'text',
      search: false,
      render: (text, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'areaName' }),
      dataIndex: 'name',
      valueType: 'text',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      valueType: 'text',
      search: false,
      render: (text, record) =>
        record.status === 0
          ? intl.formatMessage({ id: 'unSubmitted' })
          : intl.formatMessage({ id: 'submitted' }),
    },
    {
      title: intl.formatMessage({ id: 'operate' }),
      valueType: 'option',
      fixed: 'right',
      width: 300,
      render: (_, record) => [
        <Button type="link" onClick={() => {}} key="edit" style={{ padding: 0 }}>
          {intl.formatMessage({ id: 'edit' })}
        </Button>,
        <ExportButton
          key="export"
          type="link"
          fileName={record.name}
          headers={chaoqianBoxDtoHeaders}
          fetchData={async (): Promise<{ [sheetName: string]: ChaoqianBoxDto[] }> => {
            let params: ChaoqianTopologyParam = {
              areaId: record.id,
            };
            let r = await chaoqianService.getChaoqianTopology(params);
            return { [record.name]: r };
          }}
          buttonName={intl.formatMessage({ id: 'export' })}
        ></ExportButton>,
        <Button type="link" onClick={async () => {}} key="submit" style={{ padding: 0 }}>
          {intl.formatMessage({ id: 'submit' })}
        </Button>,

        <DeleteButton
          key="delete"
          onDelete={async () => {
            await UserService.delete(record.id!);
            actionRef.current?.reload();
          }}
        />,
      ],
    },
  ];

  return (
    <>
      <PageContainer pageHeaderRender={false}>
        <ProTable<AreaDto, AreaStatisticsQueryParam>
          actionRef={actionRef}
          pagination={{ pageSize: 10 }}
          headerTitle={
            <Button onClick={() => {}} type="primary" style={{ marginRight: 8 }}>
              <PlusOutlined /> {intl.formatMessage({ id: 'add' })}
            </Button>
          }
          rowKey="id"
          search={{ labelWidth: 120 }}
          columns={columns}
          request={async (params) => {
            const areas = await AreaService.getAreaStatistics(params);
            return { data: areas, success: true, total: areas.length };
          }}
        />
      </PageContainer>
    </>
  );
};

export default ZoneConfigurationPage;
