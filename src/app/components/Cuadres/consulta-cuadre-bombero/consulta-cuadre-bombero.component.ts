import { Component, OnInit } from '@angular/core';
import { Turno } from 'app/models/consulta-ventas/Turno.model';
import { CuadresService } from 'app/services/cuadre.service';
import { Router } from '@angular/router';
import { Cuadre } from 'app/models/cuadres/cuadre.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';
import { PrintServiceService } from 'app/services/print-service.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { HelperServiceService } from '../../../services/helper-service.service';
declare var  require;
@Component({
  selector: 'app-consulta-cuadre-bombero',
  templateUrl: './consulta-cuadre-bombero.component.html'
})

export class ConsultaCuadreBomberosComponent implements OnInit {
  p: number = 1;
  total: number = 0;
  tipoFiltro: string = 'turno';
  loadingData: boolean = false;
  Bomberos: Array<{}> = [];
  BomberosSelected: Array<string>;
  fechaDesde: string = '';
  fechaHasta: string = '';
  turnoInicial: number = 0;
  turnoFinal: number = 0;
  turnos: Array<Turno>;
  Cuadres: Array<Cuadre>;
  responseAuth: GenericResponse<UsuarioAutenticado>;

  es: any;
  esLocale = require('date-fns/locale/es');
  constructor(private HelperServiceService: HelperServiceService, private popupProviderService: PopupProviderService, private cuadreService: CuadresService, private router: Router,
    private printer: PrintServiceService, ) {
  }

  imprimir = (cuadre: Cuadre) => {
    this.printer.openNewTab(`WebForms/CuadreBomberoByBombero.aspx?id=${cuadre.id}`, 'Cuadre');
  }

  private separarPorComas = (options: Array<string>): string => {
    return (options != undefined && options != null) ? options.join() : '0';
  }

  ConsultarCuadres = (page: number = 0) => {
    this.p = page !== 0 ? page : this.p;
    const Bomberos: string = this.separarPorComas(this.BomberosSelected);
    this.loadingData = true;

    this.cuadreService.getCuadre(this.fechaDesde, this.fechaHasta,
      this.turnoInicial, this.turnoFinal, Bomberos, 5, this.p, this.responseAuth.Response.id_usuario).then(
        result => {
          if (result.cuadres.PossibleError == '') {
            this.Cuadres = result.cuadres.List;
            this.loadingData = false;
            this.total = result.cuadres.TotalRecords;
          } else {
            this.popupProviderService.SimpleMessage('Error consultando cuadres', result.cuadres.PossibleError, PopupType.ERROR);
            return;
          }
        }).catch(error => {
          this.popupProviderService.SimpleMessage('Consulta cuadre', error, PopupType.ERROR);
        });
  }

  inicializarComponent = () => {
    this.es = this.HelperServiceService.getTimeConfiguration(this.esLocale);
    this.responseAuth = JSON.parse(localStorage.getItem('currentUser'));
    if (this.responseAuth.PossibleError == '') {
      if (this.responseAuth.Response.is_bombero == false) {
        this.router.navigate(['permisodenegado']);
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }
  }

  ngOnInit() {
    this.inicializarComponent();
    this.ConsultarCuadres();
  }
}
