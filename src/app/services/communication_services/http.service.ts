import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';


@Injectable()

//TODO: Create responses interfaces.
export class HttpService {

  /**Add token 'Authorization': 'my-auth-token' **/
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  private readonly url: string;

  constructor(private httpClient: HttpClient,) {
    this.url=environment.Urls.SmartApiUrl+ '/api/';
  }

  //TODO: refactor methods add controller parameter, object parameter
  Get<T>(urlApi: string = this.url, controller: string): Observable<T> {
    return this.httpClient.get<T>(urlApi + controller);
  }

  GetById<T>(urlApi: string = this.url, controller: string, id: number): Observable<T> {
    return this.httpClient.get<T>(urlApi + controller + `/${id}`);
  }

  Post<T, E>(urlApi: string = this.url, controller: string, element: E): Observable<T> {
    return this.httpClient.post<T>(urlApi + controller, element, this.httpOptions);
  }

  Put<T>(urlApi: string = this.url, controller: string, id: number, element: T): Observable<T> {

    if (id === 0) {
      return this.httpClient.put<T>(urlApi + controller, element, this.httpOptions);
    }
    return this.httpClient.put<T>(urlApi + controller + `/${id}`, element, this.httpOptions);
  }

  Delete<T>(urlApi: string = this.url, controller: string, id: number, element: T): Observable<T> {
    return this.httpClient.delete<T>(urlApi + controller + `/${id}`, element);
  }

  /** Error handler **/
  /*  private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('Ocurrio un error: ', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Error al intentar conectar con el Api ${error.status}, ` +
                `error: ${error.error}`);
        }
        // return an ErrorObservable with a user-facing error message
        return new ErrorObservable(
            'Algo esta saliendo mal por favor intentar mas tarde.');
    }*/
}
