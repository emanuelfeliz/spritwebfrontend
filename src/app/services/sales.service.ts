import { Injectable } from '@angular/core';
import { Sale, SaleWithVoucher } from '../models/ventas/sale.model';
import { ModelList } from 'app/models/ModelList.model';
import { InvocationService } from 'app/services/invocationService.service';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { Bill } from '../models/multiple_bills/Bill.model';
import { environment } from 'environments/environment';


@Injectable()
export class SalesService {

  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  getSales = (fromDate: string, toDate: string, bombero: string, product: string, is_bombero: boolean): Promise<ModelList<Sale>> => {
    const route = `api/Sales/getSales?fromDate=${fromDate}&toDate=${toDate}&bombero=${bombero}&product=${product}&is_bombero=${is_bombero}`;
    return this.invocationService.invokeBackendService<ModelList<Sale>, null>(this.invocationService.GET, this.url + route);
  }

  saveSale = (sale: SaleWithVoucher): Promise<GenericResponse<SaleWithVoucher>> => {
    const route = `api/Sales/saveSale`;
    return this.invocationService.invokeBackendService<GenericResponse<SaleWithVoucher>, SaleWithVoucher>(this.invocationService.POST, this.url + route, sale);
  }

  saveSaleFromCuadre = (sale: Sale): Promise<GenericResponse<string>> => {
    const route = `api/Sales/saveSaleFromCuadre`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, Sale>(this.invocationService.POST, this.url + route, sale);
  }

  cancelSale = (sale: Sale): Promise<GenericResponse<string>> => {
    const route = `api/Sales/cancelSale`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, Sale>(this.invocationService.POST, this.url + route, sale);
  }

  multiplesBils(bills: Array<Bill>): Promise<GenericResponse<string>> {
    const route = `api/Sales/payMultipleBills`;
    return this.invocationService.
      invokeBackendService<GenericResponse<string>, Array<Bill>>(this.invocationService.POST, this.url + route, bills);
  }
}
