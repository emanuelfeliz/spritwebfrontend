import { Injectable } from '@angular/core';
import { ScheduledPeriodReport } from '../models/scheduled_periods_reports/ScheduledPeriodReport.model';
import { InvocationService } from './invocationService.service';
import { GenericResponse } from '../models/GenericResponse.model';
import { ModelList } from '../models/ModelList.model';
import { ProccessedPeriodReport } from '../models/scheduled_periods_reports/ProccessedPeriodReport.model';
import { environment } from 'environments/environment';

@Injectable()
export class ScheduledPeriodsReportServiceService {

  private url:string;
  constructor(private invocationService: InvocationService,) {
    this.url=environment.Urls.Baseurl;
   }
  
  registerScheduledReport = (data: ScheduledPeriodReport): Promise<GenericResponse<string>> => {
    const route = `api/ScheduledPeriodsReports/saveScheduledPeriodReport`;
    return this.invocationService.invokeBackendService<GenericResponse<string>,ScheduledPeriodReport>
    (this.invocationService.POST, this.url + route, data);
  }

  getScheduledReportsPeriods = (limit: number, page: number): Promise<ModelList<ScheduledPeriodReport>> => {
    const route = `api/ScheduledPeriodsReports/getScheduledReportsPeriods?limit=${limit}&page=${page}`;
    return this.invocationService.invokeBackendService<ModelList<ScheduledPeriodReport>,null>
    (this.invocationService.GET, this.url + route);
  }
  getProccessedReportsPeriods = (limit: number, page: number): Promise<ModelList<ProccessedPeriodReport>> => {
    const route = `api/ScheduledPeriodsReports/getProccessedReportsPeriods?limit=${limit}&page=${page}`;
    return this.invocationService.invokeBackendService<ModelList<ProccessedPeriodReport>,null>
    (this.invocationService.GET, this.url + route);
  }  
}
