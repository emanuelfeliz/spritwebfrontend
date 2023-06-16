import { Component, OnInit } from '@angular/core';
import { TurnoCerrado } from '../../models/turnos/TurnoCerrado.model';
import { TurnosService } from '../../services/turnos.service';
import { GenericResponse } from '../../models/GenericResponse.model';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { PrintServiceService } from 'app/services/print-service.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { ExportFormatType } from 'app/commons/base-response.model';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html'
})
export class TurnosComponent implements OnInit {
  loading: boolean = false;
  total:number=0;
  p:number=1;
  turnos: Array<TurnoCerrado>;
  constructor(private popupProviderService: PopupProviderService, 
    private TurnosService: TurnosService, private router: Router, private printer: PrintServiceService) {
    let responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError == '') {
      if (responseAuth.Response.reporte_turno_cerrados == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.getTurnosCerrados();
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }

  }
  reporteTurnoCerradoCalculated = (turnoCerrado: TurnoCerrado): void => {
    this.printer.openNewTab(`WebForms/TurnoCerrado.aspx?close_id=${turnoCerrado.CloseId}&origen=CALCULADO`, 'Turno Cerrado Calculado');
  }
  reporteTurnoCerradoBasedExcel = (turnoCerrado: TurnoCerrado): void => {
    this.printer.openNewTab(`WebForms/TurnoCerradoExportTypeFile.aspx?close_id=${turnoCerrado.CloseId}&origen=BASADO&exportType=${ExportFormatType.Excel}`, 'Turno Cerrado Basado');
  }

  reporteTurnoCerradoBasedPdf = (turnoCerrado: TurnoCerrado): void => {
    this.printer.openNewTab(`WebForms/TurnoCerradoExportTypeFile.aspx?close_id=${turnoCerrado.CloseId}&origen=BASADO&exportType=${ExportFormatType.PortableDocFormat}`, 'Turno Cerrado Basado');
  }

  reporteTurnoCerradoBasedView = (turnoCerrado: TurnoCerrado): void => {
    this.printer.openNewTab(`WebForms/TurnoCerrado.aspx?close_id=${turnoCerrado.CloseId}&origen=BASADO`, 'Turno Cerrado Basado');
  }

  getTurnosCerrados = (page:number=0) => {
    this.p=page!=0 ? page:this.p;    
    this.loading = true;
    this.TurnosService.getTurnosCerradosPaginated('','',0,10,this.p)
    .then(result=>{
      this.loading = false;
      if (result.PossibleError == '') {
        this.turnos = result.List;
        this.total=result.TotalRecords;
      }
      else {
        this.popupProviderService.SimpleMessage('Error consultando turnos cerrados', result.PossibleError, PopupType.ERROR);
        return;
      }
    })
    .catch(error=>{
      this.loading=false;
      this.popupProviderService.SimpleMessage('Fallo al obtener data','No se pudieron obtener los turnos cerrados',PopupType.ERROR)
    });
  }
  ngOnInit() {
  }

}
