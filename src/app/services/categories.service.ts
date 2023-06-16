import { Injectable } from '@angular/core';
import { Category } from '../models/categorias/categoria.model';
import { ModelList } from 'app/models/ModelList.model';
import { InvocationService } from './invocationService.service';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { environment } from 'environments/environment';

@Injectable()
export class CategoriesService {
  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url = environment.Urls.Baseurl;
  }
  getCategories = (): Promise<ModelList<Category>> => {
    let route: string = `api/Categorias/getCategorias`;
    return this.invocationService.invokeBackendService<ModelList<Category>, null>(this.invocationService.GET, this.url + route);
  };
  addCategory = (category: Category): Promise<GenericResponse<Category>> => {
    let route: string = `api/Categorias/saveCategory?description=${category.description}&code=${category.code}`;
    return this.invocationService.invokeBackendService<GenericResponse<Category>, null>(this.invocationService.GET, this.url + route);
  };
  editCategory = (category: Category): Promise<GenericResponse<Category>> => {
    let route: string = `api/Categorias/editCategory?description=${category.description}&code=${category.code}&id=${category.id}`;
    return this.invocationService.invokeBackendService<GenericResponse<Category>, null>(this.invocationService.GET, this.url + route);
  };
  deleteCategory = (id: number): Promise<GenericResponse<Category>> => {
    let route: string = `api/Categorias/deleteCategory?idcategory=${id}`;
    return this.invocationService.invokeBackendService<GenericResponse<Category>, null>(this.invocationService.GET, this.url + route);
  };
}