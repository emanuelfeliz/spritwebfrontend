import { Injectable } from '@angular/core';
import { Entry } from '../models/ingresos/entry.model';
import { ModelList } from 'app/models/ModelList.model';
import { InvocationService } from 'app/services/invocationService.service';
import { Inventario } from 'app/models/inventario/inventario.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { environment } from 'environments/environment';

@Injectable()
export class EntryService {
  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  getEntries = (): Promise<ModelList<Entry>> => {
    const route = `api/Entries/getEntries`;
    return this.invocationService.invokeBackendService<ModelList<Entry>, null>(this.invocationService.GET, this.url + route);
  };
  getInventario = (): Promise<ModelList<Inventario>> => {
    const route = `api/Entries/getInventario`;
    return this.invocationService.invokeBackendService<ModelList<Inventario>, null>(this.invocationService.GET, this.url + route);
  };
  addEntry = (entry: Entry): Promise<GenericResponse<Entry>> => {
    let route: string = `api/Entries/saveEntry?json=${JSON.stringify(entry)}`;
    return this.invocationService.invokeBackendService<GenericResponse<Entry>, null>(this.invocationService.GET, this.url + route);
  };
  cancelEntry = (entry: Entry): Promise<GenericResponse<Entry>> => {
    let route: string = `api/Entries/cancelEntry?json=${JSON.stringify(entry)}`;
    return this.invocationService.invokeBackendService<GenericResponse<Entry>, null>(this.invocationService.GET, this.url + route);
  };
}