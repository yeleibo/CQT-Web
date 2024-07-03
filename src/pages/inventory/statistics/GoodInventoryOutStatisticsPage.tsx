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
import {GoodInventoryOutStatisticsQueryParam,InventoryOutGoodList} from "@/pages/inventory/statistics/type";
import DeleteButton from "@/components/DelectButton";


//物资出库明细
const GoodInventoryOutStatisticsPage: React.FC = () => {
  // const [current, setCurrent] = useState<EngineeringInventoryOutGood>();
  // const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<InventoryOutGoodList>[] = [

    {
      title: '关键字',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },

    {
      title: '相关仓库',
      dataIndex: 'inventoryOutHouseIds',
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
      title: '领料人',
      dataIndex: 'recipient',
      valueType:'text',
      hideInTable:true
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
      title: '物资名称',
      dataIndex: 'goodName',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '出库编号',
      dataIndex: 'inventoryOutCode',
      valueType: 'textarea',
      width: 150,
      search: false,
    },
    {
      title: '出库仓库',
      dataIndex: 'inventoryOutHouseName',
      valueType: 'textarea',
      search: false,
    },
    {

      title: '领料人',
      dataIndex: 'recipient',
      valueType: 'text',
      width: 100,
      search: false,
    },

    {
      title: '数量',
      dataIndex: 'amount',
      valueType:'text',
      width: 100,
      search: false,
    },
    {
      title: '已执行数量',
      dataIndex: 'executedAmount',
      valueType:'text',
      search:false
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType:'text',
      search:false
    },
  ];

  // 自定义表格头部标题，包含多个按钮
  return  <PageContainer pageHeaderRender={false}>
    <ProTable<InventoryOutGoodList, GoodInventoryOutStatisticsQueryParam>
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
        return   await StatisticsService.goodInventoryOutStatistics(params);
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




export default GoodInventoryOutStatisticsPage;
