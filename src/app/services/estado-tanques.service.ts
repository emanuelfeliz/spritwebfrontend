import { Injectable } from '@angular/core';
import { TankDesign } from 'app/models/Tanques/TankDesign.model';
import { MovimientoTanque } from 'app/models/Tanques/MovimientoTanque.model';
import { MedidaTanque } from 'app/models/Tanques/MedidaTanque.model';
import { ModelList } from 'app/models/ModelList.model';
import { TanqueModel } from 'app/models/Tanques/TanqueSelectModel.model';
import { InvocationService } from 'app/services/invocationService.service';
import { Tanks } from 'app/models/Tanques/Tanks.model';
import { HistorialTanque } from 'app/models/Tanques/HistorialTanque.model';
import { EstadoTanque } from 'app/models/Tanques/EstadoTanque.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { environment } from 'environments/environment';
@Injectable()
export class EstadoTanquesService {
	private url: string;
	constructor(private invocationService: InvocationService,) {
		this.url = environment.Urls.Baseurl;
	}
	getTanques = (): Promise<ModelList<TanqueModel>> => {
		let route: string = `api/EstadoTanques/getTanques`;
		return this.invocationService.invokeBackendService<ModelList<TanqueModel>, null>(this.invocationService.GET, this.url + route);
	}
	loadTanks = (): Promise<ModelList<Tanks>> => {
		let route: string = `api/EstadoTanques/loadTanks`;
		return this.invocationService.invokeBackendService<ModelList<Tanks>, null>(this.invocationService.GET, this.url + route);
	}
	getMedidasTanque = (startDate: string, endDate: string, selectedTanks: string, selectedBomberos: string, pagina: number, limite: number): Promise<ModelList<MedidaTanque>> => {
		let route: string = `api/EstadoTanques/getMedidasTanque?fDesde=${startDate}&fHasta=${endDate}&selectedTanks=${selectedTanks}&selectedBomberos=${selectedBomberos}&limite=${limite}&pagina=${pagina}`;
		return this.invocationService.invokeBackendService<ModelList<MedidaTanque>, null>(this.invocationService.GET, this.url + route);
	}
	getMovimientosTanques = (startDate: string, endDate: string, selectedTanks: string, selectedBomberos: string, pagina: number, limite: number): Promise<ModelList<MovimientoTanque>> => {
		let route: string = `api/EstadoTanques/getMovimientosTanques?fDesde=${startDate}&fHasta=${endDate}&selectedTanks=${selectedTanks}&selectedBomberos=${selectedBomberos}&limite=${limite}&pagina=${pagina}`;
		return this.invocationService.invokeBackendService<ModelList<MovimientoTanque>, null>(this.invocationService.GET, this.url + route);
	}
	getHistorialTanques = (startDate: string, endDate: string, selectedTanks: string, pagina: number, limite: number): Promise<ModelList<HistorialTanque>> => {
		let route: string = `api/EstadoTanques/getHistorialTanques?fDesde=${startDate}&fHasta=${endDate}&selectedTanks=${selectedTanks}&limite=${limite}&pagina=${pagina}`;
		return this.invocationService.invokeBackendService<ModelList<HistorialTanque>, null>(this.invocationService.GET, this.url + route);
	}
	getEstadoTanques = (): Promise<ModelList<EstadoTanque>> => {
		let route: string = `api/EstadoTanques/getEstadoTanques`;
		return this.invocationService.invokeBackendService<ModelList<EstadoTanque>, null>(this.invocationService.GET, this.url + route);
	}
	SetMedidaTanque = (medidaTanque: MedidaTanque): Promise<GenericResponse<MedidaTanque>> => {
		let route: string = `api/EstadoTanques/SetMedidaTanque?json=${JSON.stringify(medidaTanque)}`;
		return this.invocationService.invokeBackendService<GenericResponse<MedidaTanque>, null>(this.invocationService.GET, this.url + route);
	}
	updateVolume = (movimiento: MovimientoTanque): Promise<GenericResponse<MovimientoTanque>> => {
		let route: string = `api/EstadoTanques/UpdateVolume?json=${JSON.stringify(movimiento)}`;
		return this.invocationService.invokeBackendService<GenericResponse<MovimientoTanque>, null>(this.invocationService.GET, this.url + route);
	}

	getTanksDesign = (): Promise<ModelList<TankDesign>> => {
		let route: string = `api/EstadoTanques/getTanksDesign`;
		return this.invocationService.invokeBackendService<ModelList<TankDesign>, null>(this.invocationService.GET, this.url + route);
	}
	saveTanksDesign = (tankDesign: TankDesign): Promise<GenericResponse<TankDesign>> => {
		let route: string = `api/EstadoTanques/saveTanksDesign?json=${JSON.stringify(tankDesign)}`;
		return this.invocationService.invokeBackendService<GenericResponse<TankDesign>, null>(this.invocationService.GET, this.url + route);
	}
	editTanksDesign = (tankDesign: TankDesign): Promise<GenericResponse<TankDesign>> => {
		let route: string = `api/EstadoTanques/editTanksDesign?json=${JSON.stringify(tankDesign)}`;
		return this.invocationService.invokeBackendService<GenericResponse<TankDesign>, null>(this.invocationService.GET, this.url + route);
	}
	deleteTanksDesign = (id: number): Promise<GenericResponse<TankDesign>> => {
		let route: string = `api/EstadoTanques/deleteTanksDesign?id=${id}`;
		return this.invocationService.invokeBackendService<GenericResponse<TankDesign>, null>(this.invocationService.GET, this.url + route);
	}
	showBigTanks = (): Promise<boolean> => {
		let route: string = `api/EstadoTanques/showBigTanks`;
		return this.invocationService.invokeBackendService<boolean, null>(this.invocationService.GET, this.url + route);
	}

	useTimerForUpdateTanks = (): Promise<boolean> => {
		let route: string = `api/EstadoTanques/UseTimerForUpdateTanks`;
		return this.invocationService.invokeBackendService<boolean, null>(this.invocationService.GET, this.url + route);
	}
}
