import CodeService from '@/pages/create-code/CodeService';
import { CodeDetailDto, CodeOrder } from '@/pages/create-code/codeType';
import ISPService from '@/pages/isp/ISPService';
import { ISP, ISPParams } from '@/pages/isp/type';
import { useIntl } from '@@/plugin-locale';
import {
  ModalForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React, { useEffect, useState } from 'react';

interface CodeOrderProps {
  open: boolean;
  close: () => void;
  reload: () => void;
  codeOrderData?: CodeOrder;
  model: string;
}

const CodeOrderDetailPage: React.FC<CodeOrderProps> = (props) => {
  const { codeOrderData, open, close } = props;
  const [form] = Form.useForm<CodeOrder>();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  const codeConfigs: { [key: string]: CodeDetailDto[] } = {
    MPO方案: [
      {
        codePre: 'XBA04',
        amount: 0,
      },
      {
        codePre: 'HBA10',
        amount: 0,
      },
      {
        codePre: 'FBA10/FNA09',
        amount: 0,
      },
    ],
    单芯方案: [
      {
        codePre: 'HBB09',
        amount: 0,
      },
      {
        codePre: 'FBA10/(FNA09/FNB17)',
        amount: 0,
      },
    ],
    掏纤方案: [
      {
        codePre: '(HBCO2/HBCO4/HBC08)\n' + '(HBD04/HBD08)',
        amount: 0,
      },
      {
        codePre: '(FBA10/FBB18)/(FNA09/FNB17)',
        amount: 0,
      },
    ],
  };

  const handleSave = async () => {
    const formData = await form.validateFields();
    if (formData) {
      // if (formData.id === undefined) {
      //   delete formData.id;
      // }
      const extraFormData = { ...props.codeOrderData, ...formData };
      setLoading(true);
      try {
        if (props.model === intl.formatMessage({ id: 'add' })) {
          const res: any = await CodeService.codeOrderAdd(extraFormData).catch(() => {
            setLoading(false);
          });
          setLoading(false);

          message.success(intl.formatMessage({ id: 'addSuccessful' }));
          if (props.reload) {
            props.reload();
          }
          props.close();
          form.resetFields();
          if ((window as any).onTabSaveSuccess) {
            (window as any).onTabSaveSuccess(res);
            setTimeout(() => window.close(), 300);
          }
        } else {
          const res = await CodeService.updateCode(extraFormData);
          setLoading(false);
          form.resetFields();
          message.success(intl.formatMessage({ id: 'modifySuccessful' }));
          if (props.reload) {
            props.reload();
          }
          props.close();
          if ((window as any).onTabSaveSuccess) {
            (window as any).onTabSaveSuccess(res);
            setTimeout(() => window.close(), 300);
          }
        }
      } catch (ex) {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (open) {
      // 初始化
      form.setFieldsValue({ ...codeOrderData, codes: codeConfigs['MPO方案'] });
    }
  }, [open]);
  return (
    <ModalForm
      loading={loading}
      layout="vertical"
      form={form}
      title={
        props.model === intl.formatMessage({ id: 'add' })
          ? intl.formatMessage({ id: 'add' })
          : intl.formatMessage({ id: 'edit' })
      }
      open={open}
      onOpenChange={(open) => {
        form.resetFields();
        if (!open) {
          close();
        }
      }}
      onFinish={handleSave}
    >
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
        <ProFormSelect
          style={{ width: 300 }}
          name="ispId"
          label={intl.formatMessage({ id: 'isp' })}
          rules={[{ required: true, message: `${intl.formatMessage({ id: 'ispRequired' })}` }]}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          mode="single"
          request={async () => {
            let params: ISPParams = {
              pageSize: 10000000,
            };
            const response = await ISPService.list(params);
            let allIsp: ISP[] = response['data'];
            return allIsp.map((isp) => ({
              label: isp.name,
              value: isp.id,
            }));
          }}
        />

        <ProFormText
          width={300}
          label={intl.formatMessage({ id: 'saleOrderNumber' })}
          name="saleOrderNumber"
          labelCol={{ span: 12 }} // 设置标签占据的栅格数
          wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
        />

        <ProFormText
          width={300}
          label={intl.formatMessage({ id: 'salesperson' })}
          name="salesperson"
          labelCol={{ span: 6 }} // 设置标签占据的栅格数
          wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
        />

        <ProFormText
          width={300}
          label={intl.formatMessage({ id: 'customerContact' })}
          name="customerContact"
          labelCol={{ span: 9 }} // 设置标签占据的栅格数
          wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
        />

        {props.model === intl.formatMessage({ id: 'add' }) && (
          <ProFormSelect
            width={300}
            name="configPlan"
            label={intl.formatMessage({ id: 'configuration' })}
            request={async () => [
              { label: 'MPO方案', value: 'MPO方案' },
              { label: '单芯方案', value: '单芯方案' },
              { label: '掏纤方案', value: '掏纤方案' },
            ]}
          />
        )}

        <ProFormSelect
          width={300}
          name="isRandom"
          label={intl.formatMessage({ id: 'isRandom' })}
          request={async () => [
            { label: intl.formatMessage({ id: 'yes' }), value: true },
            { label: intl.formatMessage({ id: 'no' }), value: false },
          ]}
        />

        <ProFormText
          width={300}
          label={intl.formatMessage({ id: 'remark' })}
          name="remark"
          labelCol={{ span: 6 }} // 设置标签占据的栅格数
          wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
        />
        {props.model === intl.formatMessage({ id: 'add' }) && (
          <ProFormDependency name={['configPlan']}>
            {({ configPlan }) =>
              configPlan !== undefined &&
              (codeConfigs[configPlan] || []).map((item, index) => (
                <ProFormText
                  width={300}
                  key={index}
                  label={item.codePre}
                  name={['codes', index, 'amount']}
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 18 }}
                />
              ))
            }
          </ProFormDependency>
        )}
      </div>
    </ModalForm>
  );
};

export default CodeOrderDetailPage;
