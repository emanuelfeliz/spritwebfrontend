import { Injectable } from '@angular/core';
import { ModelList } from 'app/models/ModelList.model';
import { InvocationService } from 'app/services/invocationService.service';
import { ResumenLado } from 'app/models/pump-tablet/resumen_lado.model';
import { PumpTabletData } from 'app/models/pump-tablet/pump_tablet_data.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { Lado } from '../models/pump-tablet/lado.model';
import { ClosedPumpTicket } from 'app/models/ticket/closed_pump_ticket';
import { environment } from 'environments/environment';
@Injectable()
export class PumptabletService {
  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  getDispensers = (): Promise<ModelList<number>> => {
    const route = `${this.url}api/PumpTablet/getDispensers`;
    return this.invocationService.invokeBackendService<ModelList<number>, null>(this.invocationService.GET, route);
  }
  getResumenesLados = (): Promise<ModelList<ResumenLado>> => {
    const route = `${this.url}api/PumpTablet/getResumenesLados`;
    return this.invocationService.invokeBackendService<ModelList<ResumenLado>, null>(this.invocationService.GET, route);
  }
  getPumpTabletData = (pump1: number, pump2: number): Promise<PumpTabletData> => {
    const route = `${this.url}api/PumpTablet/getPumpTabletData?pump1=${pump1}&pump2=${pump2}`;
    return this.invocationService.invokeBackendService<PumpTabletData, null>(this.invocationService.GET, route);
  }
  getPumpTabletDataByDispenser = (dispenser: number): Promise<PumpTabletData> => {
    const route = `${this.url}api/PumpTablet/getPumpTabletDataByDispenser?dispenser=${dispenser}`;
    return this.invocationService.invokeBackendService<PumpTabletData, null>(this.invocationService.GET, route);
  }
  abrirAperturaBomberoMaestro = (lados: Array<Lado>): Promise<GenericResponse<string>> => {
    const route = `${this.url}api/PumpTablet/abrirAperturaBomberoMaestro`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, Array<Lado>>(this.invocationService.POST, route, lados);
  }
  CerrarConjuntoLados = (lados: Array<Lado>): Promise<GenericResponse<string>> => {
    const route = `${this.url}api/PumpTablet/CerrarConjuntoLados`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, Array<Lado>>(this.invocationService.POST, route, lados);
  }
  closePump = (pump: number, turno: number, IgnorarCarenciaVentas: boolean): Promise<GenericResponse<string>> => {
    const route = `${this.url}api/PumpTablet/closePump?pump=${pump}&turno=${turno}&IgnorarCarenciaVentas=${IgnorarCarenciaVentas}`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, null>(this.invocationService.GET, route);
  }
  closeDispenser = (pumpA: number, turnoA: number, pumpB: number, turnoB: number): Promise<GenericResponse<string>> => {
    const route = `${this.url}api/PumpTablet/closeDispenser?pumpA=${pumpA}&turnoA=${turnoA}&pumpB=${pumpB}&turnoB=${turnoB}`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, null>(this.invocationService.GET, route);
  }
  InactiveAperturaTurno = () => {
    const route = `${this.url}api/PumpTablet/DeactivateAperturaTurno`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, null>(this.invocationService.GET, route);
  }
  CerrarDia = (): Promise<GenericResponse<string>> => {
    const route = `${this.url}api/PumpTablet/CerrarDia`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, null>(this.invocationService.GET, route);
  }

  validateCloseHour = (): Promise<GenericResponse<number[]>> => {
    const route = `${this.url}api/PumpTablet/validateCloseHour`;
    return this.invocationService.invokeBackendService<GenericResponse<number[]>, null>(this.invocationService.GET, route);
  }

  checkIfHaveAnotherTurnOpen = (id_bombero: number, bombero:string): Promise<GenericResponse<string>> => {
    const route = `${this.url}api/pumptablet/CheckIfHaveAnotherTurnOpen?id_bombero=${id_bombero}&bombero=${bombero}`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, null>(this.invocationService.GET, route);
  }

  getPumpClosedTickets = (pagina: number, limite: number): Promise<ModelList<ClosedPumpTicket>> => {
    const route = `api/pumptablet/ClosedPumpsTickets?pagina=${pagina}&limite=${limite}`;
    return this.invocationService.invokeBackendService<ModelList<ClosedPumpTicket>, null>(this.invocationService.GET, this.url + route);
  }
}
