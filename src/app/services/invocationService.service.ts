import { Injectable } from '@angular/core';
import { RequestOptionsArgs } from '@angular/http/src/interfaces';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()

export class InvocationService {
    private url: string;
    public GET = 'get';
    public POST = 'post';
    public PUT = 'put';
    public DELETE = 'delete';
    public PATCH = 'patch';
    constructor(private http: HttpClient,) {
        this.url = environment.Urls.Baseurl;
    }

    public invokeBackendService = <T, X>
    (requestType: string, request: string, body: X= null, options: RequestOptionsArgs= null): Promise<T> => {
        if(requestType === 'post'){
            return this.postMethod<T,X>(request, body, options);
        } else if(requestType === 'get'){
            return this.getMethod<T>(request);
        }
    }

    private methodDispatcher=<T>(obs:Observable<Object>): Promise<T> => {
        return obs
        .pipe(catchError(this.handleError))
        .toPromise();
    }
    private getMethod = <T>(request: string): Promise<T> => {
        return this.methodDispatcher(this.http.get(request));
    }
    private postMethod = <T, X>(request: string, body: X, options: RequestOptionsArgs): Promise<T> => {
        return this.methodDispatcher(this.http.post(request, JSON.stringify(body)));
    }
    private handleError(error: HttpErrorResponse): Promise<any> {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return Promise.reject(
          'Something bad happened; please try again later.');
      };
}