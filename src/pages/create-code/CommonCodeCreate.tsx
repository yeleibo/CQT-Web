import React, {useEffect} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Form,Input} from "antd";
import {CodeCreateDto} from "@/pages/create-code/codeType";
import CodeService from "@/pages/create-code/CodeService";
import * as XLSX from 'xlsx';

interface Props {
  codes: CodeCreateDto[]
}

const CommonCodeCreate: React.FC<Props> = (props) => {
  const [form] = Form.useForm();


  useEffect(() => {
    form.setFieldsValue(
      props.codes.reduce((acc, code, index) => {
        acc[`amount_${index}`] = code.amount;
        return acc;
      }, {} as any)
    );
  }, [form, props.codes]);


  const handle = async () => {
    const values = form.getFieldsValue();
    const updatedCodes = props.codes.map((code, index) => ({
      ...code,
      amount: values[`amount_${index}`],
    }));

    let result = await CodeService.createCodes({dto:updatedCodes});

    const workbook = XLSX.utils.book_new();

    result.forEach((item) => {
      const worksheet = XLSX.utils.aoa_to_sheet(item.codes.map((code) => [code]));
      XLSX.utils.book_append_sheet(workbook, worksheet, item.preCode);
    });

    XLSX.writeFile(workbook, 'codes.xlsx');
  };

  return (
    <PageContainer
      style={{ backgroundColor: '#fff', margin: '0px 20px 0px 20px' }}
      breadcrumbRender={false}
      onBack={() => {}}
      header={{
        title: 'Create Code',
        extra: [
          <Button key="export" type="primary" onClick={handle}>
            Export
          </Button>,
        ],
      }}
    >
      <Form form={form}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            rowGap: '20px',
            columnGap: '120px',
            marginTop: '30px',
            marginBottom: '20px',
          }}
        >
          {props.codes.map((code, index) => (
            <Form.Item
              style={{ width: '280px' }}
              key={index}
              label={code.name}
              name={`amount_${index}`}
              rules={[{ required: true, message: `${code.name} is required` }]}
            >
              <Input />
            </Form.Item>
          ))}
        </div>
      </Form>
    </PageContainer>
  );
};


export default CommonCodeCreate
