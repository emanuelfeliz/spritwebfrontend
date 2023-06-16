import { Injectable } from '@angular/core';
import { ConfiguracionTanque } from 'app/models/configuracion-tanque/configuracion-tanque.model';
import { InvocationService } from 'app/services/invocationService.service';
import { ModelList } from 'app/models/ModelList.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { environment } from 'environments/environment';
@Injectable()
export class ConfiguracionTanqueService {

  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  getConfiguracionTanque = (): Promise<ModelList<ConfiguracionTanque>> => {
    const route = `api/ConfiguracionTanques/getConfiguracionTanques`;
    return this.invocationService
    .invokeBackendService<ModelList<ConfiguracionTanque>, null>(this.invocationService.GET, this.url + route);
  };
  saveConfiguracionTanque = (configuracion: ConfiguracionTanque): Promise<GenericResponse<ConfiguracionTanque>> => {
    let route: string = `api/ConfiguracionTanques/saveConfiguracionTanque?configuracionJson=${JSON.stringify(configuracion)}`;
    return this.invocationService.invokeBackendService<GenericResponse<ConfiguracionTanque>, null>(this.invocationService.GET, this.url + route);
  };
  editConfiguracionTanque = (configuracion: ConfiguracionTanque): Promise<GenericResponse<ConfiguracionTanque>> => {
    let route: string = `api/ConfiguracionTanques/editConfiguracionTanque?configuracionJson=${JSON.stringify(configuracion)}`;
    return this.invocationService.invokeBackendService<GenericResponse<ConfiguracionTanque>, null>(this.invocationService.GET, this.url + route);
  };
  deleteConfiguracionTanque = (id: number): Promise<GenericResponse<ConfiguracionTanque>> => {
    let route: string = `api/ConfiguracionTanques/deleteConfiguracionTanque?id=${id}`;
    return this.invocationService.invokeBackendService<GenericResponse<ConfiguracionTanque>, null>(this.invocationService.GET, this.url + route);
  };
}
