import { Injectable } from '@angular/core';
import { ModelList } from 'app/models/ModelList.model';
import { InvocationService } from 'app/services/invocationService.service';
import { TurnoCerrado } from 'app/models/turnos/TurnoCerrado.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { TurnoPeriodo } from '../models/turnos/TurnoPeriodo.model';
import { ReporteMesInfo } from '../models/reporte-mes/ReporteMesInfo.model';
import { environment } from 'environments/environment';
@Injectable()
export class TurnosService {

  private url: string;

  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  loadReportMonthInfo = (): Promise<ModelList<ReporteMesInfo>> => {
    const route = `api/Turnos/loadReportMonthInfo`;
    return this.invocationService.invokeBackendService<ModelList<ReporteMesInfo>, null>(this.invocationService.GET, this.url + route);
  }
  getInfoTurno = (turno: number, lados: string): Promise<GenericResponse<Array<number>>> => {
    const route = `api/Turnos/getInfoTurno?turno=${turno}&lados=${lados}`;
    return this.invocationService.invokeBackendService<GenericResponse<Array<number>>, null>(this.invocationService.GET, this.url + route);
  }
  getTurnosCerradosPaginated = (startDate: string, endDate: string, turno: number, limite: number, pagina: number) => {
    const route = `api/Turnos/getTurnosCerrados?startDate=${startDate}&endDate=${endDate}&turno=${turno}&limite=${limite}&pagina=${pagina}`;
    return this.invocationService.invokeBackendService<ModelList<TurnoCerrado>, null>(this.invocationService.GET, this.url + route);
  }

  getTurnosDias = (limite: number, pagina: number) => {
    const route = `api/Turnos/GetTurnosDias?limite=${limite}&pagina=${pagina}`;
    return this.invocationService.invokeBackendService<ModelList<TurnoPeriodo>, null>(this.invocationService.GET, this.url + route);
  }
}
