import React, {useEffect, useState} from "react";
import { Select} from "antd";
import SupplierService from "@/pages/inventory/supplier/SupplierService";
import {SupplierItem, SupplierParams} from "@/pages/inventory/supplier/typings";
import {getStatusLabel, InventoryPurchaseRequestStatus} from "@/pages/inventory/purchase-request/type";

interface SupplierSelectProps {
  onChange?: (value: string[]) => void;
}

interface StatusSelectProps {
  onChange?: (value: string[]) => void;
}

const SupplierSelect: React.FC<SupplierSelectProps> = ({ onChange }) => {
  const [supplierData, setSupplierData] = useState<SupplierItem[]>([]);
  useEffect(() => {
    const query:SupplierParams = {
    };
    SupplierService.list(query).then((data) => {

      setSupplierData(data)
    });
  }, []);
  const handleSelectChange = (selectedValues: string[]) => {
    if (onChange) {
      onChange(selectedValues);
    }
  };


  return <Select
    showSearch
    mode="multiple"
    style={{ width: '100%' }}
    // onSearch={handleSearch}
    filterOption={(input,option)=>{
     return (option?.code ?? '').toLowerCase().includes(input.toLowerCase()) ||  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    }}
    onChange={handleSelectChange}
    options={
      supplierData.map((type,) => ({
        value: type.id, // 使用索引作为 value
        label: type.name,
        code: type.code,
      }))
    }
  />;
}

 const StatusSelect: React.FC<StatusSelectProps> = ({onChange})=>{
  const statusOptions = [
    InventoryPurchaseRequestStatus.auditing,
    InventoryPurchaseRequestStatus.unPurchased,
    InventoryPurchaseRequestStatus.purchasing,
    InventoryPurchaseRequestStatus.purchased,
  ];
   const handleSelectChange = (selectedValues: string[]) => {
     if (onChange) {
       onChange(selectedValues);
     }
   };
   return <Select
     style={{ width: '100%' }}
     onChange={handleSelectChange}
     mode="multiple"
     options={
       statusOptions.map(status => ({
         value:status,
         label: getStatusLabel(status),
       }))
     }
   />
}

export  {SupplierSelect, StatusSelect};
