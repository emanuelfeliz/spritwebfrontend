import { Component, OnInit } from '@angular/core';
import { TurnoCerrado } from '../../../models/turnos/TurnoCerrado.model';
import { UsuarioAutenticado } from '../../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { GenericResponse } from './../../../models/GenericResponse.model';
import { DialogService } from 'ng6-bootstrap-modal';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { TurnosService } from 'app/services/turnos.service';
import { HelperServiceService } from '../../../services/helper-service.service';
declare var require;
@Component({
  selector: 'app-cuadre',
  templateUrl: './insertar-cuadre.component.html'
})
export class InsertarCuadreComponent implements OnInit {
  loading: boolean = false;
  turnos: Array<TurnoCerrado>;
  total:number=0;
  p:number=1;
  fechaDesde: string;
  fechaHasta: string;
  constructor(private HelperServiceService:HelperServiceService,
    private popupProviderService: PopupProviderService,private dialogService: DialogService, 
    private TurnosService: TurnosService,private router: Router) {
    let responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError == '') {
      if (responseAuth.Response.insertar_cuadre == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.getTurnosCerrados();
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }
  }
  es: any;
  esLocale = require('date-fns/locale/es');
  
  cuadrar = (turno: TurnoCerrado) => {
    this.router.navigate(['/cuadrar_turno', turno.CloseId, '0', '','']);
  }
  Buscar(page:number=0) {
    this.p=page!=0 ? page:this.p;    
    if (this.fechaDesde == '' || this.fechaDesde == null || this.fechaDesde == undefined ||
      this.fechaHasta == null || this.fechaHasta == '' || this.fechaHasta == undefined) {
        this.getTurnosCerrados();
    } else {      
      this.TurnosService.getTurnosCerradosPaginated(this.fechaDesde, this.fechaHasta,0,10,this.p).then
        (
        result => {
          if (result.PossibleError == '') {
            this.total=result.TotalRecords;
            this.turnos = result.List;
          }
        }).catch(error => {
          this.popupProviderService.SimpleMessage('Insertar Cuadre', error, PopupType.ERROR);
        });
    }
  }
  ngOnInit() {
    this.es = this.HelperServiceService.getTimeConfiguration(this.esLocale);
  }
  getTurnosCerrados = (page:number=0) => {
    this.p=page!=0 ? page:this.p;    
    this.loading = true;
    this.TurnosService.getTurnosCerradosPaginated('','',0,10,this.p)
    .then(result => {
      if (result.PossibleError == '') {
        this.turnos = result.List;
        this.total=result.TotalRecords;
      }else{
        this.popupProviderService.SimpleMessage('Error consultando turnos cerrados', result.PossibleError, PopupType.ERROR);
        return;
      }
      this.loading = false;
    }).catch(error => {
      this.popupProviderService.SimpleMessage('Insertar Cuadre', error, PopupType.ERROR);
      this.loading = false;
    });
  }
}
