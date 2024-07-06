
export type  DataVisualizationModel = {
  ///资源统计模型
  resourceStaticModelList:ResourceStaticModel[];
  engineeringStaticsByOrganize:EngineeringStaticsByOrganize[];
  engineeringList:EngineeringModel[];
  mapInfoModel:MapInfoModel;
}

export type  ResourceStaticModel = {
  name:string;
  totalAmount:number;
  unitName:string;
  item:ResourceStaticItemModel[];
}

export type  ResourceStaticItemModel = {
  name:string;
  amount:number;
  percent:number;
}

///工程区域统计模型
export type  EngineeringStaticsByOrganize = {
  organizeName:string;
  totalAmount:number;
  finishedAmount:number;
}

///工程统计模型
export type  EngineeringModel = {
  organizeName:string;
  percentCompleted:number;
}


export type  MapInfoModel = {
  dataCenterPoints:[];
  fiberLines:[];
}
