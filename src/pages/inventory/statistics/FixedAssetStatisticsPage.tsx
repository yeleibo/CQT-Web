import React, { useRef, useState} from "react";
import {
  ActionType,
  type ProColumns,

  ProTable,
  PageContainer
} from "@ant-design/pro-components";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import StatisticsService from "@/pages/inventory/statistics/StatisticsService"
import InventoryHouseService from "@/pages/inventory/house/InventoryHouseService"
import {FixedAssetStatistics,FixedAssetStatisticsQueryParam} from "@/pages/inventory/statistics/type";
import DeleteButton from "@/components/DelectButton";


//固定资产统计
const FixedAssetStatisticsPage: React.FC = () => {
  // const [current, setCurrent] = useState<EngineeringInventoryOutGood>();
  // const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<FixedAssetStatistics>[] = [

    {
      title: '关键字',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },

    {
      title: '仓库名称',
      dataIndex: 'inventoryHouseIds',
      valueType: 'select',
      hideInTable:true,
      request: async () => {
        const response = await InventoryHouseService.getAllInventoryHouse();
        return response.map((warehouse: any) => ({
          label: warehouse.name,
          value: warehouse.id,
        }));
      },
    },
    {
      title: '时间范围',
      dataIndex: 'dateRange',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => ({
          startTime: value[0],
          endTime: value[1],
        }),
      },
    },
    {
      title: '仓库名称',
      dataIndex: 'inventoryHouseName',
      valueType: 'textarea',
      search:false
    },
    {

      title: '固定资产名称',
      dataIndex: 'fixedAssetName',
      valueType: 'text',
      search: false,
    },

    {
      title: '数量',
      dataIndex: 'amount',
      valueType:'text',
      search: false,
    },
    {
      title: '金额',
      dataIndex: 'financialAmount',
      valueType:'text',
      search:false
    },
  ];

  // 自定义表格头部标题，包含多个按钮
  return  <PageContainer pageHeaderRender={false}>
    <ProTable<FixedAssetStatistics, FixedAssetStatisticsQueryParam>
      actionRef={actionRef}
      pagination={false}

      // headerTitle={
      //   <div>
      //     <Button onClick={() => {
      //       setCurrent(undefined);
      //       setOpen(true);
      //     }} type="primary" style={{marginRight: 8}}>
      //       <PlusOutlined/> 新建
      //     </Button>
      //   </div>
      // }

      rowKey="id"
      search={{
        labelWidth: 120,
      }}

      request={async (params) => {
        let r= await StatisticsService.fixedAssetStatistics(params);
        return {
          success:true,
          total:r.length,
          data:r
        };
      }}
      columns={columns}

    />
    {/*{open &&  <SupplierSave  close={ ()=>{*/}
    {/*  setOpen(false);*/}
    {/*  setCurrent(undefined);*/}
    {/*}} model={!current ? "add" : 'edit'} supplierData={current} open={open} reload={()=>{*/}
    {/*  actionRef.current?.reload();*/}
    {/*}}></SupplierSave>}*/}


  </PageContainer>;
}




export default FixedAssetStatisticsPage;
