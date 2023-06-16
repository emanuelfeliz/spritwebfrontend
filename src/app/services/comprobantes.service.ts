import { Injectable } from '@angular/core';
import { NCFDataModel } from '../models/conf-comprobantes/NCFDataModel.model';
import { ModelList } from 'app/models/ModelList.model';
import { InvocationService } from 'app/services/invocationService.service';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { FacturaComprobante } from 'app/models/consulta-comprobantes/facturaComprobante.model';
import { InvoiceType } from '../models/consulta-comprobantes/InvoiceType.model';
import { RncModel } from '../models/conf-comprobantes/RncModel.model';
import { environment } from 'environments/environment';
@Injectable()
export class ComprobantesService {
  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  SaveNewRnc = (rncModel: RncModel): Promise<GenericResponse<string>> => {
    const route = `api/Comprobantes/SaveNewRnc`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, RncModel>(this.invocationService.POST, this.url + route,
      rncModel);
  }
  LoadInvoicesTypes = (): Promise<ModelList<InvoiceType>> => {
    const route = `api/Comprobantes/LoadInvoicesTypes`;
    return this.invocationService.invokeBackendService<ModelList<InvoiceType>, null>(this.invocationService.GET, this.url + route);
  }
  getByTipo = (codigo: string): Promise<ModelList<NCFDataModel>> => {
    const route = `api/Comprobantes/getByTipo?codigo=${codigo}`;
    return this.invocationService.invokeBackendService<ModelList<NCFDataModel>, null>(this.invocationService.GET, this.url + route);
  }
  updateComprobantes = (ncf: NCFDataModel): Promise<GenericResponse<string>> => {
    const json = JSON.stringify(ncf);
    const route = `api/Comprobantes/updateComprobantes?ncf=${json}`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, null>(this.invocationService.GET, this.url + route);
  }
  consultarComprobantes = (fDesde: string, fHasta: string, clientName: string,
    clientRNC: string, monto: number, voucher_type: string, limite: number, pagina: number): Promise<ModelList<FacturaComprobante>> => {
    let route = `api/Comprobantes/consultarComprobantes?fDesde=${fDesde}&fHasta=${fHasta}&clientName=${clientName}&`;
    route += `clientRNC=${clientRNC}&monto=${monto}&voucher_type=${voucher_type}&limite=${limite}&pagina=${pagina}`;
    return this.invocationService.invokeBackendService<ModelList<FacturaComprobante>, null>(this.invocationService.GET, this.url + route);
  }
  ExportarTodos = (fDesde: string, fHasta: string, clientName: string,
    clientRNC: string, monto: number, voucher_type: string): Promise<string> => {
    let route = `api/Comprobantes/ExportarTodos?fDesde=${fDesde}&fHasta=${fHasta}&clientName=${clientName}&`;
    route += `clientRNC=${clientRNC}&monto=${monto}&voucher_type=${voucher_type}`;
    return this.invocationService.invokeBackendService<string, null>(this.invocationService.GET, this.url + route);
  }
  suppressVoucher = (ncf: string): Promise<GenericResponse<string>> => {
    const route = `api/Comprobantes/SuppressVoucher?ncf=${ncf}`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, null>(this.invocationService.GET, this.url + route);
  }

  isMultipleBills = (ncf: string): Promise<GenericResponse<string>> => {
    const route = `api/Comprobantes/IsMultipleBills?ncf=${ncf}`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, null>(this.invocationService.GET, this.url + route);
  }
}
