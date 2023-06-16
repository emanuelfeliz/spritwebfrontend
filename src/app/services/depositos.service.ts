import { Injectable } from '@angular/core';
import { ModelList } from 'app/models/ModelList.model';
import { InvocationService } from 'app/services/invocationService.service';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { Deposito } from 'app/models/depositos/Deposito.model';
import { environment } from 'environments/environment';
@Injectable()
export class DepositosService {

  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url =environment.Urls.Baseurl;
  }
  getDepositos = (pagina: number, limite: number): Promise<ModelList<Deposito>> => {
    const route = `api/Depositos/getDepositos?pagina=${pagina}&limite=${limite}`;
    return this.invocationService.invokeBackendService<ModelList<Deposito>, null>(this.invocationService.GET, this.url + route);
  }
  saveDeposito = (deposito: Deposito): Promise<GenericResponse<Deposito>> => {
    const route = `api/Depositos/saveDeposito`;
    return this.invocationService.
      invokeBackendService<GenericResponse<Deposito>, Deposito>(this.invocationService.POST, this.url + route, deposito);
  }
  deleteDeposito = (deposito: Deposito, fromCuadre: boolean = false): Promise<GenericResponse<Deposito>> => {
    const route = `api/Depositos/deleteDeposito`;
    return this.invocationService.invokeBackendService<GenericResponse<Deposito>, { data: Deposito, fromCuadre: boolean }>(this.invocationService.POST, this.url + route, { data: deposito, fromCuadre });
  }
  exportDepositsToExcel = (): Promise<string> => {
    let route = 'api/Depositos/exportDepositsToExcel';
    return this.invocationService.invokeBackendService<string, null>(this.invocationService.GET, this.url + route);
  }
}
