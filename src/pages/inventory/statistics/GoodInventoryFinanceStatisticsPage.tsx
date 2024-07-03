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
import {InventoryFinanceStatisticsListDto,GoodInventoryFinanceStatisticsQueryParam} from "@/pages/inventory/statistics/type";
import DeleteButton from "@/components/DelectButton";


//财务统计
const GoodInventoryFinanceStatisticsPage: React.FC = () => {
  // const [current, setCurrent] = useState<EngineeringInventoryOutGood>();
  // const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<InventoryFinanceStatisticsListDto>[] = [

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
      title: '物资名称',
      dataIndex: 'goodName',
      valueType: 'textarea',
      search: false,
      width:150,
    },
    {
      title: '单据编号',
      dataIndex: 'code',
      valueType: 'textarea',
      width: 150,
      search: false,
    },
    {
      title: '单据类型',
      dataIndex: 'typeName',
      valueType: 'textarea',
      width: 150,
      search: false,
    },
    {
      title: '仓库名称',
      dataIndex: 'inventoryHouseName',
      valueType: 'textarea',
      width: 150,
      search: false,
    },
    {
      title: '期初单价',
      dataIndex: 'startTimeUnitPrice',
      valueType: 'textarea',
      width: 150,
      search: false,
    },
    {
      title: '期初数量',
      dataIndex: 'startTimeAmount',
      valueType: 'textarea',
      width: 150,
      search: false,
    },
    {
      title: '期初金额',
      dataIndex: 'startTimeTotalPrice',
      valueType: 'textarea',
      width: 150,
      search: false,
    },
    {
      title: '收入单价',
      dataIndex: 'inUnitPrice',
      valueType: 'textarea',
      width: 150,
      search: false,
    },
    {
      title: '收入数量',
      dataIndex: 'inAmount',
      valueType: 'textarea',
      width: 150,
      search: false,
    },
    {
      title: '收入金额',
      dataIndex: 'inTotalPrice',
      valueType: 'textarea',
      width: 150,
      search: false,
    },
    {
      title: '发出单价',
      dataIndex: 'outUnitPrice',
      valueType: 'textarea',
      width: 150,
      search: false,
    },
    {
      title: '发出数量',
      dataIndex: 'outAmount',
      valueType: 'textarea',
      width: 150,
      search: false,
    },
    {
      title: '发出金额',
      dataIndex: 'outTotalPrice',
      valueType: 'textarea',
      width: 150,
      search: false,
    },
    {

      title: '结存单价',
      dataIndex: 'endTimeUnitPrice',
      valueType: 'text',
      width: 100,
      search: false,
    },

    {
      title: '结存数量',
      dataIndex: 'endTimeAmount',
      valueType:'text',
      width: 100,
      search: false,
    },
    {
      title: '结存金额',
      dataIndex: 'endTimeTotalPrice',
      valueType:'text',
      search: false,
      width:100,
    },
  ];

  // 自定义表格头部标题，包含多个按钮
  return  <PageContainer pageHeaderRender={false}>
    <ProTable<InventoryFinanceStatisticsListDto, GoodInventoryFinanceStatisticsQueryParam>
      actionRef={actionRef}
      pagination={false}
      scroll={{ x: 1300 }}

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
        let r= await StatisticsService.goodInventoryFinanceStatistics(params);
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




export default GoodInventoryFinanceStatisticsPage;
