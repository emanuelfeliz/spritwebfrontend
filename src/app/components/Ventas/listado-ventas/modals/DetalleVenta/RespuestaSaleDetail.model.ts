import { ComprobanteDataModel, ComprobanteDataModelFacturacion } from "app/models/listado-ventas/ComprobanteDataModel.model";

export class RespuestaSaleDetail{
    public constructor(
        public comprobanteDataModel:ComprobanteDataModel,
        public respuesta:string,
        public automaticResponse:boolean = false
    ){}
}

export class RespuestaSaleDetailFacturacion{
    public constructor(
        public comprobanteDataModel:ComprobanteDataModelFacturacion,
        public respuesta:string,
        public automaticResponse:boolean = false
    ){}
}
