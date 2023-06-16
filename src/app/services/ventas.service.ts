import { Injectable } from '@angular/core';
import { ComprobanteDataModel, ComprobanteDataModelFacturacion } from '../models/listado-ventas/ComprobanteDataModel.model';
import { ValidacionManipulacionVentas } from 'app/models/listado-ventas/ValidacionManipulacionVentas.model';
import { Pago, Verifone } from 'app/models/pagos/Pago.model';
import { InvocationService } from 'app/services/invocationService.service';
import { ModelList } from 'app/models/ModelList.model';
import { Venta } from 'app/models/listado-ventas/venta.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { BomberoByLado } from '../models/manipulacion-venta/BomberoByLado.model';
import { PaymentSale } from '../models/manipulacion-venta/PaymentSale.model';
import { InvoiceDataStructure } from '../models/manipulacion-venta/InvoiceDataStructure.model';
import { environment } from 'environments/environment';
@Injectable()
export class VentasService {
  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  GenerateInvoice = (invoiceDataStructure: InvoiceDataStructure): Promise<GenericResponse<string>> => {
    const route = `${this.url}api/ListadoVentas/GenerateInvoice`;
    return this.invocationService.
      invokeBackendService<GenericResponse<string>, InvoiceDataStructure>(this.invocationService.POST, route, invoiceDataStructure);
  }
  pagarVentaAndroid = (paymentSale: PaymentSale): Promise<GenericResponse<string>> => {
    const route = `${this.url}api/ListadoVentas/pagarVentaAndroid`;
    return this.invocationService.
      invokeBackendService<GenericResponse<string>, PaymentSale>(this.invocationService.POST, route, paymentSale);
  }

  pagarVentaWeb = (paymentSale: PaymentSale): Promise<GenericResponse<string>> => {
    const route = `${this.url}api/ListadoVentas/pagarVentaWeb`;
    return this.invocationService.
      invokeBackendService<GenericResponse<string>, PaymentSale>(this.invocationService.POST, route, paymentSale);
  }
  
