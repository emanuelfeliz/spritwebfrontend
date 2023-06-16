import { Denominaciones } from "app/models/cuadres/denominaciones.model";
import { CampoDinamico } from "app/models/cuadres/campo-dinamico.model";
import { CuadreValidaciones } from "app/models/cuadres/cuadreValidaciones.model";
import { Sale } from "app/models/ventas/sale.model";
import { Pago } from "app/models/pagos/Pago.model";
import { Deposito } from "app/models/depositos/Deposito.model";

export class Cuadre extends CuadreValidaciones {
  public constructor(
    public cuadre_validado: boolean,
    public id: string,
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
    public comentario: string,
    public id_bombero: number,
    public bombero: string,
    public sales_id: Array<string>,
    public campos_dinamicos: Array<CampoDinamico>,
    public fecha: string,
    public denominaciones_admin: Array<Denominaciones>,
    public total_efectivo_registrado_admin: number,
    public ventas: Array<Sale>,
    public pagos: Array<Pago>,
    public total_otros: number,
    public total_efectivo_neto: number,
    public volumen_combustible_neto: number,
    public volumen_dinamicos: number,
    public monto_dinamicos: number,
    public depositos: Array<Deposito>,
    public diferencia: number,
    public total_depositos:number,
    public totalDescuentos: number = 0,
    public CanEditTally: boolean = false,
    public total_descuento: number = 0,
    public DollarAmount: number = 0.0,
    public EuroAmount: number = 0.0,
    public DollarRate: number = 0.0,
    public EuroRate: number = 0.0,
  ) {
    super(denominaciones_admin, total_efectivo_registrado_admin);
  }
}
