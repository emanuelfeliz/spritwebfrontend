import { Component, OnInit } from '@angular/core';
import { EstadoTanquesService } from 'app/services/estado-tanques.service';
import { MovimientoTanque } from 'app/models/Tanques/MovimientoTanque.model';
import { Router } from '@angular/router';
import { ModelList } from 'app/models/ModelList.model';
import { TanqueModel } from 'app/models/Tanques/TanqueSelectModel.model';
import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { BomberosService } from 'app/services/bomberos.service';
import { Bombero } from 'app/models/bomberos/bomberos.model';
import { MedidaTanque } from 'app/models/Tanques/MedidaTanque.model';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { HelperServiceService } from 'app/services/helper-service.service';
declare var $;
@Component({
  selector: 'app-movimientos-tanques',
  templateUrl: './movimientos-tanques.component.html'
})
export class MovimientosTanquesComponent implements OnInit {

  total_movimientos: number = 0;
  total_medidas: number = 0;
  p_movimientos: number = 1;
  p_medidas: number = 1;
  loadingData: boolean = false;
  Tanks: Array<{}> = [];
  TanksSelected: string[];
  Bomberos: Array<{}> = [];
  BomberosSelected: string[];
  fechaDesde: string = "";
  fechaHasta: string = "";
  MovimientosTanques: Array<MovimientoTanque>;
  MedidasTanques: Array<MedidaTanque>;
  es: any;
  esLocale = require('date-fns/locale/es');
  constructor(private HelperServiceService: HelperServiceService,
    private popupProviderService: PopupProviderService, public TanquesService: EstadoTanquesService,
    private router: Router, private bomberosService: BomberosService) {

  }
  private separarPorComas = (options: Array<string>): string => {
    return (options != undefined && options != null) ? options.join() : "0";
  }
  Limpiar = () => {
    this.MovimientosTanques = new Array<MovimientoTanque>();
  };
  imprimir = (mov: any, obj: string): void => {
    if (obj === 'movimiento') {
      console.log(<MovimientoTanque>mov);
    } else if (obj === 'medida') {
      console.log(<MedidaTanque>mov);
    }
    this.popupProviderService.SimpleMessage('Movimientos de Tanques',
      'Funcionalidad no disponible', PopupType.WARNING);
  }
  ConsultarMedidas = (page: number = 0) => {
    this.p_medidas = page !== 0 ? page : this.p_medidas;
    const Tanks: string = this.separarPorComas(this.TanksSelected);
    const Bomberos: string = this.separarPorComas(this.BomberosSelected);
    this.loadingData = true;
    this.TanquesService.getMedidasTanque(this.fechaDesde, this.fechaHasta, Tanks, Bomberos, this.p_medidas, 10).then(
      result => {
        if (result.PossibleError === '') {
          this.MedidasTanques = result.List;
          this.total_medidas = result.TotalRecords;
          for (const prop in result.List) {
            const index = result.List.length == parseInt(prop) ? 0 : 1;
          }
          this.loadingData = false;
        } else {
          this.popupProviderService.SimpleMessage('Error consultando las medidas',
            result.PossibleError, PopupType.ERROR);
          return;
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Movimientos tanques', error, PopupType.ERROR);
      });

  }
  ConsultarMovimientos = (page: number = 0) => {
    this.p_movimientos = page != 0 ? page : this.p_movimientos;

    const Tanks: string = this.separarPorComas(this.TanksSelected);
    const Bomberos: string = this.separarPorComas(this.BomberosSelected);
    this.loadingData = true;

    this.TanquesService.getMovimientosTanques(this.fechaDesde, this.fechaHasta, Tanks, Bomberos, this.p_movimientos, 10).then(
      result => {
        if (result.PossibleError === '') {
          this.MovimientosTanques = result.List;
          this.total_movimientos = result.TotalRecords;
          this.loadingData = false;
        } else {
          this.popupProviderService.SimpleMessage('Error consultando los movimientos',
            result.PossibleError, PopupType.ERROR);
          return;
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Movimientos tanques', error, PopupType.ERROR);
      });

  }
  
  GetBomberos = () => {
    this.bomberosService.getBomberos('AND activo = true').then(
      result => {
        if (result.PossibleError === '') {
          result.List.forEach(x => {
            this.Bomberos = [...this.Bomberos, { id: x.id, name: x.name }];
          });
        }
      }
    ).catch(error => {
      console.log(error);
    });
  }
  GetTanques = () => {
    this.TanquesService.getTanques().then(
      result => {
        if (result.PossibleError === '') {
          result.List.forEach(x => {
            this.Tanks = [...this.Tanks, { id: x.id, name: x.name }];
          });
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Movimientos tanque', error, PopupType.ERROR);
      });
  }

  inicializarComponent = () => {
    this.es = this.HelperServiceService.getTimeConfiguration(this.esLocale);
    let responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem("currentUser"));
    if (responseAuth.PossibleError == "") {
      if (responseAuth.Response.movimientos_tanques == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.GetTanques();
        this.GetBomberos();
      }
    } else {
      this.popupProviderService.SimpleMessage("Sesion Fallida", "No se puedo obtener la sesión", PopupType.ERROR);
    }
  }
  ngOnInit() {
    this.inicializarComponent();
    this.ConsultarMedidas(1);
    this.ConsultarMovimientos(1);
  }

}
