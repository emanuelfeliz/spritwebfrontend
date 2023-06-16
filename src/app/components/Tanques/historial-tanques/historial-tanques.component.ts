import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';
import { HistorialTanque } from 'app/models/Tanques/HistorialTanque.model';
import { EstadoTanquesService } from 'app/services/estado-tanques.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { HelperServiceService } from '../../../services/helper-service.service';
@Component({
  selector: 'app-historial-tanques',
  templateUrl: './historial-tanques.component.html'
})
export class HistorialTanquesComponent implements OnInit {

  es: any;
  esLocale = require('date-fns/locale/es');
  total: number = 0;
  p: number = 1;
  loadingData: boolean = false;
  Tanks: Array<{}> = [];
  TanksSelected: string[];
  fechaDesde: string = '';
  fechaHasta: string = '';
  HistorialTanques: Array<HistorialTanque>;
  constructor(private HelperServiceService:HelperServiceService,
    private popupProviderService: PopupProviderService, public TanquesService: EstadoTanquesService,
    private router: Router) {

  }
  private separarPorComas = (options: Array<string>): string => {
    return (options != undefined && options != null) ? options.join() : '0';
  }
  Limpiar = () => {
    this.HistorialTanques = new Array<HistorialTanque>();
  };

  ConsultarHistorial = (page: number = 0) => {
    this.p = page != 0 ? page : this.p;

    let Tanks: string = this.separarPorComas(this.TanksSelected);
    this.loadingData = true;
    this.TanquesService.getHistorialTanques(this.fechaDesde, this.fechaHasta, Tanks, this.p, 10).then(
      result => {
        if (result.PossibleError == '') {
          this.HistorialTanques = result.List;
          this.total = result.TotalRecords;
          this.loadingData = false;
        } else {
          this.popupProviderService.SimpleMessage('Error consultando historial',
            result.PossibleError, PopupType.ERROR);
          return;
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Historial tanque', error, PopupType.ERROR);
      });

  }
  GetTanques = () => {
    this.TanquesService.getTanques().then(
      result => {
        if (result.PossibleError === '') {
          result.List.forEach(x=>{
            this.Tanks= [...this.Tanks, x];
          });
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Historial tanque', error, PopupType.ERROR);
      });
  }

  inicializarComponent = () => {
    this.es = this.HelperServiceService.getTimeConfiguration(this.esLocale);
    const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError == '') {
      if (responseAuth.Response.historial_tanques == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.GetTanques();
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión',PopupType.ERROR);
    }
  }
  ngOnInit() {
    this.inicializarComponent();
    this.ConsultarHistorial(1);
  }

}
