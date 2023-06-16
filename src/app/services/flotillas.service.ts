import { Injectable } from "@angular/core";
import { InvocationService } from './invocationService.service';
import { ModelList } from '../models/ModelList.model';
import { GenericResponse } from '../models/GenericResponse.model';
import { Flotilla } from "app/models/flotilla/flotilla.model";
import { environment } from 'environments/environment';


@Injectable()
export class FlotillasService {
    private url: string;

    constructor(private invocationService: InvocationService,) {
        this.url = environment.Urls.Baseurl;
    }

    guardar(flotilla: Flotilla): Promise<GenericResponse<Flotilla>> {
        let route: string;
        if(flotilla.id === 0) {
            route = `api/Flotillas/guardar`;
        } else {
            route = `api/Flotillas/modificar`;    
        }
        return this.generateRequestPost(route, flotilla);
    }
    cargar(limite: number, pagina: number): Promise<ModelList<Flotilla>> {
        const route = `api/Flotillas/cargar?limite=${limite}&pagina=${pagina}`;
        return this.invocationService.invokeBackendService<ModelList<Flotilla>, null>(this.invocationService.GET, this.url + route);
    }
    eliminar(id: number): Promise<GenericResponse<string>> {
        const route = `api/Flotillas/eliminar`;
        return this.invocationService
            .invokeBackendService<GenericResponse<string>, number>(this.invocationService.POST, this.url + route, id);
    }
    cargarUno = (codigo: string): Promise<GenericResponse<Flotilla>> => {
        const route = `api/Flotillas/cargarUno?codigo=${codigo}`;
        return this.invocationService.invokeBackendService<GenericResponse<Flotilla>, null>
            (this.invocationService.GET, this.url + route);
    }

    generateRequestPost<T>(route: string, entity: T): Promise<GenericResponse<Flotilla>> {
        return this.invocationService
            .invokeBackendService<GenericResponse<Flotilla>, T>(this.invocationService.POST, this.url + route, entity);
    }
}