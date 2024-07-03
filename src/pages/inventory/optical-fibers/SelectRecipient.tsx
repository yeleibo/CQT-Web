import React, {useEffect, useState} from "react";
import {Select} from "antd";
import OpticalFibersService from "@/pages/inventory/optical-fibers/OpticalFibersService";

const SelectRecipient: React.FC = () => {
  const [supplierData, setSupplierData] = useState<string[]>([]);
  useEffect(() => {

    OpticalFibersService.getRecipients().then((data) => {

      setSupplierData(data)
    });
  }, []);

  return <Select
    showSearch
    mode="multiple"
    style={{ width: '100%' }}
    // onSearch={handleSearch}
    filterOption={(input,option)=>{
      return (option?.value ?? '').toLowerCase().includes(input.toLowerCase()) ||
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    }}
    options={
      supplierData.map((type,) => ({
        value: type, // 使用索引作为 value
        label: type,
      }))
    }
  />;
}

export default SelectRecipient
