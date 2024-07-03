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
import {SuggestedPurchaseGoodQueryParam,SuggestedPurchaseGood} from "@/pages/inventory/statistics/type";
import DeleteButton from "@/components/DelectButton";


//采购建议
const SuggestedPurchaseGoodPage: React.FC = () => {
  // const [current, setCurrent] = useState<EngineeringInventoryOutGood>();
  // const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<SuggestedPurchaseGood>[] = [

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

      title: '物资编码',
      dataIndex: 'goodCode',
      valueType: 'text',
      search: false,
    },

    {
      title: '单位',
      dataIndex: 'goodUnitName',
      valueType:'text',
      search: false,
    },
    {
      title: '请购数量',
      dataIndex: 'prePurchaseRequestAmount',
      valueType:'text',
      search: false,
    },
    {
      title: '已调拨数量',
      dataIndex: 'transferredGoodAmount',
      valueType:'text',
      search: false,
    },
    {
      title: '未入库数量',
      dataIndex: 'unInventoryInAmount',
      valueType:'text',
      search: false,
    },
    {
      title: '仓库数量',
      dataIndex: 'mainInventoryHouseAmount',
      valueType:'text',
      search: false,
    },
    {
      title: '建议采购数量',
      dataIndex: 'suggestedPurchaseAmount',
      valueType:'text',
      search: false,
    },
  ];

  // 自定义表格头部标题，包含多个按钮
  return  <PageContainer pageHeaderRender={false}>
    <ProTable<SuggestedPurchaseGood, SuggestedPurchaseGoodQueryParam>
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
        let r= await StatisticsService.getSuggestedPurchaseGood(params);
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




export default SuggestedPurchaseGoodPage;
