import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GenericResponse } from "app/models/GenericResponse.model";
import { UsuarioAutenticado } from "app/models/usuarios/UsuarioAutenticado.model";
import { Observable } from "rxjs";

@Injectable()

export class BaseService {

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
        params: null
    };

    constructor(private httpClient: HttpClient) {
        const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(
            localStorage.getItem("currentUser")
        );
        this.httpOptions.headers.set("Username", responseAuth.Response.id_usuario);
        this.httpOptions.headers.set("Token", "TOKEN");
    }


  Get<T>(urlApi: string , controller: string): Observable<T> {
    var api = new URL(controller,urlApi); 
    return this.httpClient.get<T>(api.toString(),this.httpOptions);
  }

  GetById<T>(urlApi: string , controller: string, id: number,params:any=null): Observable<T> {
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    var api = new URL(controller,urlApi); 
    return this.httpClient.get<T>(`${api}?${queryString}` + `/${id}`,this.httpOptions);
  }

  Post<T, E>(urlApi: string , controller: string, element: E,params:any=null): Observable<T> {
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    var api = new URL(controller,urlApi); 
    return this.httpClient.post<T>(`${api}?${queryString}`, element, this.httpOptions);
  }

  Put<T>(urlApi: string , controller: string, id: number, element: T,params:any=null): Observable<T> {
    var api = new URL(controller,urlApi); 
    if (id === 0) {
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return this.httpClient.put<T>(`${api}?${queryString}`, element, this.httpOptions);
    }
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return this.httpClient.put<T>(`${api}?${queryString}` + `/${id}`, element, this.httpOptions);
  }

  Delete<T>(urlApi: string , controller: string, id: number, element: T,params:any=null): Observable<T> {
    var api = new URL(controller,urlApi); 
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return this.httpClient.delete<T>(`${api}?${queryString}` + `/${id}`,this.httpOptions);
  }
      
  
}