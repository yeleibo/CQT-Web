import {
  EditableProTable,
  type ProColumns,
  ProFormText,
  ProFormTextArea,
  PageContainer
} from '@ant-design/pro-components';
import {Button, Form, message, Input} from 'antd';
import React, {useEffect, useState} from 'react';
import WorkflowInstanceDetail, {WorkflowInstanceDetailProps} from "@/pages/workflow/instance/WorkflowInstanceDetail";
import {PlusOutlined,DeleteOutlined} from "@ant-design/icons";
import GoodSelect from "@/pages/inventory/good/GoodSelect";
import {Good} from "@/pages/inventory/good/type";
import {InventoryInAddDto, InventoryInGood, InventoryInMethod} from "@/pages/inventory/in/type";
import SelectPurchase from "@/pages/inventory/in/SelectPurchase";
import {
  InventoryPurchaseGood,
  InventoryPurchaseListDto
} from "@/pages/inventory/purchase/type";
import OrganizeTreeSelect from "@/pages/organize-manage/organize/OrganizeTreeSelect";
import HouseSelect from "@/pages/inventory/purchase-request/HouseSelect";
import PurchaseService from "@/pages/inventory/purchase/PurchaseService";

import SelectEngineering from "@/pages/Engineering/SelectEngineering";
import {EngineeringItem} from "@/pages/Engineering/typings";

interface InventoryInProps{
   onClose: () => void;
   title: React.ReactNode;
   onSave: () => void;
  inventoryInMethod:InventoryInMethod;
  workflowInstanceId: string;
}

