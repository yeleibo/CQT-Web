import React, { useRef, useState} from "react";
import {
  ActionType,
  type ProColumns,

  ProTable,
  PageContainer
} from "@ant-design/pro-components";
import {Button, Table} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import StatisticsService from "@/pages/inventory/statistics/StatisticsService"
import InventoryHouseService from "@/pages/inventory/house/InventoryHouseService"
import {
  InventoryStatisticsHouse,
  InventoryStatisticsHouseWarnQueryParam
} from "@/pages/inventory/statistics/type";
import DeleteButton from "@/components/DelectButton";


//仓库物资库存
const GoodAmountStatisticsWithInventoryHousePage: React.FC = () => {
  // const [current, setCurrent] = useState<EngineeringInventoryOutGood>();
  // const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<InventoryStatisticsHouse>[] = [

    {
      title: '关键字',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },

    {
      title: '物资名称',
      dataIndex: 'goodName',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '仓库名称',
      dataIndex: 'inventoryHouseName',
      valueType: 'text',
      search: false,
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

      title: '单位',
      dataIndex: 'unitName',
      valueType: 'text',
      width: 80,
      search: false,
    },

    {
      title: '数量',
      dataIndex: 'amount',
      valueType:'text',
      search: false,
    },
    {
      title: '实际总金额',
      valueType:'text',
      search: false,
      render: (dom, entity) =>  `${entity.financialAmount.toFixed(2)}`
    },
    {
      title: '可用数量',
      dataIndex: 'availableAmount',
      valueType:'text',
      search: false,
    },
    {
      title: '可用总金额',
      valueType:'text',
      search: false,
      render: (dom, entity) =>  `${entity.financialAvailableAmount.toFixed(2)}`
    },
  ];

  const summary = (pageData: readonly InventoryStatisticsHouse[]) => {
    let totalAmount = pageData.reduce((sum, record) => sum + record.amount, 0);
    let totalFinancialAmount = pageData.reduce((sum, record) => sum + record.financialAmount, 0);
    let totalAvailableAmount = pageData.reduce((sum, record) => sum + record.availableAmount, 0);
    let totalFinancialAvailableAmount = pageData.reduce((sum, record) => sum + record.financialAvailableAmount, 0);
    return (
      <Table.Summary fixed><Table.Summary.Row>
        <Table.Summary.Cell index={0} colSpan={3}>合计</Table.Summary.Cell>
        <Table.Summary.Cell index={1}>{totalAmount.toFixed(2)}</Table.Summary.Cell>
        <Table.Summary.Cell index={2}>{totalFinancialAmount.toFixed(2)}</Table.Summary.Cell>
        <Table.Summary.Cell index={3}>{totalAvailableAmount.toFixed(2)}</Table.Summary.Cell>
        <Table.Summary.Cell index={4}>{totalFinancialAvailableAmount.toFixed(2)}</Table.Summary.Cell>
      </Table.Summary.Row></Table.Summary>

    );
  };

  // 自定义表格头部标题，包含多个按钮
  return  <PageContainer pageHeaderRender={false}>
    <ProTable<InventoryStatisticsHouse, InventoryStatisticsHouseWarnQueryParam>
      actionRef={actionRef}
      pagination={false}
      summary={summary}

      scroll={{x:true,y:'60vh'}}
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
        return await StatisticsService.getHouseStatistics(params);

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




export default GoodAmountStatisticsWithInventoryHousePage;
