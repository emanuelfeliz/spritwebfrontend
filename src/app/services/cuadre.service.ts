import { ICoinRate } from './../models/coin/ICoinRate';
import { Injectable } from '@angular/core';
import { Cuadre } from 'app/models/cuadres/cuadre.model';
import { CuadreValidacionModel } from 'app/models/cuadres/cuadreValidacionModel.model';
import { ModelList } from 'app/models/ModelList.model';
import { InvocationService } from 'app/services/invocationService.service';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { ProductoPorTurno } from 'app/models/cuadres/ProductoPorTurno.model';
import { ShiftAvailability } from 'app/models/cuadres/ShiftAvailability.model';
import { CuadreData } from '../models/cuadres/CuadreData.model';
import { CuadreDataPost } from '../models/cuadres/CuadreDataPost.model';
import { environment } from 'environments/environment';
@Injectable()
export class CuadresService {

  private url: string;

  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  getSingleCuadre = (codigo: string): Promise<GenericResponse<Cuadre>> => {
    const route = `api/Cuadre/getSingleCuadre?codigo=${codigo}`;
    return this.invocationService.invokeBackendService<GenericResponse<Cuadre>, null>(this.invocationService.GET, this.url + route);
  }
  validarCuadre = (turno: number, id_bombero: number): Promise<boolean> => {
    const route = `api/Cuadre/validarCuadre?turno=${turno}&id_bombero=${id_bombero}`;
    return this.invocationService.invokeBackendService<boolean, null>
      (this.invocationService.GET, this.url + route);
  }
  checkDataAvailability = (turno: number, pumps: string): Promise<GenericResponse<ShiftAvailability>> => {
    const route = `api/Cuadre/checkDataAvailability?turno=${turno}&pumps=${pumps}`;
    return this.invocationService.invokeBackendService<GenericResponse<ShiftAvailability>, null>
      (this.invocationService.GET, this.url + route);
  }
  deleteCuadre = (cuadreid: string): Promise<GenericResponse<Cuadre>> => {
    const route = `api/Cuadre/deleteCuadre?id=${cuadreid}`;
    return this.invocationService.invokeBackendService<GenericResponse<Cuadre>, null>(this.invocationService.GET, this.url + route);
  }
  saveCuadreValidacion = (cuadre: CuadreValidacionModel) => {
    const route = `api/Cuadre/saveCuadreValidacion`;
    return this.invocationService.invokeBackendService<GenericResponse<Cuadre>, CuadreValidacionModel>
      (this.invocationService.POST, this.url + route, cuadre);
  }
  editCuadre = (cuadre: Cuadre, user_id: string): Promise<GenericResponse<Cuadre>> => {
    const route = `api/Cuadre/editCuadre`;
    return this.invocationService.invokeBackendService<GenericResponse<Cuadre>, { }>
      (this.invocationService.POST, this.url + route,{ Cuadre: cuadre, UserId: user_id });
  }
  saveCuadre = (cuadre: CuadreDataPost, user_id: string): Promise<GenericResponse<Cuadre>> => {
    const route = `api/Cuadre/saveCuadre`;
    return this.invocationService.invokeBackendService<GenericResponse<Cuadre>, { }>
      (this.invocationService.POST, this.url + route, { Cuadre: cuadre, UserId: user_id });
  }
  getProductosByTurno = (startDate: string, startTime: string): Promise<ModelList<ProductoPorTurno>> => {
    const route = `api/Cuadre/getProductosByTurno?startDate=${startDate}&startTime=${startTime}`;
    return this.invocationService.invokeBackendService<ModelList<ProductoPorTurno>, null>(this.invocationService.GET, this.url + route);
  }
  LoadDataByCuadre = (cuadre: Cuadre, source: string): Promise<GenericResponse<Cuadre>> => {
    const route = `api/Cuadre/LoadDataByCuadre?source=${source}`;
    return this.invocationService.invokeBackendService<GenericResponse<Cuadre>, Cuadre>
      (this.invocationService.POST, this.url + route, cuadre);
  }
  getCuadre = (fDesde: string, fHasta: string, turnoInicial: number, turnoFinal: number,
    bomberosSelected: string, limite: number, pagina: number, user_id: string): Promise<CuadreData> => {
    let route = `api/Cuadre/getCuadre?fDesde=${fDesde}&fHasta=${fHasta}&turnoInicial=${turnoInicial}`;
    route += `&turnoFinal=${turnoFinal}&bomberosSelected=${bomberosSelected}&limite=${limite}&pagina=${pagina}&user_id=${user_id}`;
    return this.invocationService.invokeBackendService<CuadreData, null>(this.invocationService.GET, this.url + route);
  }
  exportCuadresToExcel = (): Promise<string> => {
    let route = `api/Cuadre/exportCuadresToExcel`;
    return this.invocationService.invokeBackendService<string, null>(this.invocationService.GET, this.url + route);
  }

  getCoinRates = (): Promise<ModelList<ICoinRate>> => {
    let route = `api/Cuadre/CoinRates`;
    return this.invocationService.invokeBackendService<ModelList<ICoinRate>, null>(this.invocationService.GET, this.url + route);
  }
}
