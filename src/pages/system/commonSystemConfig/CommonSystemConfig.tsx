import React, { useRef, useState } from 'react';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import SysConfigEdit from "@/pages/system/commonSystemConfig/edit";
import {SystemConfig} from "@/pages/system/commonSystemConfig/type";
import CommonEdit from "@/pages/system/commonSystemConfig/commonEdit";
import ResizableTitle from '@/components/ResizableTitle';
import SystemService from '@/pages/system/service';

const CommonSystemConfig: React.FC = () => {
  const [current, setCurrent] = useState<SystemConfig>();
  const [openImageUpload, setOpenImageUpload] = useState<boolean>(false);
  const [openCommon, setOpenCommon] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const [columns, setColumns] = useState<ProColumns<SystemConfig>[]>([
    {
      title: '参数名称',
      dataIndex: 'name',
      valueType: 'text',
      width: 150,
    },
    {
      title: '键名',
      dataIndex: 'configKey',
      valueType: 'text',
      search: false,
      width: 150,
    },
    {
      title: '参数值',
      dataIndex: 'value',
      search: false,
      ellipsis: true,
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
      width: 150,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (_, record) => [
        <Button
          type={'link'}
          onClick={() => {
            if(record.configKey === 'mobile.sys.home.swiper'){
              setOpenImageUpload(true);
            }else{
              setOpenCommon(true);
            }
            setCurrent(record);

          }}
          key="view"
          style={{ padding: 0 }}
        >
          编辑
        </Button>,
      ],
    },
  ]);

  // 列宽拖拽处理
  const handleResize =
    (index: number) =>
    (e: React.SyntheticEvent<Element>, { size }: { size: { width: number } }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      setColumns(nextColumns);
    };

  const mergedColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column: any) => ({
      width: column.width,
      onResize: handleResize(index),
    }) as any,
  }));

  const components = {
    header: {
      cell: ResizableTitle,
    },
  };
  return (
    <div style={{margin: '20px'}}>
      <PageContainer pageHeaderRender={false}>
        <ProTable<SystemConfig>
          actionRef={actionRef}
          scroll={{ x: 1500 }}
          // headerTitle={
          //   <div>
          //     <Button
          //       onClick={() => {
          //         setCurrent(undefined);
          //         setOpen(true);
          //       }}
          //       type="primary"
          //       style={{ marginRight: 8 }}
          //     >
          //       <PlusOutlined /> 新建
          //     </Button>
          //   </div>
          // }
          rowKey="id"
          search={{
            labelWidth: 120,
            defaultCollapsed: false, // 默认展开搜索栏
          }}
          request={async () => {
            let data = await SystemService.getConfigList();
            return { data: data, success: true, total: data.length };
          }}
          columns={mergedColumns}
          components={components}
        ></ProTable>
        {
          openImageUpload && (
            <SysConfigEdit
              data={current}
              open={openImageUpload}
              onClose={() => {
                setOpenImageUpload(false);
                setCurrent(undefined);
                actionRef.current?.reload();
              }}
            />
          )
        }
        {
          openCommon && (
            <CommonEdit
              data={current}
              open={openCommon}
              onClose={() => {
                setOpenCommon(false);
                setCurrent(undefined);
                actionRef.current?.reload();
              }}
            />
          )
        }
      </PageContainer>
    </div>
  );
};

export default CommonSystemConfig;
