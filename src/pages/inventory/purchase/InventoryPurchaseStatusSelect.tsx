import React from "react";
import {Select} from "antd";
import {InventoryPurchaseStatus,getStatusLabel} from "@/pages/inventory/purchase/type"

interface StatusSelectProps {
  onChange?: (value: string[]) => void;
}

const InventoryPurchaseStatusSelect:React.FC<StatusSelectProps> = ({onChange})=>{
  const statusOptions = [
    InventoryPurchaseStatus.unStart,
    InventoryPurchaseStatus.auditing,
    InventoryPurchaseStatus.finished,
    InventoryPurchaseStatus.scraped,
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

export default InventoryPurchaseStatusSelect
