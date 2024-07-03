import React from "react";
import * as XLSX from "xlsx";
import {Button} from "antd";
import {ExportOutlined } from "@ant-design/icons";

export type CellValue<T> = (row: T) => any;

interface ExportButtonProps<T> {
  fileName: string;
  headers: { [key: string]: CellValue<T> }; // key 是 excel 表头，value 是获取属性的方法
  fetchData: () => Promise<{ [sheetName: string]: T[] }>; // 定义获取数据的函数，数据包含多个表格
  buttonName: string;
}

const ExportButton = <T,>({ fetchData, fileName, headers, buttonName, }: ExportButtonProps<T>) => {
  const generateExcel = (data: { [sheetName: string]: T[] }) => {
    const wb = XLSX.utils.book_new();

    for (const sheetName in data) {
      if (data.hasOwnProperty(sheetName)) {
        const sheetData = data[sheetName];
        if (sheetData.length === 0) continue;

        const sheet = XLSX.utils.json_to_sheet([]);

        // 添加表头
        const headerRow = Object.keys(headers);
        XLSX.utils.sheet_add_aoa(sheet, [headerRow.map(header => header)]);

        // 添加数据行
        sheetData.forEach((row) => {
          const rowData = headerRow.map((header) => headers[header](row));
          XLSX.utils.sheet_add_aoa(sheet, [rowData], { origin: -1 });
        });

        // 将表格添加到工作簿
        XLSX.utils.book_append_sheet(wb, sheet, sheetName);
      }
    }

    // 生成并下载 Excel 文件
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const handleButtonClick = async () => {
    try {
      const data = await fetchData();
      generateExcel(data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  return (
    <Button type="primary" onClick={handleButtonClick} style={{marginRight: 8}}>
      <ExportOutlined />
      {buttonName}
    </Button>
  );
};

export default ExportButton;
