import { BomberoAutenticado } from "app/models/bomberos/BomberoAutenticado.model";
import { ComprobanteDataModel } from "app/models/listado-ventas/ComprobanteDataModel.model";

export class ValidacionManipulacionVentas{
  bombero:BomberoAutenticado;
  comprobante:ComprobanteDataModel;
  public constructor(
    bombero:BomberoAutenticado,
    comprobante:ComprobanteDataModel
  ){
    this.bombero=bombero;
    this.comprobante=comprobante;
  }
}