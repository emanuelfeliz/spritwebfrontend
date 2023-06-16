import { Injectable } from '@angular/core';
import { InvocationService } from './invocationService.service';
import { ModelList } from '../models/ModelList.model';
import { ClienteFidelizado } from '../models/clientes-fidelizados/ClienteFidelizado.model';
import { TipoClienteFidelizado } from '../models/clientes-fidelizados/TipoClienteFidelizado.model';
import { GenericResponse } from '../models/GenericResponse.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesFidelizadosService {

  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url =environment.Urls.Baseurl;
  }

  getDataClient = (codigo: string): Promise<GenericResponse<ClienteFidelizado>> => {
    const route = `api/ClientesFidelizados/getDataClient?codigo=${codigo}`;
    return this.invocationService.invokeBackendService<GenericResponse<ClienteFidelizado>, null>
      (this.invocationService.GET, this.url + route);
  }

  getClientes = (limite: number, pagina: number): Promise<ModelList<ClienteFidelizado>> => {
    const route = `api/ClientesFidelizados/getClientes?limite=${limite}&pagina=${pagina}`;
    return this.invocationService.invokeBackendService<ModelList<ClienteFidelizado>, null>(this.invocationService.GET, this.url + route);
  }
  getTiposCliente = (limite: number, pagina: number): Promise<ModelList<TipoClienteFidelizado>> => {
    const route = `api/ClientesFidelizados/getTiposCliente?limite=${limite}&pagina=${pagina}`;
    return this.invocationService.invokeBackendService<ModelList<TipoClienteFidelizado>, null>(this.invocationService.GET, this.url + route);
  }
  getNuevosClientes = (): Promise<GenericResponse<Array<ClienteFidelizado>>> => {
    const route = `api/ClientesFidelizados/getNuevosClientes`;
    return this.invocationService.invokeBackendService<GenericResponse<Array<ClienteFidelizado>>, null>(this.invocationService.GET, this.url + route);
  }
  getClientesByCriteria = (limite: number, pagina: number, filterText: string): Promise<ModelList<ClienteFidelizado>> => {
    const route = `api/ClientesFidelizados/getClientesByCriteria?limite=${limite}&pagina=${pagina}&criteria=${filterText}`;
    return this.invocationService.invokeBackendService<ModelList<ClienteFidelizado>, null>(this.invocationService.GET, this.url + route);
  }
  getTipoClientesByCriteria = (limite: number, pagina: number, filterText: string): Promise<ModelList<TipoClienteFidelizado>> => {
    const route = `api/ClientesFidelizados/getTipoClientesByCriteria?limite=${limite}&pagina=${pagina}&criteria=${filterText}`;
    return this.invocationService.invokeBackendService<ModelList<TipoClienteFidelizado>, null>(this.invocationService.GET, this.url + route);
  }
  getTiposClientesById = (limite: number, pagina: number, id: number): Promise<ModelList<TipoClienteFidelizado>> => {
    const route = `api/ClientesFidelizados/getTiposClienteById?limite=${limite}&pagina=${pagina}&id=${id}`;
    return this.invocationService.invokeBackendService<ModelList<TipoClienteFidelizado>, null>(this.invocationService.GET, this.url + route);
  }
  guardar(clienteFidelizado: ClienteFidelizado): Promise<GenericResponse<ClienteFidelizado>> {
    let route: string;
    if(clienteFidelizado.id === 0) {
        route = `api/ClientesFidelizados/saveClienteFidelizado`;
    } else {
        route = `api/ClientesFidelizados/editClienteFidelizado`;    
    }
    return this.generateRequestPost(route, clienteFidelizado);
  }
  saveTipoCliente(tipoClienteFidelizado: TipoClienteFidelizado): Promise<GenericResponse<TipoClienteFidelizado>> {
    let route: string;
    if(tipoClienteFidelizado.Id === 0) {
        route = `api/ClientesFidelizados/saveTipoClienteFidelizado`;
    } else {
        route = `api/ClientesFidelizados/editTipoClienteFidelizado`;    
    }
    return this.generateRequestPostTipoCliente(route, tipoClienteFidelizado);
  }
  deleteClienteFidelizado = (codigo: string): Promise<GenericResponse<string>> => {
    const route = `api/ClientesFidelizados/deleteClienteFidelizado`;
    return this.invocationService
      .invokeBackendService<GenericResponse<string>, string>(this.invocationService.POST, this.url + route, codigo);
  }

  generateRequestPost(route: string, Cliente: ClienteFidelizado): Promise<GenericResponse<ClienteFidelizado>> {
    return this.invocationService
      .invokeBackendService<GenericResponse<ClienteFidelizado>, ClienteFidelizado>(this.invocationService.POST, this.url + route, Cliente);
  }

  generateRequestPostTipoCliente(route: string, Cliente: TipoClienteFidelizado): Promise<GenericResponse<TipoClienteFidelizado>> {
    return this.invocationService
      .invokeBackendService<GenericResponse<TipoClienteFidelizado>, TipoClienteFidelizado>(this.invocationService.POST, this.url + route, Cliente);
  }
}