  LoadSalesByPump = (pump: number, limit: number = 5): Promise<ModelList<Venta>> => {
    const route = `${this.url}api/ListadoVentas/LoadSalesByPump?Pump=${pump}&Limit=${limit}&isRequestFromAndroid=${false}`;
    return this.invocationService.invokeBackendService<ModelList<Venta>, null>(this.invocationService.GET, route);
  }
  CanManipulatePump = (data: BomberoByLado): Promise<GenericResponse<string>> => {
    const route = `${this.url}api/ListadoVentas/CanManipulatePump`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, BomberoByLado>(this.invocationService.POST, route, data);
  }
  getVentas = (Pump: number, Nozzle: number, Limit: number): Promise<ModelList<Venta>> => {
    const route = `api/ListadoVentas/GetListadoVentas?Pump=${Pump}&Nozzle=${Nozzle}&Limit=${Limit}`;
    return this.invocationService.invokeBackendService<ModelList<Venta>, null>(this.invocationService.GET, this.url + route);
  }
  getClientByRnc = (Rnc: string): Promise<GenericResponse<string>> => {
    const route = `api/ListadoVentas/GetClientByRnc?rnc=${Rnc}`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, null>(this.invocationService.GET, this.url + route);
  }
  getPagos = (fDesde: string, fHasta: string, campoDesde: number, campoHasta: number,
    bombero: string, metodoPago: string, tarjeta: string, placa: string,
    limite: number, pagina: number): Promise<ModelList<Pago>> => {
    let route = `api/ListadoVentas/getPagos?fDesde=${fDesde}&fHasta=${fHasta}`;
    route += `&campoDesde=${campoDesde}&campoHasta=${campoHasta}&bombero=${bombero}&metodoPago=${metodoPago}`;
    route += `&tarjeta=${tarjeta}&placa=${placa}`;
    route += `&limite=${limite}&pagina=${pagina}`;
    return this.invocationService.invokeBackendService<ModelList<Pago>, null>(this.invocationService.GET, this.url + route);
  }
  exportPaymentsToExcel = (fDesde: string, fHasta: string, campoDesde: number, campoHasta: number,
    bombero: string, metodoPago: string, tarjeta: string, placa: string,
    limite: number, pagina: number): Promise<string> => {
    let route = `api/ListadoVentas/ExportPaymentsToExcel?fDesde=${fDesde}&fHasta=${fHasta}`;
    route += `&campoDesde=${campoDesde}&campoHasta=${campoHasta}&bombero=${bombero}&metodoPago=${metodoPago}`;
    route += `&tarjeta=${tarjeta}&placa=${placa}`;
    route += `&limite=${limite}&pagina=${pagina}`;
    return this.invocationService.invokeBackendService<string, null>(this.invocationService.GET, this.url + route);
  }
  anularPago = (pago: Pago, fromCuadre: boolean = false): Promise<GenericResponse<Pago>> => {
    const route = `api/ListadoVentas/anularPago`;
    return this.invocationService.invokeBackendService<GenericResponse<Pago>, { data: Pago, fromCuadre: Boolean }>(this.invocationService.POST, this.url + route, { data: pago, fromCuadre });
  }
  pagarVenta = (comprobanteDataModel: ComprobanteDataModel): Promise<GenericResponse<Pago>> => {
    const route = `api/ListadoVentas/pagarVenta`;
    return this.invocationService.invokeBackendService<GenericResponse<Pago>, ComprobanteDataModel>
      (this.invocationService.POST, this.url + route, comprobanteDataModel);
  }
  pagarVentaFacturacion = (comprobanteDataModel: ComprobanteDataModelFacturacion): Promise<GenericResponse<Pago>> => {
    const route = `api/ListadoVentas/pagarVenta`;
    return this.invocationService.invokeBackendService<GenericResponse<Pago>, ComprobanteDataModelFacturacion>
      (this.invocationService.POST, this.url + route, comprobanteDataModel);
  }
  validarPermisoManipulacionVenta = (validacionManipulacionVentas: ValidacionManipulacionVentas): Promise<GenericResponse<string>> => {
    const route = `api/ListadoVentas/validarPermisoManipulacionVenta`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, ValidacionManipulacionVentas>
      (this.invocationService.POST, this.url + route, validacionManipulacionVentas);
  }
  saveComprobante = (comprobanteDataModel: ComprobanteDataModel): Promise<GenericResponse<string>> => {
    const route = `api/ListadoVentas/GenerateComprobante`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, ComprobanteDataModel>
      (this.invocationService.POST, this.url + route, comprobanteDataModel);
  }
  getVentaById = (sale_id: number): Promise<GenericResponse<Venta>> => {
    const route = `api/ListadoVentas/GetVentaById?sale_id=${sale_id}`;
    return this.invocationService.invokeBackendService<GenericResponse<Venta>, null>(this.invocationService.GET, this.url + route);
  }
  getVerifones = (): Promise<ModelList<Verifone>> => {
    const route = `api/ListadoVentas/GetVerifones`;
    return this.invocationService.invokeBackendService<ModelList<Verifone>, null>(this.invocationService.GET, this.url + route);
  }

  getDashboardInfo = (product: string, period_time:string): Promise<GenericResponse<any>> => {
    const route = `api/ListadoVentas/GetDashboardInfo?product=${product}&period_time=${period_time}`;
    return this.invocationService.invokeBackendService<GenericResponse<any>, null>(this.invocationService.GET, this.url + route);
  }

  useTimerForUpdateDashboardValues = (): Promise<boolean> => {
		let route: string = `api/ListadoVentas/UseTimerForUpdateDashboardValues`;
		return this.invocationService.invokeBackendService<boolean, null>(this.invocationService.GET, this.url + route);
  }
}
