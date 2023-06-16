import { Injectable } from '@angular/core';
import { DataEstacion } from '../models/configuration/DataEstacion.model';
import { InvocationService } from 'app/services/invocationService.service';
import { ModelList } from 'app/models/ModelList.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { environment } from 'environments/environment';
@Injectable()
export class ConfigurationService {

  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  GetDatosEstacion = (): Promise<ModelList<DataEstacion>> => {
    const route = `api/ConfiguracionEstacion/GetDatosEstacion`;
    return this.invocationService.invokeBackendService<ModelList<DataEstacion>, null>(this.invocationService.GET, this.url + route);
  };
  SetDatosEstacion = (dataEstacion: DataEstacion): Promise<GenericResponse<DataEstacion>> => {
    const route = `api/ConfiguracionEstacion/SetDatosEstacion`;
    return this.invocationService
      .invokeBackendService<GenericResponse<DataEstacion>, DataEstacion>(this.invocationService.POST, this.url + route, dataEstacion);
  };
}
