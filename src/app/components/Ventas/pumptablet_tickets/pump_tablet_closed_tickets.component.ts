import { Component, OnInit } from '@angular/core';
import { Deposito } from 'app/models/depositos/Deposito.model';
import { PrintServiceService } from 'app/services/print-service.service';
import { Router } from '@angular/router';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { PumptabletService } from 'app/services/pumptablet.service';
import { ClosedPumpTicket } from 'app/models/ticket/closed_pump_ticket';
import { AperturaTurnoBombero } from 'app/models/apertura_turno/apertura_turno_bombero.model';
import { ReporteRecibido } from 'app/models/ReportesGenerator/ReporteRecibido.model';
@Component({
  selector: 'app-pumptablet_tickets',
  templateUrl: './pump_tablet_closed_tickets.component.html'
})
export class PumptabletClosedTicketsComponent implements OnInit {
  loading = false;
  creando = false;
  mostrando = false;
  closed_pump_tickets: Array<ClosedPumpTicket>;
  Deposito: Deposito;
  total = 0;
  p = 1;
  responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
  constructor(private popupProviderService: PopupProviderService,
    private pumptabletService: PumptabletService, private router: Router,
    private printer: PrintServiceService) {
    if (this.responseAuth.PossibleError === '') {
      if (this.responseAuth.Response.depositos == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.Deposito = new Deposito('', '', 0, 0, '', '', '', 0);
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }
  }
  getClosedPumpTickets = (page: number = 0) => {
    this.loading = true;
    this.p = page !== 0 ? page : this.p;

    this.pumptabletService.getPumpClosedTickets(this.p, 10)
      .then(result => {
        if (result.PossibleError === '') {
          this.closed_pump_tickets = result.List;
          this.total = result.TotalRecords;
        }
        this.loading = false;
      })
      .catch(error => {
        this.popupProviderService.SimpleMessage('Depósitos', error, PopupType.ERROR);
        this.loading = false;
      });
  }

  printTicket = (cierreDispensador: AperturaTurnoBombero) => {
    this.printer.generateReporte(new ReporteRecibido('Reporte de Cierre de lados', '~/Reportes/CierreLados/rptCierreLados.rpt',
      'cierre_lados', false, null, null, JSON.stringify(cierreDispensador)), false);
  }

  ngOnInit() {
    this.getClosedPumpTickets(1);
  }

}
