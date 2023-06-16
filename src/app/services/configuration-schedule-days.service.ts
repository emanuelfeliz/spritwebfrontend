import { Injectable } from '@angular/core';
import { ConfiguracionHorarioTurno } from 'app/models/configuracion_schedule/configuration-schedule';
import { InvocationService } from 'app/services/invocationService.service';
import { ModelList } from 'app/models/ModelList.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { environment } from 'environments/environment';
@Injectable()
export class ConfiguracionDiasHorariosService {

  public url: string;
  constructor( private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  getConfigurationDays = (): Promise<ModelList<ConfiguracionHorarioTurno>> => {
    const route = `api/ConfigurationSchedules/getConfigurationDays`;
    return this.invocationService
    .invokeBackendService<ModelList<ConfiguracionHorarioTurno>, null>(this.invocationService.GET, this.url + route);
  };
  saveConfigurationScheduleDay = (configuracion: ConfiguracionHorarioTurno): Promise<GenericResponse<ConfiguracionHorarioTurno>> => {
    let route: string = `api/ConfigurationSchedules/saveConfigurationScheduleDay?json=${JSON.stringify(configuracion)}`;
    return this.invocationService.invokeBackendService<GenericResponse<ConfiguracionHorarioTurno>, null>(this.invocationService.GET, this.url + route);
  };
  editConfigurationScheduleDay = (configuracion: ConfiguracionHorarioTurno): Promise<GenericResponse<ConfiguracionHorarioTurno>> => {
    let route: string = `api/ConfigurationSchedules/editConfigurationScheduleDay?json=${JSON.stringify(configuracion)}`;
    return this.invocationService.invokeBackendService<GenericResponse<ConfiguracionHorarioTurno>, null>(this.invocationService.GET, this.url + route);
  };
  deleteConfigurationScheduleDay = (id: number): Promise<GenericResponse<ConfiguracionHorarioTurno>> => {
    let route: string = `api/ConfigurationSchedules/deleteConfigurationScheduleDay?id=${id}`;
    return this.invocationService.invokeBackendService<GenericResponse<ConfiguracionHorarioTurno>, null>(this.invocationService.GET, this.url + route);
  };
}
