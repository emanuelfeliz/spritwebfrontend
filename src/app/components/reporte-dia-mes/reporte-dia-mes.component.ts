import { Component, OnInit } from '@angular/core';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { GenericResponse } from '../../models/GenericResponse.model';
import { PrintServiceService } from 'app/services/print-service.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { HelperServiceService } from '../../services/helper-service.service';
import { TurnosService } from '../../services/turnos.service';
import { ReporteMesInfo } from '../../models/reporte-mes/ReporteMesInfo.model';
@Component({
  selector: 'app-reporte-dia',
  templateUrl: './reporte-dia-mes.component.html'
})
export class ReporteDiaMesComponent implements OnInit {
  authData: {
    responseAuth: GenericResponse<UsuarioAutenticado>
  };
  infoReporteMes: {
    list: Array<ReporteMesInfo>,
    showLoading: boolean,
    total: number
  };
  constructor(private HelperServiceService: HelperServiceService,
    private popupProviderService: PopupProviderService,
    private turnosService: TurnosService,
    private printer: PrintServiceService) {

    this.authData = {
      responseAuth: null
    };
    this.infoReporteMes = {
      showLoading: false,
      list: [],
      total: 0
    };
    this.HelperServiceService.loadAuthInfo(this.authData, 'reporte_turno_periodo', () => {
      this.loadReportMonthInfo();
    });
  }
  loadReportMonthInfo = (): void => {
    this.HelperServiceService.loadModelList<ReporteMesInfo>(this.infoReporteMes, this.turnosService.loadReportMonthInfo())
      .catch(err => this.popupProviderService.SimpleMessage('Error al cargar informacion de reporte de mes', err, PopupType.ERROR));
  }
  ReporteMes = (rptInfo: ReporteMesInfo) => {
    this.printer.openNewTab(`WebForms/VentasDelMes.aspx?month=${rptInfo.mes_numero}&year=${rptInfo.ano_numero}`, 'Reporte de Mes');
  }
  ngOnInit() {

  }
}
