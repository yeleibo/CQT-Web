import React, {useRef, useState} from "react";
import {ActionType, PageContainer, type ProColumns, ProTable} from "@ant-design/pro-components";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import DeleteButton from "@/components/DelectButton";
import InventoryHouseAddPage from "@/pages/inventory/house/InventoryHouseAddPage"
import {houseHeaders, InventoryHouseListDto, InventoryHouseQueryParam} from "@/pages/inventory/house/type";
import InventoryHouseService from "@/pages/inventory/house/InventoryHouseService";
import ExportButton from "@/components/ExcelButton/ExportButton";


const InventoryHousePage: React.FC = () => {
  const [current, setCurrent] = useState<InventoryHouseListDto>();
  const [open, setOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<InventoryHouseListDto>[] = [

    {
      title: '关键字',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: '仓库名称',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
    },

    {
      title: '仓库地址',
      dataIndex: 'address',
      valueType: 'textarea',
      search: false,
    },
    {

      title: '所属部门',
      dataIndex: 'organizeName',
      valueType: 'text',
      width: 80,      search: false,
    },
    {
      title: '收货人',
      dataIndex: 'receiver',
      valueType: 'textarea',
      width: 200,
      search: false,
    },
    {

      title: '附加部门',
      valueType: 'text',
      ellipsis:true,
      search: false,
      render: (text, record) => `${record.auxiliaryOrganizeNames?.join(',')}`
    },

    {
      title: '是主仓库',
      valueType:'text',
      search: false,
      render: (text, record) => record.isMain?'是':'否'
    },
    {
      title: '排序',
      dataIndex: 'orderNumber',
      valueType:'text',
      width: 100,
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      valueType:'text',
      search: false,
    },
    {

      title: '操作',
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
          style={{padding: 0}}
        >
          编辑
        </Button>,
        <DeleteButton
          key="delete"
          onDelete={
            async () => {
              await InventoryHouseService.delete(record.id!);
              actionRef.current?.reload();
            }
          }
        >
        </DeleteButton>,
      ],
    },
  ];

  const fetchHouseData = async (): Promise<{ [sheetName: string]:  InventoryHouseListDto[]}> => {
    let params:InventoryHouseQueryParam = {
      pageSize:999999999
    };
    let data =  await InventoryHouseService.list(params);

    return {'仓库数据':data}
  };




  // 自定义表格头部标题，包含多个按钮
  return  <PageContainer pageHeaderRender={false}>
    <ProTable<InventoryHouseListDto, InventoryHouseQueryParam>
      actionRef={actionRef}
      pagination={false}

      headerTitle={
        <div>
          <Button onClick={() => {
            setCurrent(undefined);
            setOpen(true);
          }} type="primary" style={{marginRight: 8}}>
            <PlusOutlined/> 新建
          </Button>
          <ExportButton fetchData={
            fetchHouseData
          } fileName={
                '仓库信息'
          }
                        buttonName={'导出仓库'}

                        headers={
                          houseHeaders

          }></ExportButton>
        </div>
      }

      rowKey="id"
      search={{
        labelWidth: 120,
      }}

      request={async (params) => {
        let r= await InventoryHouseService.list(params);
        return {
          success:true,
          total:r.length,
          data:r
        };
      }}
      columns={columns}

    />
    {open &&  <InventoryHouseAddPage  close={ ()=>{
      setOpen(false);
      setCurrent(undefined);
    }} model={!current ? "add" : 'edit'} houseData={current} open={open} reload={()=>{
      actionRef.current?.reload();
    }}></InventoryHouseAddPage>}


  </PageContainer>;
}




export default InventoryHousePage;
