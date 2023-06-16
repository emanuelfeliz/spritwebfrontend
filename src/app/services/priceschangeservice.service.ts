import { Injectable } from '@angular/core';
import { InvocationService } from 'app/services/invocationService.service';
import { PriceChange } from '../models/priceschanges/PriceChange.model';
import { ModelList } from '../models/ModelList.model';
import { PriceChangeModel } from '../models/priceschanges/PriceChangeModel.model';
import { GenericResponse } from '../models/GenericResponse.model';
import { PriceChangeDetail } from '../models/priceschanges/PriceChangeDetail.model';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PriceschangeserviceService {
  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  getCurrentsPricesChangesDetails = (PriceLevel:number): Promise<Array<PriceChangeDetail>> => {
    const route = `api/PriceChange/getCurrentsPricesChangesDetails?PriceLevel=${PriceLevel}`;
    return this.invocationService.invokeBackendService<Array<PriceChangeDetail>, null>
      (this.invocationService.GET, this.url + route);
  }
  getPricesChanges = (limit: number, page: number): Promise<ModelList<PriceChange>> => {
    const route = `api/PriceChange/GetPricesChanges?limit=${limit}&page=${page}`;
    return this.invocationService.invokeBackendService<ModelList<PriceChange>, null>
      (this.invocationService.GET, this.url + route);
  }
  SavePriceChange = (data: PriceChangeModel): Promise<GenericResponse<string>> => {
    const route = `api/PriceChange/SavePriceChange`;
    return this.invocationService.invokeBackendService<GenericResponse<string>, PriceChangeModel>
      (this.invocationService.POST, this.url + route, data);
  }
}
