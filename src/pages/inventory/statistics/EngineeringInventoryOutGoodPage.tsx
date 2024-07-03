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
import {EngineeringInventoryOutGood,EngineeringInventoryOutGoodsQueryParam} from "@/pages/inventory/statistics/type";
import DeleteButton from "@/components/DelectButton";


//工程出库物资
const EngineeringInventoryOutGoodPage: React.FC = () => {
  // const [current, setCurrent] = useState<EngineeringInventoryOutGood>();
  // const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<EngineeringInventoryOutGood>[] = [

    {
      title: '工程关键字',
      dataIndex: 'engineeringKeyword',
      valueType: 'textarea',
      hideInTable:true
    },
    {
      title: '物资关键字',
      dataIndex: 'goodKeyword',
      valueType: 'textarea',
      hideInTable:true
    },
    {
      title: '工程名称',
      dataIndex: 'engineeringName',
      valueType: 'textarea',
      width: 250,
      search:false,
    },

    {
      title: '工程编码',
      dataIndex: 'engineeringCode',
      width: 100,
      valueType: 'textarea',
      search: false,
    },
    {

      title: '出库仓库',
      dataIndex: 'inventoryOutHouseName',
      valueType: 'text',
      width: 80,
      search: false,
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
      width: 150,
      search:false
    },
    {

      title: '物资编码',
      dataIndex: 'contactPersonName',
      valueType: 'text',
      width: 70,
      search: false,
    },

    {
      title: '出库数量',
      dataIndex: 'amount',
      valueType:'text',
      width: 100,
      search: false,
    },

  ];

  // 自定义表格头部标题，包含多个按钮
  return  <PageContainer pageHeaderRender={false}>
    <ProTable<EngineeringInventoryOutGood, EngineeringInventoryOutGoodsQueryParam>
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
        let r= await StatisticsService.getEngineeringInventoryOutGoods(params);
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




export default EngineeringInventoryOutGoodPage;
