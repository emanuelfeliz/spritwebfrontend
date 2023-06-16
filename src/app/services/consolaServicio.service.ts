import { vmModuleProcess } from './../models/service/vmModuleProcess.model';
import { Process } from './../models/service/Process.model';
import { Module } from './../models/service/Module.model';
import { Injectable } from '@angular/core';
import { InvocationService } from 'app/services/invocationService.service';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { environment } from 'environments/environment';
@Injectable()
export class ConsolaServicioService {

  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  ToggleProcess = (activating: boolean, module: Module, process: Process):  Promise<GenericResponse<string>> => {
    const route = `api/service/ToggleProcess`;
    const data = new vmModuleProcess(activating, module, process);
    return this.invocationService.invokeBackendService<GenericResponse<string>, vmModuleProcess>
    (this.invocationService.POST, this.url + route, data);
  }
  GetDataConfig = ():  Promise<GenericResponse<Array<Module>>> => {
    const route = `api/service/GetModules`;
    return this.invocationService.invokeBackendService<GenericResponse<Array<Module>>, null>
    (this.invocationService.GET, this.url + route);
  }
  serviceIsRunning = (): Promise<GenericResponse<string>> => {
    const route = `api/service/serviceIsRunning`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, null>
    (this.invocationService.GET, this.url + route);
  }
  StopService = (): Promise<GenericResponse<string>> => {
    const route = `api/service/StopService`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, null>
    (this.invocationService.GET, this.url + route);
  }
  StartService = (): Promise<GenericResponse<string>> => {
    const route = `api/service/StartService`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, null>
    (this.invocationService.GET, this.url + route);
  }
}
