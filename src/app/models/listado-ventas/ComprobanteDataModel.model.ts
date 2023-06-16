import { Venta } from './venta.model';
import { Producto } from '../productos/producto.model';
import { SaleDetail } from '../ventas/sale_detail.model';
import { PaymentInfo } from '../pagos/Pago.model';
export class ComprobanteDataModel {
  public venta: Venta;
  public cliente: string;
  public rnc: string;
  public tarjeta: string;
  public placa: string;
  public codigo_ncf: string;
  public metodo_pago: string;
  public bombero: string;
  public tipo_otro: string;
  public dato_otro: string;
  public letraPlaca = '';
  public numeroPlaca = '';
  public company_name = '';
  public instantDiscount: boolean = false;
  public paymentsInfo: PaymentInfo[] = [];
  public tarjetaTemp: string = "";

  public constructor(cliente: string, rnc: string, tarjeta: string, placa: string, codigo_ncf: string,
    metodo_pago: string, bombero: string, tipo_otro: string, dato_otro: string, company_name?: string, paymentsInfo?: PaymentInfo[]) {
    this.venta = null;
    this.cliente = '';
    this.rnc = rnc;
    this.tarjeta = tarjeta;
    this.placa = placa;
    this.codigo_ncf = codigo_ncf;
    this.metodo_pago = metodo_pago;
    this.bombero = bombero;
    this.tipo_otro = tipo_otro;
    this.dato_otro = dato_otro;
    this.company_name = company_name;
    this.paymentsInfo = paymentsInfo;
  }
}

export interface ComprobanteDataModelFacturacion {
  rnc: string;
  tarjeta: string;
  placa: string;
  cliente: string;
  codigo_ncf: string;
  metodo_pago: string;
  bombero: string;
  tipo_otro: string;
  dato_otro: string;
  letraPlaca: string;
  numeroPlaca: string;
  productos: SaleDetail[];
  total: number;
  itbis: number;
}

