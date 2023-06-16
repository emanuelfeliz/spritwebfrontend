import { Injectable } from '@angular/core';
import {CoinRate} from '../models/coinRate/coinRate.model';
import { ModelList } from 'app/models/ModelList.model';
import { InvocationService } from 'app/services/invocationService.service';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { environment } from 'environments/environment';
@Injectable()
export class CoinRatesService {

  private url:string;
  constructor(private invocationService:InvocationService,) {
    this.url=environment.Urls.Baseurl;
  }
  getCoinRates=(where:string):Promise<ModelList<CoinRate>>=>{
    let route:string=`api/CoinRates/getCoinRates?where=${where}`;
    return this.invocationService.invokeBackendService<ModelList<CoinRate>,null>(this.invocationService.GET, this.url+route);
  };
  editCoinRates=(coinrate:CoinRate):Promise<GenericResponse<CoinRate>>=>{
    let route:string=`api/CoinRates/editCoinRates`;
    return this.invocationService.invokeBackendService<GenericResponse<CoinRate>,CoinRate>(this.invocationService.POST, this.url+route,coinrate);
  };
  deleteCoinRate=(id:number):Promise<GenericResponse<CoinRate>>=>{
    let route:string=`api/CoinRates/deleteCoinRate?idCoinRate=${id}`;
    return this.invocationService.invokeBackendService<GenericResponse<CoinRate>,null>(this.invocationService.GET, this.url+route);
  };

}