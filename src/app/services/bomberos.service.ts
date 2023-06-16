import { Injectable } from '@angular/core';
import {Bombero} from '../models/bomberos/bomberos.model';
import { ModelList } from 'app/models/ModelList.model';
import { InvocationService } from 'app/services/invocationService.service';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { environment } from 'environments/environment';
@Injectable()
export class BomberosService {

  private url:string;
  constructor(private invocationService:InvocationService,) {
    this.url=environment.Urls.Baseurl;
  }
  getBomberosByTurno=(turno:number):Promise<ModelList<Bombero>>=>{
    let route:string=`api/Bomberos/getBomberosByTurno?turno=${turno}`;
    return this.invocationService.invokeBackendService<ModelList<Bombero>,null>(this.invocationService.GET, this.url+route);
  };
  getBomberos=(where:string):Promise<ModelList<Bombero>>=>{
    let route:string=`api/Bomberos/getBomberos?where=${where}`;
    return this.invocationService.invokeBackendService<ModelList<Bombero>,null>(this.invocationService.GET, this.url+route);
  };
  addBombero=(bombero:Bombero):Promise<GenericResponse<Bombero>>=>{
    let route:string=`api/Bomberos/saveBombero`;
    return this.invocationService.invokeBackendService<GenericResponse<Bombero>,Bombero>(this.invocationService.POST, this.url+route,bombero);
  };
  editBombero=(bombero:Bombero):Promise<GenericResponse<Bombero>>=>{
    let route:string=`api/Bomberos/editBombero`;
    return this.invocationService.invokeBackendService<GenericResponse<Bombero>,Bombero>(this.invocationService.POST, this.url+route,bombero);
  };
  deleteBombero=(id:number):Promise<GenericResponse<Bombero>>=>{
    let route:string=`api/Bomberos/deleteBombero?idbombero=${id}`;
    return this.invocationService.invokeBackendService<GenericResponse<Bombero>,null>(this.invocationService.GET, this.url+route);
  };

}
