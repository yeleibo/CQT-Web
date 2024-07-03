import React, {useRef} from "react";
import {ActionType, PageContainer, type ProColumns, ProTable} from "@ant-design/pro-components";
import {Table} from 'antd';


import StatisticsService from "@/pages/inventory/statistics/StatisticsService"
import InventoryHouseService from "@/pages/inventory/house/InventoryHouseService"
import {
  EngineeringRemainderGoodsStatistics,
  EngineeringRemainderGoodsStatisticsQueryParam
} from "@/pages/inventory/statistics/type";


//工程出库物资
const EngineeringRemainderGoodsStatisticsPage: React.FC = () => {
  // const [current, setCurrent] = useState<EngineeringRemainderGoodsStatistics>();
  // const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<EngineeringRemainderGoodsStatistics>[] = [

    {
      title: '关键字',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: '工程名称',
      dataIndex: 'engineeringName',
      valueType: 'textarea',
      search:false
    },

    {
      title: '工程编码',
      dataIndex: 'engineeringCode',
      width: 100,
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
      title: '物资名称',
      dataIndex: 'goodName',
      valueType: 'textarea',
      search:false
    },
    {

      title: '剩余数量',
      dataIndex: 'remainderAmount',
      valueType: 'text',
      width: 100,
      search: false,
    },

    {
      title: '剩余可用数量',
      dataIndex: 'remainderAvailableAmount',
      valueType: 'text',
      width: 100,
      search: false,
    },
    {
      title: '可用总金额',
      valueType: 'text',
      width:100,
      search:false,
      render: (dom, entity) =>  `${entity.totalAvailableFinancialAmount.toFixed(2)}`
    },

  ];

  const summary = (pageData: readonly EngineeringRemainderGoodsStatistics[]) => {
    let totalRemainderAmount = pageData.reduce((sum, record) => sum + record.remainderAmount, 0);
    let totalRemainderAvailableAmount = pageData.reduce((sum, record) => sum + record.remainderAvailableAmount, 0);
    let totalAvailableFinancialAmount = pageData.reduce((sum, record) => sum + record.totalAvailableFinancialAmount, 0);

    return (
      <Table.Summary fixed><Table.Summary.Row>
        <Table.Summary.Cell index={0} colSpan={4}>合计</Table.Summary.Cell>
        <Table.Summary.Cell index={1}>{totalRemainderAmount.toFixed(2)}</Table.Summary.Cell>
        <Table.Summary.Cell index={2}>{totalRemainderAvailableAmount.toFixed(2)}</Table.Summary.Cell>
        <Table.Summary.Cell index={3}>{totalAvailableFinancialAmount.toFixed(2)}</Table.Summary.Cell>
      </Table.Summary.Row></Table.Summary>

    );
  };

  // 自定义表格头部标题，包含多个按钮
  return <PageContainer pageHeaderRender={false}>
    <ProTable<EngineeringRemainderGoodsStatistics, EngineeringRemainderGoodsStatisticsQueryParam>
      actionRef={actionRef}
      pagination={false}
      summary={summary}

      scroll={{x:true,y:'60vh'}}
      rowKey="id"
      search={{
        labelWidth: 120,
      }}

      request={async (params) => {
        let r = await StatisticsService.getEngineeringRemainderGoods(params);

        return {
          success: true,
          total: r.length,
          data: r
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


export default EngineeringRemainderGoodsStatisticsPage;
