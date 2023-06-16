import { Injectable } from '@angular/core';
import { InvocationService } from './invocationService.service';
import { ModelList } from '../models/ModelList.model';
import { ConfiguracionPuntajesFidelidad } from '../models/configuracion_puntajes_fidelidad/ConfiguracionPuntajesFidelidad.model';
import { GenericResponse } from '../models/GenericResponse.model';
import { Modalidad } from 'app/models/configuracion_puntajes_fidelidad/Modalidad.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionPuntajesFidelidadService {

  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }

  cargar = (): Promise<ModelList<ConfiguracionPuntajesFidelidad>> => {
    const route = `api/ConfiguracionPuntajesFidelidad/getConfiguracionesPuntajesFidelidad`;
    return this.invocationService.invokeBackendService<ModelList<ConfiguracionPuntajesFidelidad>, null>(this.invocationService.GET, this.url + route);
  }
  getConfiguracionPuntajesFidelidadActiva = (fidelizacion: boolean, canje: boolean, modalidad: Modalidad, galonesConsumidosCliente: number, pesosConsumidosCliente: number, tipoCliente: string, id_tipo_cliente:number): Promise<GenericResponse<ConfiguracionPuntajesFidelidad>> => {
    const route = `api/ConfiguracionPuntajesFidelidad/getConfiguracionPuntajesFidelidadActiva?fidelizacion=${fidelizacion}&canje=${canje}&galonesConsumidosCliente=${galonesConsumidosCliente}&pesosConsumidosCliente=${pesosConsumidosCliente}&tipoCliente=${tipoCliente}&porGalones=${modalidad.porGalones}&porPrecio=${modalidad.porPrecio}&id_tipo_cliente=${id_tipo_cliente}`;
    return this.invocationService.invokeBackendService<GenericResponse<ConfiguracionPuntajesFidelidad>, null>(this.invocationService.GET, this.url + route);
  }
  guardar = (configuracionPuntajesFidelidad: ConfiguracionPuntajesFidelidad): Promise<GenericResponse<ConfiguracionPuntajesFidelidad>> => {
    let route: string;
    if(configuracionPuntajesFidelidad.id === 0) {
      route = `api/ConfiguracionPuntajesFidelidad/saveConfiguracionPuntajesFidelidad`;
    } else {
      route = `api/ConfiguracionPuntajesFidelidad/editConfiguracionPuntajesFidelidad`;    
    }
    return this.generateRequestPost(route, configuracionPuntajesFidelidad);
  }
  eliminar(id: number): Promise<GenericResponse<string>> {
    const route = `api/ConfiguracionPuntajesFidelidad/deleteConfiguracionPuntajesFidelidad`;
    return this.invocationService
      .invokeBackendService<GenericResponse<string>, number>(this.invocationService.POST, this.url + route, id);
  }

  generateRequestPost(route: string, configuracionPuntajesFidelidad: ConfiguracionPuntajesFidelidad): Promise<GenericResponse<ConfiguracionPuntajesFidelidad>> {
    return this.invocationService
      .invokeBackendService<GenericResponse<ConfiguracionPuntajesFidelidad>, ConfiguracionPuntajesFidelidad>(this.invocationService.POST, this.url + route, configuracionPuntajesFidelidad);
  }
}