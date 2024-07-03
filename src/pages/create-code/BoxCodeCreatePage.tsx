import React from "react";
import {CodeCreateDto} from "@/pages/create-code/codeType";
import CommonCodeCreate from "@/pages/create-code/CommonCodeCreate";

const BoxCodeCreatePage: React.FC = () => {

  const codes: CodeCreateDto[] = [
    { name: 'Hub Box(1:8)', preCode: 'HB08', codeLength: 9, amount: undefined },
    { name: 'Hub Box(1:16)', preCode: 'HB16', codeLength: 9, amount: undefined },
    { name: 'Sub Box(30%:70%)1:9', preCode: 'SB08', codeLength: 9, amount: undefined },
    { name: 'End Box(1:8)', preCode: 'EB08', codeLength: 9, amount: undefined },
    { name: 'End Box(1:16)', preCode: 'EB16', codeLength: 9, amount: undefined },
  ];

  return <CommonCodeCreate codes={codes}></CommonCodeCreate>;
};


export default BoxCodeCreatePage
