import { Injectable } from "@angular/core";
import { InvocationService } from './invocationService.service';
import { ModelList } from '../models/ModelList.model';
import { GenericResponse } from '../models/GenericResponse.model';
import { Empleado } from "app/models/empleado/empleado.model";
import { environment } from 'environments/environment';


@Injectable()
export class EmpleadosService {
    private url: string;

    constructor(private invocationService: InvocationService,) {
        this.url = environment.Urls.Baseurl;
    }

    guardar(empleado: Empleado): Promise<GenericResponse<Empleado>> {
        let route: string;
        if(empleado.id === 0) {
            route = `api/Empleados/guardar`;
        } else {
            route = `api/Empleados/modificar`;    
        }
        return this.generateRequestPost(route, empleado);
    }
    cargar(limite: number, pagina: number): Promise<ModelList<Empleado>> {
        const route = `api/Empleados/cargar?limite=${limite}&pagina=${pagina}`;
        return this.invocationService.invokeBackendService<ModelList<Empleado>, null>(this.invocationService.GET, this.url + route);
    }
    eliminar(id: number): Promise<GenericResponse<string>> {
        const route = `api/Empleados/eliminar`;
        return this.invocationService
            .invokeBackendService<GenericResponse<string>, number>(this.invocationService.POST, this.url + route, id);
    }
    cargarUno = (codigo: string): Promise<GenericResponse<Empleado>> => {
        const route = `api/Empleados/cargarUno?codigo=${codigo}`;
        return this.invocationService.invokeBackendService<GenericResponse<Empleado>, null>
            (this.invocationService.GET, this.url + route);
    }

    generateRequestPost<T>(route: string, entity: T): Promise<GenericResponse<Empleado>> {
        return this.invocationService
            .invokeBackendService<GenericResponse<Empleado>, T>(this.invocationService.POST, this.url + route, entity);
    }
}