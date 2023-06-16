import { Pago } from "./Pago.model";
import { Venta } from "../listado-ventas/venta.model";
import { VentaFabricada } from "../listado-ventas/VentaFabricada.model";

export class PagoWithSaleDetails extends Pago{
public constructor (
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
  public Turno:number,
  public lado:number,
  public Manguera:number,
  public Producto: string,
  public Precio: number
){
  super(id,cliente,rnc,venta_sistema,metodo_pago,dato_otro,tipo_otro,bombero,venta_fabricada,tarjeta,placa,money,cuadre_id)
}
}
