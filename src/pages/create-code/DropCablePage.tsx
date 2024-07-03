import React from "react";
import {CodeCreateDto} from "@/pages/create-code/codeType";
import CommonCodeCreate from "@/pages/create-code/CommonCodeCreate";

const DropCablePage:React.FC = () => {
  const codes: CodeCreateDto[] = [
    { name: '30(meter)', preCode: '6030', codeLength: 10, amount: undefined },
    { name: '50(meter)', preCode: '6050', codeLength: 10, amount: undefined },
    { name: '150(meter)', preCode: '6150', codeLength: 10, amount: undefined },
    { name: '200(meter)', preCode: '6200', codeLength: 10, amount: undefined },
    { name: '250(meter)', preCode: '6250', codeLength: 10, amount: undefined },
    { name: '400(meter)', preCode: '6400', codeLength: 10, amount: undefined },
    { name: '500(meter)', preCode: '6500', codeLength: 10, amount: undefined },
  ];
    return <CommonCodeCreate codes={codes}/>
}

export default DropCablePage;
