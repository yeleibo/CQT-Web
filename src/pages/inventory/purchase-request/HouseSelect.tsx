import React, {useEffect, useState} from "react";

import {Select} from "antd";
import {InventoryHouseListDto} from "@/pages/inventory/house/type";
import InventoryHouseService from "@/pages/inventory/house/InventoryHouseService";

interface HouseSelectProps {
  onChange?: (value: number[]) => void;
  inventoryHouseId?: number[];
  mode?: 'multiple' | 'tags';
}

const HouseSelect: React.FC<HouseSelectProps> = (props) => {
  const [houseData, setHouseData] = useState<InventoryHouseListDto[]>([]);
  useEffect(() => {

    InventoryHouseService.getAllInventoryHouse().then((data) => {

      setHouseData(data)
    });
  }, []);
  const handleSelectChange = (selectedValues: number[]) => {
    if (props.onChange) {
      props.onChange(selectedValues);
    }
  };


  return <Select

    showSearch
    mode={props.mode}
    style={{ width: '100%' }}
    // onSearch={handleSearch}
    filterOption={(input,option)=>{
      return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    }}
    value={props.inventoryHouseId}
    onChange={handleSelectChange}
    options={
      houseData.map((type,) => ({
        value: type.id, // 使用索引作为 value
        label: type.name,
      }))
    }
  />;
}

export default HouseSelect;
