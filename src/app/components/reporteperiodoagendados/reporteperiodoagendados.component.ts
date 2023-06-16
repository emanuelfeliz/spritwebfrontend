import { Component, OnInit } from '@angular/core';
import { ScheduledPeriodsReportServiceService } from '../../services/scheduled-periods-report-service.service';
import { ProccessedPeriodReport } from '../../models/scheduled_periods_reports/ProccessedPeriodReport.model';
import { ScheduledPeriodReport } from '../../models/scheduled_periods_reports/ScheduledPeriodReport.model';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { GenericResponse } from '../../models/GenericResponse.model';
import { Router } from '@angular/router';
import { PopupProviderService, PopupType } from '../../services/popupProvider.service';
import { PrintServiceService } from '../../services/print-service.service';
import { HelperServiceService } from '../../services/helper-service.service';

@Component({
  selector: 'app-reporteperiodoagendados',
  templateUrl: './reporteperiodoagendados.component.html'
})
export class ReporteperiodoagendadosComponent implements OnInit {
  ReportsProccessed: {
    list: Array<ProccessedPeriodReport>,
    showLoading: boolean,
    total: number
  };
  ReportsScheduled: {
    list: Array<ScheduledPeriodReport>,
    showLoading: boolean,
    total: number
  };

  p_proccessed = 1;
  p_scheduled = 1;

  authData: {
    responseAuth: GenericResponse<UsuarioAutenticado>
  };

  constructor(private HelperServiceService: HelperServiceService,
    private printer: PrintServiceService, private popupProviderService: PopupProviderService,
    private router: Router, private ScheduledPeriodsReportServiceService: ScheduledPeriodsReportServiceService) {
    this.authData = {
      responseAuth: null
    };
    this.HelperServiceService.loadAuthInfo(this.authData, 'reporte_turno_periodo', () => {
      this.ReportsProccessed = {
        list: [],
        showLoading: false,
        total: 0
      };
      this.ReportsScheduled = {
        list: [],
        showLoading: false,
        total: 0
      };
      this.getScheduledReports();
      this.getProccessedReports();
    });
  }
  getScheduledReports = (page: number = 0): void => {
    this.p_scheduled = page !== 0 ? page : this.p_scheduled;
    this.HelperServiceService.loadModelList<ScheduledPeriodReport>(this.ReportsScheduled,
      this.ScheduledPeriodsReportServiceService.getScheduledReportsPeriods(10, this.p_scheduled))
      .catch(error => this.popupProviderService.SimpleMessage('Reportes agendados', error, PopupType.ERROR));
  }
  getProccessedReports = (page: number = 0): void => {
    this.p_proccessed = page !== 0 ? page : this.p_proccessed;
    this.HelperServiceService.loadModelList<ProccessedPeriodReport>(this.ReportsProccessed,
      this.ScheduledPeriodsReportServiceService.getProccessedReportsPeriods(10, this.p_proccessed))
      .catch(error => this.popupProviderService.SimpleMessage('Reportes Procesados', error, PopupType.ERROR));
  }
  visualizar = (scheduledPeriodsReport: ProccessedPeriodReport): void => {
    let urlReport = 'WebForms/TurnoPeriodoAgendado.aspx?id_scheduled_period_report';
    urlReport += `=${scheduledPeriodsReport.id_scheduled_period_report}&referenciaTurno=${scheduledPeriodsReport.reference_shift}`;
    urlReport += `&numTurnoDesde=${scheduledPeriodsReport.initial_shift}&numTurnoHasta=${scheduledPeriodsReport.final_shift}&startDate=`;
    urlReport += `${scheduledPeriodsReport.start_date}&endDate=${scheduledPeriodsReport.end_date}`;
    this.printer.openNewTab(urlReport, 'Reporte Periodo Agendado');
  }
  ngOnInit() {
  }

}
