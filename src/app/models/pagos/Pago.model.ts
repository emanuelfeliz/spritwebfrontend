import { Venta } from "app/models/listado-ventas/venta.model";
import { VentaFabricada } from "app/models/listado-ventas/VentaFabricada.model";

export class Pago{
  public constructor(
    public id:string,
    public cliente:string,
    public rnc:string,
    public venta_sistema:Venta,
    public metodo_pago:string,
    public dato_otro:string,
    public tipo_otro:string,
    public bombero:string,
    public venta_fabricada:VentaFabricada,
    public tarjeta:string,
    public placa:string,
    public money:number,
    public cuadre_id:string,
    public discountAmount: number = 0,
    public VerifoneType: string = '',
    public productPrice = 0,
    public productVolume= 0,
    public instantDiscount = false
  ){}
}

export interface Verifone{
  Id: number;
  VerifoneType: string;
}

export interface PaymentInfo {
  cardNumber:string;
  cardAmount:number;
  VerifoneType:string;
}
