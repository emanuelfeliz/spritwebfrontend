import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { GenericResponse } from './../../../models/GenericResponse.model';
import { UsuarioAutenticado } from '../../../models/usuarios/UsuarioAutenticado.model';
import { GlobalEventsManager } from 'app/services/GlobalEventsManager.service';
import { PrintServiceService } from 'app/services/print-service.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { IframePrintService } from 'app/services/iframe-print.service';
import { ClientesFidelizadosService } from 'app/services/clientes-fidelizados.service';
import { ClienteFidelizado } from 'app/models/clientes-fidelizados/ClienteFidelizado.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  public responseAuth: GenericResponse<UsuarioAutenticado>;
  showNavBar = false;
  @ViewChild('iframe') iframe: ElementRef;

  openTurnosCurso = (): void => {
    this.printer.openNewTab('WebForms/TurnoCurso.aspx', 'Turnos en Curso');
  }
  openNuevosClientesFidelizados = (): void => {
    this.clientesFidelizadosService.getNuevosClientes().then(data => {
      if(data.Success){
        let tablaNuevosClientes: string = '';
        data.Response.forEach((clienteFidelizado: ClienteFidelizado) => {
          tablaNuevosClientes += `
            <tr>
              <td>${clienteFidelizado.codigo}</td>
              <td>${clienteFidelizado.nombres} ${clienteFidelizado.apellidos}</td>
              <td>${clienteFidelizado.cedula}</td>
              <td>${clienteFidelizado.pasaporte}</td>
              <td>${clienteFidelizado.tipo_cliente}</td>
              <td>${clienteFidelizado.fecha_fidelizacion}</td>
            </tr>
          `;
        });

        const template: string = `
          <style>
            table {
              border-collapse: collapse;
            }
          
            table, th, td {
              border: 1px solid black;
            }

            th, td {
              padding: 12px;
              text-align: center;
            }
          </style>
          <div>
            <h3 style="text-align: center;">Reporte de nuevos clientes fidelizados</h3>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Cédula</th>
                  <th>Pasaporte</th>
                  <th>Tipo de cliente</th>
                  <th>Fecha fidelización</th>
                </tr>
              </thead>
              <tbody>
                ${tablaNuevosClientes}
              </tbody>
            </table>
          </div>
        `;

        this.iframePrinter.imprimir(template, this.iframe);
      } else {
        this.popupProviderService.SimpleMessage('Advertencia', data.PossibleError, PopupType.WARNING);
      }
    }).catch(error => {
      this.popupProviderService.SimpleMessage('Error', 'No se pudo obtener los clientes fidelizados', PopupType.ERROR);
    });
  }
  constructor(private popupProviderService: PopupProviderService,
    private router: Router,
    private GlobalEventsManager: GlobalEventsManager, private printer: PrintServiceService, private iframePrinter: IframePrintService, private clientesFidelizadosService: ClientesFidelizadosService) {
    this.GlobalEventsManager.showNavBarEmitter.subscribe(
      (mode) => {
        this.showNavBar = mode;
        if (mode) {
          if (localStorage.getItem('currentUser') != null) {
            this.responseAuth = JSON.parse(localStorage.getItem('currentUser'));
            if (this.responseAuth.PossibleError != '') {
              this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
            }
          }
        }
      }
    );
  }
  CerrarSesion() {
    this.popupProviderService.QuestionMessage('Cerrando Sesion', 'Desea cerrar sesion?', PopupType.QUESTION, 'Si', 'No', () => {
      this.router.navigate(['/login']);
    }, () => { });
  }
  ngOnInit() {
  }
}
