import React from "react";
import {CodeCreateDto} from "@/pages/create-code/codeType";

import CommonCodeCreate from "@/pages/create-code/CommonCodeCreate";

const CascadeCodePage: React.FC = () => {
  const codes: CodeCreateDto[] = [
    { name: '30(meter)', preCode: '9030', codeLength: 10, amount: undefined },
    { name: '50(meter)', preCode: '9050', codeLength: 10, amount: undefined },
    { name: '150(meter)', preCode: '9150', codeLength: 10, amount: undefined },
    { name: '200(meter)', preCode: '9200', codeLength: 10, amount: undefined },
    { name: '250(meter)', preCode: '6250', codeLength: 10, amount: undefined },
    { name: '400(meter)', preCode: '9400', codeLength: 10, amount: undefined },
    { name: '500(meter)', preCode: '9500', codeLength: 10, amount: undefined },
  ];


   return <CommonCodeCreate codes={codes}/>
}

export default CascadeCodePage
