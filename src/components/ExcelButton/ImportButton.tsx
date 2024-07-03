import React, { useState } from 'react';
import { Button } from 'antd';
import * as XLSX from 'xlsx';

interface IJsonData {
  item: string;
  code: string;
  unit: string;
  category: string;
  preTaxPrice: number;
  postTaxPrice: number;
}

//从excel导入物资
const ImportButton: React.FC = () => {
  const [jsonData, setJsonData] = useState<IJsonData[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows: unknown[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const json: IJsonData[] = (rows as any[])
        .slice(1) // Skip the header row
        .map((row: any) => ({
          item: row[0],
          code: row[1],
          unit: row[2],
          category: row[3],
          preTaxPrice: parseFloat(row[4]),
          postTaxPrice: parseFloat(row[5]),
        }));
      setJsonData(json);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleClick = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  };

  return (
    <div className="App">
        <Button type="primary" onClick={handleClick}>
          Choose Excel File
        </Button>
        <input
          type="file"
          id="fileInput"
          accept=".xlsx, .xls"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <pre>{JSON.stringify(jsonData, null, 2)}</pre>

    </div>
  );
}

export default ImportButton;

