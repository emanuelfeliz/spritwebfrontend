import { Injectable } from '@angular/core';
import { ConfiguracionHorarioTurno } from 'app/models/configuracion_schedule/configuration-schedule';
import { InvocationService } from 'app/services/invocationService.service';
import { ModelList } from 'app/models/ModelList.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { environment } from 'environments/environment';
@Injectable()
export class ConfiguracionTurnosHorariosService {

  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  getConfiguracionHorarioTurnos = (): Promise<ModelList<ConfiguracionHorarioTurno>> => {
    const route = `api/ConfiguracionHorariosTurnos/getConfiguracionHorarioTurnos`;
    return this.invocationService
    .invokeBackendService<ModelList<ConfiguracionHorarioTurno>, null>(this.invocationService.GET, this.url + route);
  };
  saveConfiguracionturno = (configuracion: ConfiguracionHorarioTurno): Promise<GenericResponse<ConfiguracionHorarioTurno>> => {
    let route: string = `api/ConfiguracionHorariosTurnos/saveConfiguracionturno?json=${JSON.stringify(configuracion)}`;
    return this.invocationService.invokeBackendService<GenericResponse<ConfiguracionHorarioTurno>, null>(this.invocationService.GET, this.url + route);
  };
  editConfiguracionturno = (configuracion: ConfiguracionHorarioTurno): Promise<GenericResponse<ConfiguracionHorarioTurno>> => {
    let route: string = `api/ConfiguracionHorariosTurnos/editConfiguracionturno?json=${JSON.stringify(configuracion)}`;
    return this.invocationService.invokeBackendService<GenericResponse<ConfiguracionHorarioTurno>, null>(this.invocationService.GET, this.url + route);
  };
  deleteConfiguracionturno = (id: number): Promise<GenericResponse<ConfiguracionHorarioTurno>> => {
    let route: string = `api/ConfiguracionHorariosTurnos/deleteConfiguracionturno?id=${id}`;
    return this.invocationService.invokeBackendService<GenericResponse<ConfiguracionHorarioTurno>, null>(this.invocationService.GET, this.url + route);
  };
}
