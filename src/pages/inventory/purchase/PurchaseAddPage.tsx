import {
  EditableProTable,
  type ProColumns,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components';
import { Button, Col, Form, Row } from 'antd';
import React, {useEffect, useState} from 'react';
import WorkflowInstanceDetail, {WorkflowInstanceDetailProps} from "@/pages/workflow/instance/WorkflowInstanceDetail";
import {PlusOutlined,DeleteOutlined} from "@ant-design/icons";
import GoodSelect from "@/pages/inventory/good/GoodSelect";
import {Good} from "@/pages/inventory/good/type";

const PurchaseAddPage: React.FC<WorkflowInstanceDetailProps> = (props) => {
  const [openSelectGoods, setOpenSelectGoods] = useState<boolean>(false);
  const [selectGoods, setSelectGoods] = useState<readonly Good[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(
    []
  );
  const [selectedInGood, setSelectedInGood] = useState<Good[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const remove = ()=>{
    const filteredArray = selectGoods.filter(
      good => selectedInGood.some(good2 => good.id !== good2.id)
    );
    setSelectGoods(filteredArray);
  }

  const columns:ProColumns<Good>[] = [
    {
      title: '序号',
      dataIndex: 'name',
      valueType: 'textarea',
      editable:false,
      search: false,
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
      editable:false
    },
    {
      title: '编码',
      dataIndex: 'code',
      valueType: 'textarea',
      search: false,
      editable:false
    },
    {
      title: '单位',
      dataIndex: 'typeCode',
      ellipsis: true,
      width: 80,
      editable:false
    },
    {
      title: '数量',
      dataIndex: 'contactPersonName',
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
      editable:false
    },
  ];
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectRowKeys: React.Key[], selectedRows: Good[]) => {
      setSelectedInGood(selectedRows);
      setSelectedRowKeys(selectRowKeys);
    },
    alwaysShowAlert: true,
  };
  let baseInfo = (
    <Form>
      <Row>
        <Col span={12}>
          <ProFormText
            label="关联的工程"
            name="name"
            labelCol={{ span: 4 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 20 }} // 设置输入控件占据的栅格数
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label="部门"
            name="deparent"
            labelCol={{ span: 4 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 20 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormText
            label="关联的工程"
            name="name"
            labelCol={{ span: 4 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 20 }} // 设置输入控件占据的栅格数
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label="部门"
            name="deparent"
            labelCol={{ span: 4 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 20 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ProFormTextArea
            label="备注"
            name="remark"
            labelCol={{ span: 2 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 22 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>
      <div>物资明细</div>
      <EditableProTable
        rowKey="id"
        search={false}
        controlled={true}
        value={selectGoods}
        rowSelection={
          rowSelection
        }
        onChange={setSelectGoods}
        headerTitle={
          <div>
            <Button onClick={() => {

              setOpenSelectGoods(true)
            }} type="primary"
                    icon={<PlusOutlined />}
                    style={{marginRight: 8}}>
              选择物资
            </Button>
            <Button onClick={remove}
                    type="primary"
                    style={{marginRight: 8 ,backgroundColor: 'red', borderColor: 'red'}}
                    icon={<DeleteOutlined />}
            >
              删除物资
            </Button>
          </div>

        }
        recordCreatorProps={false}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
        }}
        pagination={false}
        columns={columns}
      />
    </Form>
  );

  useEffect(() => {


  }, []);

  return <>

    <WorkflowInstanceDetail {...props} >{
      baseInfo

    }</WorkflowInstanceDetail>

    {openSelectGoods&&<GoodSelect
      open={true}
      cancel={
        () =>{
          setOpenSelectGoods(false);
        }
      }
      close={
        (goods)=>{
          setSelectGoods(goods);
          setOpenSelectGoods(false)
          setEditableRowKeys(goods.map((g) => g.id))
        }
      }
      goodIds={selectGoods.map((g) => g.id)}
    ></GoodSelect>}
  </>;
};

export default PurchaseAddPage;
