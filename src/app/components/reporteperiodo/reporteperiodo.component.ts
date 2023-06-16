import { Component, OnInit } from '@angular/core';
import { TurnoCerrado } from '../../models/turnos/TurnoCerrado.model';
import { TurnosService } from '../../services/turnos.service';
import { ModelList } from '../../models/ModelList.model';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { GenericResponse } from '../../models/GenericResponse.model';
import { PrintServiceService } from 'app/services/print-service.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { ScheduledPeriodReport } from '../../models/scheduled_periods_reports/ScheduledPeriodReport.model';
import { HelperServiceService } from '../../services/helper-service.service';
import { ScheduledPeriodsReportServiceService } from '../../services/scheduled-periods-report-service.service';
declare var $, require;
@Component({
  selector: 'app-reporteperiodo',
  templateUrl: './reporteperiodo.component.html'
})
export class ReporteperiodoComponent implements OnInit {
  loading = false;
  numTurnoDesde: number;
  numTurnoHasta: number;
  fechaDesde: string;
  fechaHasta: string;
  tipoFiltro = 'turno';
  fechaDesdeTurno: string;
  fechaHastaTurno: string;
  total = 0;
  p_inicial = 1;
  turnosIniciales: Array<TurnoCerrado>;
  p_final = 1;
  referenciaTurnos = true;
  turnosFinales: Array<TurnoCerrado>;
  es: any;
  esLocale = require('date-fns/locale/es');
  constructor(private ScheduledPeriodsReportServiceService: ScheduledPeriodsReportServiceService,
    private HelperServiceService: HelperServiceService,
    private router: Router, private TurnosService: TurnosService, private printer: PrintServiceService,
    private popupProviderService: PopupProviderService) {
    const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem("currentUser"));
    if (responseAuth.PossibleError === '') {
      if (responseAuth.Response.reporte_turno_periodo === false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.getTurnosIniciales();
        this.getTurnosFinales();
      }
    } else {
      this.popupProviderService.SimpleMessage("Sesion Fallida",
        "No se puedo obtener la sesión",
        PopupType.ERROR);

    }
  }
  cambioFiltro() {
    if (this.tipoFiltro === "fecha") {
      $('.MI,.MF').removeClass('btn-primary');
    }
  }
  seleccionarTurno = (turno: TurnoCerrado, tipo: string) => {
    if (tipo === 'Inicial') {
      $('.MI').removeClass('btn-primary');
      $('.FI-' + turno.CloseId).addClass('btn-primary');
      this.fechaDesdeTurno = (turno.FechaInicial).replace("-", "").replace("-", "") + ' ' + (turno.HoraInicial).replace(':', '').replace(':', '');
      this.numTurnoDesde = turno.CloseId;
    } else if (tipo === 'Final') {
      $('.MF').removeClass('btn-primary');
      $('.FF-' + turno.CloseId).addClass('btn-primary');
      this.fechaHastaTurno = (turno.FechaFinal).replace('-', '').replace('-', '') + ' ' + (turno.HoraFinal).replace(':', '').replace(':', '');
      this.numTurnoHasta = turno.CloseId;
    }
  }
  getTurnosGeneral = (type: string, page: number = 0): void => {
    let pageNumber: number;
    if (type === 'Inicial') {
      this.p_inicial = page !== 0 ? page : this.p_inicial;
      pageNumber = this.p_inicial;
    } else if (type === 'Final') {
      this.p_final = page !== 0 ? page : this.p_final;
      pageNumber = this.p_final;
    }
    this.loading = true;
    this.TurnosService.getTurnosCerradosPaginated('', '', 0, 10, pageNumber)
      .then(result => {
        this.loading = false;
        if (result.PossibleError === '') {
          this.total = result.TotalRecords;
          if (type === 'Inicial') {
            this.turnosIniciales = result.List;
          } else if (type === 'Final') {
            this.turnosFinales = result.List;
          }
        } else {
          this.popupProviderService.SimpleMessage('Error consultando turnos periodos', result.PossibleError, PopupType.ERROR);
          return;
        }
      })
      .catch(error => {
        this.loading = false;
      });
  }
  getTurnosIniciales = (page: number = 0) => {
    this.getTurnosGeneral('Inicial', page);
  }
  getTurnosFinales = (page: number = 0) => {
    this.getTurnosGeneral('Final', page);
  }

  ngOnInit() {
    this.es = this.HelperServiceService.getTimeConfiguration(this.esLocale);
  }
  AgengarReportePeriodo = (): void => {
    this.ReportePeriodo().then(result => {
      this.referenciaTurnos = this.tipoFiltro === 'turno';
      const scheduledPeriodReport: ScheduledPeriodReport =
        new ScheduledPeriodReport(0, result[0] + ' ' + result[1], result[2] + ' ' + result[3],
          this.numTurnoDesde, this.numTurnoHasta, this.referenciaTurnos ? 'SI' : 'NO', '');
      this.ScheduledPeriodsReportServiceService.registerScheduledReport(scheduledPeriodReport)
        .then(data => {
          if (data.Success) {
            this.popupProviderService.SimpleMessage('Reporte periodo Agendado',
              'Se agendo un reporte periodo', PopupType.SUCCESS);
          } else {
            this.popupProviderService.SimpleMessage('Reporte periodo Agendado',
              'No se agendo un reporte periodo', PopupType.WARNING);
          }
        })
        .catch(error => {
          this.popupProviderService.SimpleMessage('Reporte periodo Agendado',
            error, PopupType.ERROR);
        });
    }).catch(error => { });
  }
  ReporteperiodoCalculado = (): void => {
    this.ReportePeriodo().then(result => {
      this.printer.openNewTab
        (`WebForms/TurnoPeriodo.aspx?numTurnoDesde=${this.numTurnoDesde}&numTurnoHasta=${this.numTurnoHasta}&origen=CALCULADO`, 'Reporte Periodo Calculado');
    }).catch();
  }
  ReporteperiodoBasado = (): void => {
    this.ReportePeriodo().then(result => {
      this.printer.openNewTab
        (`WebForms/TurnoPeriodo.aspx?numTurnoDesde=${this.numTurnoDesde}&numTurnoHasta=${this.numTurnoHasta}&origen=BASADO`, 'Reporte Periodo Basado');
    }).catch();
  }
  ReportePeriodo = (): Promise<Array<string>> => {
    let fd: string;
    let hd: string;
    let fh: string;
    let hh: string;
    return new Promise((resolve, reject) => {
      if (this.tipoFiltro === 'fecha') {
        if (this.fechaDesde === '' || this.fechaDesde == null || this.fechaDesde === undefined ||
          this.fechaHasta == null || this.fechaHasta === '' || this.fechaHasta === undefined) {
          this.popupProviderService.SimpleMessage('Reporte Periodo',
            'Debe introducir los rangos de tiempo',
            PopupType.WARNING);
          reject();
          return;
        }
        if (this.fechaDesde > this.fechaHasta) {
          this.popupProviderService.SimpleMessage('Reporte Periodo',
            'La fecha final debe ser mayor a la inicial',
            PopupType.WARNING);
          reject();
          return;
        }
      } else if (this.tipoFiltro === 'turno') {
        if (this.fechaDesdeTurno === '' || this.fechaDesdeTurno == null ||
          this.fechaDesdeTurno === undefined || this.fechaHastaTurno == null ||
          this.fechaHastaTurno === '' || this.fechaHastaTurno === undefined) {
          this.popupProviderService.SimpleMessage('Reporte Periodo',
            'Debe seleccionar los rangos de turnos',
            PopupType.WARNING);
          reject();
          return;
        }
        if (this.fechaDesdeTurno > this.fechaHastaTurno) {
          this.popupProviderService.SimpleMessage('Reporte Periodo',
            'El turno final debe ser mayor al inicial',
            PopupType.WARNING);
          reject();
          return;
        }
      }
      fd = this.tipoFiltro === 'fecha' ? this.fechaDesde.substr(0, 8) : this.fechaDesdeTurno.substr(0, 8);
      hd = this.tipoFiltro === 'fecha' ? this.fechaDesde.substr(9, 14) : this.fechaDesdeTurno.substr(9, 14);
      fh = this.tipoFiltro === 'fecha' ? this.fechaHasta.substr(0, 8) : this.fechaHastaTurno.substr(0, 8);
      hh = this.tipoFiltro === 'fecha' ? this.fechaHasta.substr(9, 14) : this.fechaHastaTurno.substr(9, 14);
      resolve([fd, hd, fh, hh]);
    });
  }

}
