import { Injectable } from "@angular/core";
import { DashboardModel } from "../../models/listado-ventas/dashboardInfo";
import { Barchart } from "./barchart.model";
import { BaseService } from "app/commons/base.service";
import { BaseResponse } from "app/commons/base-response.model";
import { LineChart } from "./linechart.model";
import { environment } from "environments/environment";


@Injectable()
export class HomeService {

  private readonly URL_MICRO:string;
  constructor(private client: BaseService,) {
    this.URL_MICRO = environment.Urls.MicroDashboardApi;
  }


  GetDashBoardData(product: string, period: string) {
    const route = `/Dashboard/DashboardInfo?product=${product}&period=${period}`;
    return this.client.Get<BaseResponse<DashboardModel>>(this.URL_MICRO, route);
  }

  GetBarchartData() {
    const route = `/BarCharts/TotalSalesByDay`;
    return this.client.Get<BaseResponse<Barchart>>(this.URL_MICRO, route);
  }

  GetSalesByHour() {
    const route = `/LineCharts/GetSalesByHour`;
    return this.client.Get<BaseResponse<LineChart>>(this.URL_MICRO, route);
  }
  
}