import { Injectable } from "@angular/core";
import { DiscountTktPlu } from "app/components/discount/discount-tkt-plu/discount-tkt-plu";
import { TktPluSelect } from "app/components/discount/discount-tkt-plu/tkt-plu";
import { DiscountClient } from "app/components/discount/discount_client/discount-client";
import { DiscountProductClient } from "app/components/discount/discount_product_client/discount-product-client";
import { WarehouseProduct } from "app/components/products/warehouse-product";
import { environment } from 'environments/environment';

import { GenericResponse } from "app/models/GenericResponse.model";
import { ModelList } from "app/models/ModelList.model";
import { InvocationService } from "./invocationService.service";

@Injectable()

export class DiscountProductClientService { 

    private url: string;
    constructor(private invocationService: InvocationService,) {
      this.url = environment.Urls.Baseurl;
    }

    getDiscountClients = (pagina: number, limite: number,search:string): Promise<ModelList<DiscountClient>> => {
        const route = `api/DiscountProductClient/getDiscountClients?page=${pagina}&limit=${limite}&search=${search}`;
        return this.invocationService.invokeBackendService<ModelList<DiscountClient>, null>(this.invocationService.GET, this.url + route);
      }
       
      saveDiscountClients = (discountClient: DiscountClient): Promise<GenericResponse<DiscountClient>> => {
        const route = `api/DiscountProductClient/saveDiscountClients`;
        return this.invocationService.
          invokeBackendService<GenericResponse<DiscountClient>, DiscountClient>(this.invocationService.POST, this.url + route, discountClient);
      }
      
      deleteDiscountClient = (discountClient: DiscountClient): Promise<GenericResponse<DiscountClient>> => {
        const route = `api/DiscountProductClient/deleteDiscountClient`;
        return this.invocationService.
          invokeBackendService<GenericResponse<DiscountClient>, DiscountClient>(this.invocationService.POST, this.url + route, discountClient);
      }

      getDiscountProductClients = (search:string): Promise<ModelList<DiscountProductClient>> => {
        const route = `api/DiscountProductClient/getDiscountProductClients?search=${search}`;
        return this.invocationService.invokeBackendService<ModelList<DiscountProductClient>, null>(this.invocationService.GET, this.url + route);
      }
      getAllProductsDiscount = (): Promise<ModelList<WarehouseProduct>> => {
        const route = `api/DiscountProductClient/getAllProductsDiscount`;
        return this.invocationService.invokeBackendService<ModelList<WarehouseProduct>, null>(this.invocationService.GET, this.url + route);
      }
      getAllDiscountClients = (): Promise<ModelList<DiscountClient>> => {
        const route = `api/DiscountProductClient/getAllDiscountClients`;
        return this.invocationService.invokeBackendService<ModelList<DiscountClient>, null>(this.invocationService.GET, this.url + route);
      }
        
      saveDiscountProductClients = (discountClient: DiscountProductClient): Promise<GenericResponse<DiscountProductClient>> => {
        const route = `api/DiscountProductClient/saveDiscountProductClients`;
        return this.invocationService.
          invokeBackendService<GenericResponse<DiscountProductClient>, DiscountProductClient>(this.invocationService.POST, this.url + route, discountClient);
      }
      
      deleteDiscountProductClient = (discountClient: DiscountProductClient): Promise<GenericResponse<DiscountProductClient>> => {
        const route = `api/DiscountProductClient/deleteDiscountProductClient`;
        return this.invocationService.
          invokeBackendService<GenericResponse<DiscountProductClient>, DiscountProductClient>(this.invocationService.POST, this.url + route, discountClient);
      }


      getDiscountTktPlus = (search:string): Promise<ModelList<DiscountTktPlu>> => {
        const route = `api/DiscountProductClient/getDiscountTktPlus?search=${search}`;
        return this.invocationService.invokeBackendService<ModelList<DiscountTktPlu>, null>(this.invocationService.GET, this.url + route);
      }

      saveDiscountTktPlu = (discount: DiscountTktPlu): Promise<GenericResponse<DiscountTktPlu>> => {
        const route = `api/DiscountProductClient/saveDiscountTktPlu`;
        return this.invocationService.
          invokeBackendService<GenericResponse<DiscountTktPlu>, DiscountTktPlu>(this.invocationService.POST, this.url + route, discount);
      }
      
      deleteDiscountTktPlu = (discount: DiscountTktPlu): Promise<GenericResponse<DiscountTktPlu>> => {
        const route = `api/DiscountProductClient/deleteDiscountTktPlu`;
        return this.invocationService.
          invokeBackendService<GenericResponse<DiscountTktPlu>, DiscountTktPlu>(this.invocationService.POST, this.url + route, discount);
      }

      getAllTktPlu = (): Promise<ModelList<TktPluSelect>> => {
        const route = `api/DiscountProductClient/getAllTktPluSelect`;
        return this.invocationService.invokeBackendService<ModelList<TktPluSelect>, null>(this.invocationService.GET, this.url + route);
      }

      
}