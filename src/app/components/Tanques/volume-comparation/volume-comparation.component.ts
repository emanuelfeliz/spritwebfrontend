import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModelList } from 'app/models/ModelList.model';
import { TanqueModel } from 'app/models/Tanques/TanqueSelectModel.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';
import { HistorialTanque } from 'app/models/Tanques/HistorialTanque.model';
import { EstadoTanquesService } from 'app/services/estado-tanques.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { HelperServiceService } from '../../../services/helper-service.service';
import { Turno } from 'app/models/consulta-ventas/Turno.model';
import { ConsultaventasService } from 'app/services/consultaventas.service';

declare var $;
@Component({
  selector: 'app-volume-comparation',
  templateUrl: './volume-comparation.component.html'
})
export class VolumeComparationComponent implements OnInit {

  es: any;
  esLocale = require('date-fns/locale/es');
  total: number = 0;
  p: number = 1;
  loadingData: boolean = false;
  Tanks: Array<{}> = [];
  TanksSelected: string[];
  turnos: Array<Turno>;
  fechaDesde: string = '';
  fechaHasta: string = '';
  turnoInicial: number = 0;
  turnoFinal: number = 0;

  HistorialTanques: Array<HistorialTanque>;
  constructor(private HelperServiceService:HelperServiceService,
    private popupProviderService: PopupProviderService, public TanquesService: EstadoTanquesService,
    private router: Router, private consultaventasService: ConsultaventasService) {

  }
  private separarPorComas = (options: Array<string>): string => {
    return (options != undefined && options != null) ? options.join() : '0';
  }
  Limpiar = () => {
    this.HistorialTanques = new Array<HistorialTanque>();
  };

  getTurnos = () => {
    this.consultaventasService.getTurnos().then(
      result => {
        if (result.PossibleError == '') {
          this.turnos = result.List;
        }
      }
    );
  }

  ConsultarHistorial = (page: number = 0) => {
    this.p = page != 0 ? page : this.p;

    let Tanks: string = this.separarPorComas(this.TanksSelected);
    this.loadingData = true;
    this.TanquesService.getHistorialTanques(this.fechaDesde, this.fechaHasta, Tanks, this.p, 10).then(
      result => {
        if (result.PossibleError == '') {
          console.log(result.List);
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
        this.getTurnos();
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
