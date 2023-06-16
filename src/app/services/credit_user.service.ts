import { Injectable } from "@angular/core";
import { GenericResponse } from "app/models/GenericResponse.model";
import { CreditUser } from "app/models/credit_user/credit_user.model";
import { DiscountByCategory } from "app/models/credit_user/discountByCategory.model";
import { InvocationService } from "./invocationService.service";
import { ModelList } from "app/models/ModelList.model";
import { Pago } from "app/models/pagos/Pago.model";
import { CreditUserDiscount } from "app/models/credit_user/creditUserDiscount.model";
import { environment } from 'environments/environment';


@Injectable()

export class CreditUserService {

    private url: string;

    constructor(private invocationService: InvocationService,) {
        this.url = environment.Urls.Baseurl;
    }

    getCreditUsers = (limit: number = 10, page: number = 0, rnc: string = ""): Promise<ModelList<CreditUser>> => {
        const route = `api/CreditUser/GetCreditsUser?page=${page}&limit=${limit}&rnc=${rnc}`;
        return this.invocationService.invokeBackendService<ModelList<CreditUser>, null>(this.invocationService.GET, this.url + route);
    }

    addNewCreditUser = (credit_user: CreditUser): Promise<GenericResponse<string>> => {
        const route = `api/CreditUser/PostCreditUser`;
        return this.invocationService.invokeBackendService<GenericResponse<string>, CreditUser>(this.invocationService.POST, this.url + route, credit_user);
    }

    editCreditUser = (credit_user: CreditUser): Promise<GenericResponse<string>> => {
        const route = `api/CreditUser/EditCreditUser`;
        return this.invocationService.invokeBackendService<GenericResponse<string>, CreditUser>(this.invocationService.POST, this.url + route, credit_user);
    }

    deleteCreditUser = (id: number): Promise<GenericResponse<string>> => {
        const route = `api/CreditUser/DeleteCreditUser?id=${id}`;
        return this.invocationService.invokeBackendService<GenericResponse<string>, CreditUser>(this.invocationService.GET, this.url + route);
    }

    searchCreditUser = (parameter: string): Promise<GenericResponse<string>> => {
        const route = `api/CreditUser/SearchCreditUser?search=${parameter}`;
        return this.invocationService.invokeBackendService<GenericResponse<string>, CreditUser>(this.invocationService.GET, this.url + route);
    }

    SearchCreditUserAndReturnsComplete = (parameter: string): Promise<GenericResponse<CreditUser>> => {
      const route = `api/CreditUser/SearchCreditUserAndReturnsComplete?search=${parameter}`;
      return this.invocationService.invokeBackendService<GenericResponse<CreditUser>,
      CreditUser>(this.invocationService.GET, this.url + route);
    }

    getCountedPayments = (fromDate: string, toDate: string, bombero: string, company_code: string, product: string, limit: number, page: number, discount_type: string): Promise<ModelList<Pago>> => {
        let route = `api/ListadoVentas/GetCountedPayments?fromDate=${fromDate}&toDate=${toDate}&bombero=${bombero}&company_code=${company_code}&product=${product}&limit=${limit}&page=${page}&paymentMethod=${discount_type}`;
        return this.invocationService.invokeBackendService<ModelList<Pago>, null>(this.invocationService.GET, this.url + route);
    }

    getCreditPayments = (fromDate: string, toDate: string, bombero: string, company_code: string, product: string, limit: number, page: number): Promise<ModelList<Pago>> => {
        let route = `api/ListadoVentas/GetCreditPayments?fromDate=${fromDate}&toDate=${toDate}&bombero=${bombero}&company_code=${company_code}&product=${product}&limit=${limit}&page=${page}`;
        return this.invocationService.invokeBackendService<ModelList<Pago>, null>(this.invocationService.GET, this.url + route);
    }

    exportCreditPaymentsToExcel = (): Promise<string> => {
        let route = 'api/ListadoVentas/ExportCreditPayments';
        return this.invocationService.invokeBackendService<string, null>(this.invocationService.GET, this.url + route);
      }

      exportCountedPaymentsToExcel = (): Promise<string> => {
        let route = 'api/ListadoVentas/ExportCountedPayments';
        return this.invocationService.invokeBackendService<string, null>(this.invocationService.GET, this.url + route);
      }

      getCreditUserById = (parameter: number): Promise<GenericResponse<CreditUser>> => {
        const route = `api/CreditUser/GetById?creditUserId=${parameter}`;
        return this.invocationService.invokeBackendService<GenericResponse<CreditUser>,
        CreditUser>(this.invocationService.GET, this.url + route);
    }

///DiscountCategories services

    getDiscountByCategorys = (limit: number, page: number): Promise<ModelList<DiscountByCategory>> => {
        const route = `api/DiscountByCategory/GetDiscountByCategorys?page=${page}&limit=${limit}`;
        return this.invocationService.invokeBackendService<ModelList<DiscountByCategory>, null>(this.invocationService.GET, this.url + route);
    }

    addNewDiscountByCategory = (discount_ByCategory: DiscountByCategory): Promise<GenericResponse<string>> => {
        const route = `api/DiscountByCategory/PostDiscountByCategory`;
        return this.invocationService.invokeBackendService<GenericResponse<string>, DiscountByCategory>(this.invocationService.POST, this.url + route, discount_ByCategory);
    }

    editDiscountByCategory = (discount_ByCategory: DiscountByCategory): Promise<GenericResponse<string>> => {
        const route = `api/DiscountByCategory/EditDiscountByCategory`;
        return this.invocationService.invokeBackendService<GenericResponse<string>, DiscountByCategory>(this.invocationService.POST, this.url + route, discount_ByCategory);
    }

    deleteDiscountByCategory = (id: number): Promise<GenericResponse<string>> => {
        const route = `api/DiscountByCategory/DeleteDiscountByCategory?id=${id}`;
        return this.invocationService.invokeBackendService<GenericResponse<string>, DiscountByCategory>(this.invocationService.GET, this.url + route);
    }

    searchDiscountByCategory = (parameter: string): Promise<GenericResponse<string>> => {
        const route = `api/DiscountByCategory/Get?SearchDiscountByCategory=${parameter}`;
        return this.invocationService.invokeBackendService<GenericResponse<string>, DiscountByCategory>(this.invocationService.GET, this.url + route);
    }

    getDiscountByCategoryId = (parameter: number): Promise<GenericResponse<DiscountByCategory>> => {
      const route = `api/DiscountByCategory/GetDiscountByCategoryById?id=${parameter}`;
      return this.invocationService.invokeBackendService<GenericResponse<DiscountByCategory>,
      CreditUser>(this.invocationService.GET, this.url + route);
  }

  getDiscountsByTurnoAndBombero = (turno: number, bombero:string): Promise<ModelList<CreditUserDiscount>> => {
    const route = `api/CreditUserDiscount/getDiscountsByTurnoAndBombero?turno=${turno}&bombero=${bombero}`;
    return this.invocationService.invokeBackendService<ModelList<CreditUserDiscount>, null>(this.invocationService.GET, this.url + route);
}
}