const InventoryInSavePage: React.FC<InventoryInProps> = (props) => {
  const [inventoryInGoods, setInventoryInGoods] = useState<readonly InventoryInGood[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(
    []
  );
  const [openSelectGoods, setOpenSelectGoods] = useState<boolean>(false);
  const [selectedInGoods,setSelectedInGoods] = useState<InventoryInGood[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [openSelectPurchase, setOpenSelectPurchase] = React.useState<boolean>(false);
  const [openSelectEngineering,setOpenSelectEngineering] = React.useState<boolean>(false);
  const [form] = Form.useForm();
  const [purchase, setPurchase] = useState<InventoryPurchaseListDto[]>([]);
  const [engineeringItems, setEngineeringItems] = useState<EngineeringItem[]>([])
  const [inventoryInAddDto,setInventoryInAddDto] = useState<InventoryInAddDto>();
  const [inventoryInHouseIds,setInventoryInHouseIds] = useState<number[]>([]);

  useEffect(() => {
      if(inventoryInAddDto){
        form.setFieldsValue(inventoryInAddDto);
      }
  }, [inventoryInAddDto]);

  let operationButtons = props.workflowInstanceId ? [
    <Button key="handle" type="primary" onClick={() => {
      message.info("弹窗");
    }}>提交</Button>,
    <Button key="rollback" type="primary">退回</Button>,
  ] :[
    (!props.onSave?<></>:<Button key="save" type="primary">保存</Button>),
    <Button key="submit" type="primary">提交</Button>,
  ] ;

  const purchaseGoodMapToInventoryInGood = (dto: InventoryPurchaseGood): InventoryInGood => ({
    inventoryPurchaseGoodId: dto.id,
    goodId: dto.goodId,
    goodName: dto.goodName,
    goodCode: dto.goodCode,
    unitName: dto.unitName,
    unitPriceBeforeTax: dto.unitPriceBeforeTax,
    unitPriceAfterTax: dto.unitPriceAfterTax,
    amount: dto.amount,
    isZeroPrice: dto.isZeroPrice,
    totalPriceBeforeTax: dto.totalPriceBeforeTax,
    totalPriceAfterTax: dto.totalPriceAfterTax,
    remark: dto.remark,
    executedAmount:0,
    toExecuteAmount:0,
    availableRollbackAmount:0
  });
  const goodMapToInventoryInGood = (good:Good):InventoryInGood => ({
    goodId: good.id,
    goodName: good.name,
    goodCode: good.code,
    unitName: good.unitName,
    unitPriceBeforeTax:good.unitPriceBeforeTax,
    unitPriceAfterTax:good.unitPriceAfterTax,
    amount:0,
    executedAmount:0,
    toExecuteAmount:0,
    availableRollbackAmount:0
  });
  const fetchGoods =  (id: number) => {

    PurchaseService.goods(id).then((data) => {
      const finalData = data.map(purchaseGoodMapToInventoryInGood)
      setInventoryInGoods(finalData);
      setEditableRowKeys(finalData.map((item) => item.goodId));
    });
  };

  const remove = ()=>{
    const filteredArray = inventoryInGoods.filter(
      good => selectedInGoods.some(good2 => good.goodId !== good2.goodId)
    );
    setInventoryInGoods(filteredArray);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectRowKeys: React.Key[], selectedRows: InventoryInGood[]) => {
      setSelectedInGoods(selectedRows);
      setSelectedRowKeys(selectRowKeys);
    },
    alwaysShowAlert: true,
  };



  const columns:ProColumns<InventoryInGood>[] = [
    {
      title: '序号',
      valueType: 'text',
      editable:false,
      search: false,
      render:(text, record,index) =>
       index+1
      ,
    },
    {
      title: '物资编码',
      dataIndex: 'goodCode',
      valueType: 'text',
      search: false,
      editable:false
    },
    {
      title: '物资名称',
      dataIndex: 'goodName',
      valueType: 'text',
      search: false,
      editable:false
    },
    {
      title: '单位',
      dataIndex: 'unitName',
      width: 80,
      editable:false
    },
    {
      title: '采购税前价',
      dataIndex: 'unitPriceBeforeTax',
      valueType: 'text',
      search: false,
      formItemProps: () => {
        return {
          rules: [
            { required: true, message: '此项为必填项' },
            {type:"number",message:'请输入数字'},
            {
              min: 0,
              type: 'number',
              message: '值必须大于或等于0',
            },
          ],
        };
      },
    },
    {
      title: '采购税后价',
      dataIndex: 'unitPriceAfterTax',
      valueType: 'text',
      search: false,
      formItemProps: () => {
        return {
          rules: [
            { required: true, message: '此项为必填项' },
            {type:"number",message:'请输入数字'},
            {
              min: 0,
              type: 'number',
              message: '值必须大于或等于0',
            },
          ],
        };
      },
    },
    {
      title: '入库数量',
      dataIndex: 'amount',
      valueType: 'text',
      search: false,
      editable:false
    },
    {
      title: '税前总价',
      dataIndex: 'totalPriceBeforeTax',
      width: 250,
      formItemProps: () => {
        return {
          rules: [
            { required: true, message: '此项为必填项' },
            {type:"number",message:'请输入数字'},
            {
              min: 0,
              type: 'number',
              message: '值必须大于或等于0',
            },
          ],
        };
      },
    },
    {
      title: '税后总价',
      dataIndex: 'totalPriceAfterTax',
      width: 250,
      formItemProps: () => {
        return {
          rules: [
            { required: true, message: '此项为必填项' },
            {type:"number",message:'请输入数字'},
            {
              min: 0,
              type: 'number',
              message: '值必须大于或等于0',
            },
          ],
        };
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
      ellipsis: true,
      search:false,
      editable:false
    },
  ];

  return <PageContainer
    style={{backgroundColor: "#fff", margin: "0px 20px 0px 20px"}}
    breadcrumbRender={false}
    onBack={props.onClose}
    header={
      {
        title: props.title,
        extra: operationButtons
      }

    }
  >

    <Form
      title='基本信息'
      form={form}
      // onFinish={}
    >
      <div style={{display: 'flex', flexWrap: 'wrap', rowGap: '20px', columnGap: '120px',marginTop: '30px', marginBottom: '20px'}}>
          {props.inventoryInMethod === InventoryInMethod.inMain ? <Form.Item
            style={{ width: '280px' }}
            rules={[{required: true, message: '部门为必填项'}]}
            label="进货单据"
            name="inventoryPurchaseCode"
            labelCol={{span: 7}} // 设置标签占据的栅格数
            wrapperCol={{span: 17}} // 设置输入控件占据的栅格数
          >
            <Input
              disabled={false}
              onClick={() => {
                setOpenSelectPurchase(true);
              }}
              placeholder="点击选择进货单据"
            />
          </Form.Item> : <Form.Item
            style={{ width: '280px' }}
            label="关联的工程"
            name="engineeringName"
            labelCol={{span: 7}} // 设置标签占据的栅格数
            wrapperCol={{span: 17}} // 设置输入控件占据的栅格数
          >
            <Input
              disabled={false}
              onClick={() => {
                setOpenSelectEngineering(true);
              }}
              placeholder="点击选择工程单据"
              // value={engineeringItems.length>0?engineeringItems[0].name:''}
            >

            </Input>

          </Form.Item>}

          <Form.Item
            style={{ width: '280px' }}
            name="organizeId"
            rules={[{required: true, message: '部门为必填项'}]}
            label="分公司"
            labelCol={{span: 7}} // 设置标签占据的栅格数
            wrapperCol={{span: 17}} // 设置输入控件占据的栅格数
          >
            <OrganizeTreeSelect
              //  defaultValue={props.data?.organizeId}
            ></OrganizeTreeSelect>
          </Form.Item>

          <ProFormText
            width={200}
            rules={[{required: true, message: '流程为必填项'}]}
            label="选择流程"
            name="name"
            labelCol={{span: 7}} // 设置标签占据的栅格数
            wrapperCol={{span: 17}} // 设置输入控件占据的栅格数
          />
          {
            props.inventoryInMethod === InventoryInMethod.inMain ?

              <ProFormText
                width={200}
                label="供应商"
                disabled={true}
                rules={[{required: true, message: '供应商为必填项'}]}
                name="supplierName"
                labelCol={{span: 7}} // 设置标签占据的栅格数
                wrapperCol={{span: 17}} // 设置输入控件占据的栅格数
              />

              : null
          }
          <Form.Item
            style={{ width: '280px' }}
            name="inventoryInHouseId"
            rules={[{required: true, message: '仓库为必填项'}]}
            label="入库仓库"
            labelCol={{span: 7}} // 设置标签占据的栅格数
            wrapperCol={{span: 17}} // 设置输入控件占据的栅格数
          >
            <HouseSelect
              inventoryHouseId={inventoryInHouseIds}
              onChange={(value) => {
                form.setFieldsValue({inventoryInHouseId: value[0]});
                setInventoryInHouseIds(value);
              }}
            />
          </Form.Item>
          <ProFormText
            width={200}
            label="存放位置"
            name="inventoryInStorageLocation"
            labelCol={{span: 7}} // 设置标签占据的栅格数
            wrapperCol={{span: 17}} // 设置输入控件占据的栅格数
          />
          <ProFormTextArea
            width={250}
            label="备注"
            name="remark"
            labelCol={{span: 7}} // 设置标签占据的栅格数
            wrapperCol={{span: 17}} // 设置输入控件占据的栅格数
          />

      </div>


      <div>物资明细</div>

      <EditableProTable
        rowKey="goodId"
        search={false}
        controlled={true}
        scroll={{x: 1500,}}
        value={inventoryInGoods}
        rowSelection={
          props.inventoryInMethod === InventoryInMethod.inSecondary ? rowSelection : false
        }
        onChange={setInventoryInGoods}
        recordCreatorProps={false}
        headerTitle={
          props.inventoryInMethod === InventoryInMethod.inSecondary ? <div>
            <Button onClick={() => {
              setOpenSelectGoods(true)
            }} type="primary"
                    icon={<PlusOutlined/>}
                    style={{marginRight: 8}}>
              选择物资
            </Button>
            <Button onClick={remove}
                    type="primary"
                    style={{marginRight: 8, backgroundColor: 'red', borderColor: 'red'}}
                    icon={<DeleteOutlined/>}
            >
              删除物资
            </Button>
          </div> : null
        }
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
        }}
        pagination={false}
        columns={columns}
      />
      {/*<ImportButton></ImportButton>*/}
    </Form>
    {openSelectPurchase && <SelectPurchase
      cancel={() => {
        setOpenSelectPurchase(false);
      }}
      inventoryInMethod={props.inventoryInMethod}
      open={openSelectPurchase}
      close={
        (purchase)=>{
          let addDto: InventoryInAddDto = {
            goods: [],
            totalPriceAfterTax: 0,
            totalPriceBeforeTax: 0,
            supplierName:purchase[0].supplierName,
            supplierId:purchase[0].supplierId,
            inventoryInHouseId:purchase[0].inventoryInHouseId,
            inventoryInHouseName:purchase[0].inventoryInHouseName,
            inventoryPurchaseId:purchase[0].id,
            inventoryPurchaseCode:purchase[0].code,
          };
          setPurchase(purchase);
          setInventoryInAddDto(addDto);
          setInventoryInHouseIds([addDto.inventoryInHouseId!]);
          fetchGoods(purchase[0].id);
          setOpenSelectPurchase(false);
        }
      }
      purchase={purchase}
    />}
    {
      openSelectEngineering&&<SelectEngineering
        open={
          openSelectEngineering
      } close={
        (engineering)=>{
          let addDto: InventoryInAddDto = {
            engineeringId:engineering[0].id,
            engineeringName:engineering[0].name,
            goods:[]
            // inventoryInHouseId:engineering[0].
          };
          setEngineeringItems(engineering);
          setInventoryInAddDto(addDto);
          setOpenSelectEngineering(false)
        }
      } engineering={
        engineeringItems
      } cancel={
        ()=>{
          setOpenSelectEngineering(false)
        }
      }>

      </SelectEngineering>
    }
    {openSelectGoods&&<GoodSelect
      open={true}
      cancel={
        () =>{
          setOpenSelectGoods(false);
        }
      }
      close={
        (goods)=>{
          const inGoods = goods.map(goodMapToInventoryInGood);
          setInventoryInGoods(inGoods);
          setOpenSelectGoods(false)
          setEditableRowKeys(inGoods.map((g) => g.goodId))
        }
      }
      goodIds={inventoryInGoods.map((g) => g.goodId)}
    ></GoodSelect>}
  </PageContainer>;
};

export default InventoryInSavePage;
