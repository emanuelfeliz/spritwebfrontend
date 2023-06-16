import { Injectable } from '@angular/core';
import { ModelList } from 'app/models/ModelList.model';
import { InvocationService } from 'app/services/invocationService.service';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { CierreAutomatico } from '../models/cierres-automaticos/cierre-automatico.model';
import { LadoSelectedCierre } from '../models/cierres-automaticos/lado-seleccionado.model';
import { environment } from 'environments/environment';
@Injectable()
export class CierresAutomaticosService {

  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  GetLadosBomba = (): Promise<Array<LadoSelectedCierre>> => {
    const route = `api/CierresAutomaticos/GetLadosBomba`;
    return this.invocationService.invokeBackendService<Array<LadoSelectedCierre>, null>(this.invocationService.GET, this.url + route);
  }
  deleteCierre = (id: number): Promise<GenericResponse<string>> => {
    const route = `api/CierresAutomaticos/deleteCierre?id_registro=${id}`;
    return this.invocationService.
    invokeBackendService<GenericResponse<string>, null>(this.invocationService.GET , this.url + route);
  }
  MostrarData=(): Promise<ModelList<CierreAutomatico>> => {
    const route = `api/CierresAutomaticos/MostrarData`;
    return this.invocationService.invokeBackendService<ModelList<CierreAutomatico>, null>(this.invocationService.GET, this.url + route);
  }
  saveCierre=(cierre:CierreAutomatico): Promise<GenericResponse<string>> => {
    const route = `api/CierresAutomaticos/saveCierre`;
    return this.invocationService.
    invokeBackendService<GenericResponse<string>, CierreAutomatico>(this.invocationService.POST, this.url + route, cierre);
  }
  editcierre=(cierre:CierreAutomatico): Promise<GenericResponse<string>> => {
    const route = `api/CierresAutomaticos/editcierre`;
    return this.invocationService.
    invokeBackendService<GenericResponse<string>, CierreAutomatico>(this.invocationService.POST, this.url + route, cierre);
  }
}
