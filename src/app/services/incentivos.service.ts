import { Injectable } from "@angular/core";
import { InvocationService } from './invocationService.service';
import { ModelList } from '../models/ModelList.model';
import { GenericResponse } from '../models/GenericResponse.model';
import { Incentivo } from "app/models/incentivo/incentivo.model";
import { environment } from 'environments/environment';


@Injectable()
export class IncentivosService {
    private url: string;

    constructor(private invocationService: InvocationService,) {
        this.url = environment.Urls.Baseurl;
    }

    guardar(incentivo: Incentivo): Promise<GenericResponse<Incentivo>> {
        let route: string;
        if(incentivo.id === 0) {
            route = `api/Incentivos/guardar`;
        } else {
            route = `api/Incentivos/modificar`;    
        }
        return this.generateRequestPost(route, incentivo);
    }
    cargar(limite: number, pagina: number): Promise<ModelList<Incentivo>> {
        const route = `api/Incentivos/cargar?limite=${limite}&pagina=${pagina}`;
        return this.invocationService.invokeBackendService<ModelList<Incentivo>, null>(this.invocationService.GET, this.url + route);
    }
    eliminar(id: number): Promise<GenericResponse<string>> {
        const route = `api/Incentivos/eliminar`;
        return this.invocationService
            .invokeBackendService<GenericResponse<string>, number>(this.invocationService.POST, this.url + route, id);
    }
    cargarUno = (codigo: string): Promise<GenericResponse<Incentivo>> => {
        const route = `api/Incentivos/cargarUno?codigo=${codigo}`;
        return this.invocationService.invokeBackendService<GenericResponse<Incentivo>, null>
            (this.invocationService.GET, this.url + route);
    }

    generateRequestPost<T>(route: string, entity: T): Promise<GenericResponse<Incentivo>> {
        return this.invocationService
            .invokeBackendService<GenericResponse<Incentivo>, T>(this.invocationService.POST, this.url + route, entity);
    }
}