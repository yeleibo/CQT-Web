export type CodeCreateDto = {
   name: string;
   preCode:string;
  codeLength:number;
  amount?:number;
}

export type CodeCreateDto1 = {
  dto:CodeCreateDto[];
}

export type CodeCreateResultDto = {
  preCode:string;
  codes:string[];
}
