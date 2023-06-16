import { TurnoPeriodo } from './../../models/turnos/TurnoPeriodo.model';
import { Component, OnInit } from '@angular/core';
import { PopupProviderService, PopupType } from '../../services/popupProvider.service';
import { TurnosService } from '../../services/turnos.service';
import { Router } from '@angular/router';
import { PrintServiceService } from '../../services/print-service.service';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { GenericResponse } from '../../models/GenericResponse.model';

@Component({
  selector: 'app-turnos-dias',
  templateUrl: './turnos-dias.component.html'
})
export class TurnosDiasComponent implements OnInit {
  loading: boolean = false;
  total: number = 0;
  p: number = 1;
  turnos: Array<TurnoPeriodo>;
  constructor(
    private popupProviderService: PopupProviderService,
    private TurnosService: TurnosService,
    private router: Router,
    private printer: PrintServiceService) {
    let responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError == '') {
      if(responseAuth.Response.reporte_turno_periodo){
        this.getTurnosDias();
      }else{
        this.router.navigate(['permisodenegado']);
      }      
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }    
  }
  reporteTurnoDiaBasado=(turnoDia:TurnoPeriodo):void=>{
    this.printer.openNewTab(`WebForms/TurnoDia.aspx?close_id=${turnoDia.close_id}&origen=BASADO`,'Reporte Dia Basado');
  }
  reporteTurnoDiaCuadreGeneral=(turnoDia:TurnoPeriodo):void=>{
    this.printer.openNewTab(`WebForms/VentasDelDiaGeneral.aspx?close_id=${turnoDia.close_id}`,'Reporte Dia en base Cuadre General');
  }

  reporteTurnoDiaCuadreAgrupado=(turnoDia:TurnoPeriodo):void=>{
    this.printer.openNewTab(`WebForms/VentasDelDiaAgrupado.aspx?close_id=${turnoDia.close_id}`,'Reporte Dia en base Cuadre Agrupado');
  }
  reporteTurnoDiaCalculado=(turnoDia:TurnoPeriodo):void=>{
    this.printer.openNewTab(`WebForms/TurnoDia.aspx?close_id=${turnoDia.close_id}&origen=CALCULADO`,'Reporte Dia Calculado');
  }
  getTurnosDias=(page:number=0)=>{
    this.p=page!=0 ? page:this.p;    
    this.loading = true;
    this.TurnosService.getTurnosDias(10,this.p)
    .then(result=>{
      this.loading = false;
      if (result.PossibleError == '') {
        this.turnos = result.List;
        this.total=result.TotalRecords;
      }
      else {
        this.popupProviderService.SimpleMessage('Error consultando turnos dias', result.PossibleError, PopupType.ERROR);
        return;
      }
    })
    .catch(error=>{
      this.loading=false;
      this.popupProviderService.SimpleMessage('Fallo al obtener data','No se pudieron obtener los turnos dias',PopupType.ERROR)
    });
  }

  ngOnInit() {
  }

}
