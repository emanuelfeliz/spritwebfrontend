import { GenericResponse } from './../models/GenericResponse.model';
import { Injectable } from '@angular/core';
import { Rol } from '../models/usuarios/Rol.model';
import { Usuario } from '../models/usuarios/Usuario.model';
import { InvocationService } from './invocationService.service';
import { UsuarioAutenticado } from '../models/usuarios/UsuarioAutenticado.model';
import { BomberoAutenticado } from '../models/bomberos/BomberoAutenticado.model';
import { ModelList } from '../models/ModelList.model';
import { UserVM } from '../models/usuarios/UserVM.model';
import { environment } from 'environments/environment';
@Injectable()
export class AuthenticationService {
    private url: string;
    constructor(private invocationService: InvocationService) {
        this.url = environment.Urls.Baseurl;
    }
    AutenticarUsuarioConModulo = (codigo: string, permiso: string): Promise<GenericResponse<UsuarioAutenticado>> => {
        const route = `api/Autenticacion/AutenticarUsuarioConModulo?codigo=${codigo}&permiso=${permiso}`;
        return this.invocationService
            .invokeBackendService<GenericResponse<UsuarioAutenticado>, null>(this.invocationService.GET, this.url + route);
    }
    autenticarBombero(idbombero: number, codigo: string): Promise<GenericResponse<BomberoAutenticado>> {
        const route = `api/Autenticacion/AutenticarBombero?idbombero=${idbombero}&codigo=${codigo}`;
        return this.invocationService
            .invokeBackendService<GenericResponse<BomberoAutenticado>, null>(this.invocationService.GET, this.url + route);
    }
    login(username: string, password: string): Promise<GenericResponse<UsuarioAutenticado>> {
        const user: UserVM = new UserVM(username, password);
        const route = `api/Autenticacion/Autenticar`;
        return this.invocationService
            .invokeBackendService<GenericResponse<UsuarioAutenticado>, UserVM>(this.invocationService.POST,
                this.url + route, user);
    }
    getRoles = (): Promise<ModelList<Rol>> => {
        const route = `api/Autenticacion/getRoles`;
        return this.invocationService.invokeBackendService<ModelList<Rol>, null>(this.invocationService.GET, this.url + route);
    }
    saveRol = (rol: Rol): Promise<GenericResponse<string>> => {
        const route = `api/Autenticacion/saveRol`;
        return this.invocationService.invokeBackendService<GenericResponse<string>, Rol>
            (this.invocationService.POST, this.url + route, rol);
    }
    editRol = (rol: Rol): Promise<GenericResponse<string>> => {
        const route = `api/Autenticacion/editRol`;
        return this.invocationService.invokeBackendService<GenericResponse<string>, Rol>
            (this.invocationService.POST, this.url + route, rol);
    }
    deleteRol = (id: number): Promise<GenericResponse<string>> => {
        const route = `api/Autenticacion/deleteRol?idrol=${id}`;
        return this.invocationService.invokeBackendService<GenericResponse<string>, null>(this.invocationService.GET, this.url + route);
    }
    getUsuarios = (): Promise<ModelList<Usuario>> => {
        const route = `api/Autenticacion/getUsuarios`;
        return this.invocationService.invokeBackendService<ModelList<Usuario>, null>(this.invocationService.GET, this.url + route);
    }
    saveUser = (usuario: Usuario): Promise<GenericResponse<string>> => {
        const route = `api/Autenticacion/saveUser`;
        return this.invocationService.invokeBackendService<GenericResponse<string>, Usuario>
            (this.invocationService.POST, this.url + route, usuario);
    }
    editUsuario = (usuario: Usuario): Promise<GenericResponse<string>> => {
        const route = `api/Autenticacion/editUsuario`;
        return this.invocationService.invokeBackendService<GenericResponse<string>, Usuario>
            (this.invocationService.POST, this.url + route, usuario);
    }
    deleteUsuario = (id: string): Promise<GenericResponse<string>> => {
        const route = `api/Autenticacion/deleteUsuario?idusuario=${id}`;
        return this.invocationService.invokeBackendService<GenericResponse<string>, null>(this.invocationService.GET, this.url + route);
    };
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}