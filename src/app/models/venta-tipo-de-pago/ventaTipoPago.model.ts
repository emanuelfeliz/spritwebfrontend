import { Denominaciones } from "app/models/cuadres/denominaciones.model";
import { CampoDinamico } from "app/models/cuadres/campo-dinamico.model";
import { CuadreValidaciones } from "app/models/cuadres/cuadreValidaciones.model";
import { Sale } from "app/models/ventas/sale.model";
import { Pago } from "app/models/pagos/Pago.model";
import { Deposito } from "app/models/depositos/Deposito.model";
import { Cuadre } from "../cuadres/cuadre.model";

export class VentaTipoPago extends Cuadre{
     public constructor(
      public cuadre_validado:boolean,
      public id:string,
      public LadosByBombero: Array<string>,
      public Lados: string,
      public turno: number,
      public venta_combustible: number,
      public volumen_combustible: number,
      public total_vendido: number,
      public denominaciones: Array<Denominaciones>,
      public total_efectivo: number,
      public total_tarjeta: number,
      public total_efectivo_registrado: number,
      public venta_facturacion: number,
      public comentario:string,
      public id_bombero:number,
      public bombero:string,
      public sales_id:Array<string>,
      public campos_dinamicos:Array<CampoDinamico>,
      public fecha:string,
      public denominaciones_admin: Array<Denominaciones>,
      public total_efectivo_registrado_admin:number,
      public ventas:Array<Sale>,
      public pagos:Array<Pago>,
      public total_otros:number,
      public total_efectivo_neto:number,
      public volumen_combustible_neto:number,
      public volumen_dinamicos:number,
      public monto_dinamicos:number,
      public depositos:Array<Deposito>,
      public total_depositos:number,
      public diferencia:number,
      public TotalEfectivoRNC: string,
      public TotalTarjetaRNC: string
    ) {
        super(
         cuadre_validado,
         id,
         LadosByBombero ,
         Lados,
         turno ,
         venta_combustible ,
         volumen_combustible ,
         total_vendido ,
         denominaciones ,
         total_efectivo ,
         total_tarjeta ,
         total_efectivo_registrado ,
         venta_facturacion ,
         comentario,
         id_bombero,
         bombero,
         sales_id,
         campos_dinamicos,
         fecha,
         denominaciones_admin ,
         total_efectivo_registrado_admin,
         ventas,
         pagos,
         total_otros,
         total_efectivo_neto,
         volumen_combustible_neto,
         volumen_dinamicos,
         monto_dinamicos,
         depositos,
         total_depositos,
         diferencia
        );
     }
}
