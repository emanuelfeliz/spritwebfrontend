import { AperturaTurnoBombero } from 'app/models/apertura_turno/apertura_turno_bombero.model';
import { Injectable } from '@angular/core';
import { Bombero } from 'app/models/bomberos/bomberos.model';
import { InvocationService } from 'app/services/invocationService.service';
import { ModelList } from 'app/models/ModelList.model';
import { LadoSelected } from 'app/models/apertura_turno/ladoSelected.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { environment } from 'environments/environment';
@Injectable()
export class AperturaTurnosService {

  private url: string;
  constructor(private invocationService: InvocationService) {
    this.url = environment.Urls.Baseurl;
  }
  cargarBomberos = (): Promise<ModelList<Bombero>> => {
    const route = `api/AperturaTurno/cargarBomberos`;
    return this.invocationService.invokeBackendService<ModelList<Bombero>, null>(this.invocationService.GET, this.url + route);
  }
  cargarLados = (): Promise<ModelList<LadoSelected>> => {
    const route = `api/AperturaTurno/cargarLados`;
    return this.invocationService.invokeBackendService<ModelList<LadoSelected>, null>(this.invocationService.GET, this.url + route);
  }
  getAperturaTurnos = (estado: string): Promise<ModelList<AperturaTurnoBombero>> => {
    const route = `api/AperturaTurno/getAperturaTurnos?estado=${estado}`;
    return this.invocationService.invokeBackendService<ModelList<AperturaTurnoBombero>, null>(this.invocationService.GET, this.url + route);
  }
  RegistrarApertura = (apertura_turno: AperturaTurnoBombero): Promise<GenericResponse<AperturaTurnoBombero>> => {
    const route = `api/AperturaTurno/RegistrarApertura`;
    return this.invocationService
      .invokeBackendService<GenericResponse<AperturaTurnoBombero>, AperturaTurnoBombero>
      (this.invocationService.POST, this.url + route, apertura_turno);
  }
  EditarAperturaBombero = (apertura_turno: AperturaTurnoBombero): Promise<GenericResponse<AperturaTurnoBombero>> => {
    const route = `api/AperturaTurno/EditarAperturaBombero`;
    return this.invocationService
      .invokeBackendService<GenericResponse<AperturaTurnoBombero>, AperturaTurnoBombero>
      (this.invocationService.POST, this.url + route, apertura_turno);
  }
  EliminarAperturaBombero = (id: number): Promise<GenericResponse<AperturaTurnoBombero>> => {
    const route = `api/AperturaTurno/EliminarAperturaBombero?id=${id}`;
    return this.invocationService
      .invokeBackendService<GenericResponse<AperturaTurnoBombero>, null>(this.invocationService.GET, this.url + route);
  }

}
