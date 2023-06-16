import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GenericResponse } from '../../../models/GenericResponse.model';
import { VentasService } from '../../../services/ventas.service';
import { EstadoTanquesService } from '../../../services/estado-tanques.service';
import { EstadoTanque } from '../../../models/Tanques/EstadoTanque.model';
import { DialogService } from "ng6-bootstrap-modal";
import { UsuarioAutenticado } from '../../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { VentaModalComponent } from '../../Ventas/listado-ventas/modals/Venta/venta_modal.component';
import { TankDesign } from 'app/models/Tanques/TankDesign.model';
import { RespuestaAutenticacionBombero } from 'app/modalsGenerales/RespuestaAutenticacionBombero.model';
import { MovimientoTanqueModalComponent } from 'app/components/Tanques/modals/MovimientoTanque.component';
import { MovimientoTanque } from 'app/models/Tanques/MovimientoTanque.model';
import { MedidaTanque } from 'app/models/Tanques/MedidaTanque.model';
import { MedidaTanqueModalComponent } from 'app/components/Tanques/modals/MedidaTanque.component';
import { AutenticadorBomberosService } from 'app/services/autenticador-bomberos.service';
import { AutenticadorFirmantesService } from 'app/services/autenticador-firmantes.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { HelperServiceService } from '../../../services/helper-service.service';
import { environment } from 'environments/environment';
declare var require,
  liquidFillGaugeDefaultSettings,
  loadLiquidFillGauge;
@Component({
  selector: 'app-estado-tanques',
  templateUrl: './estado-tanques.component.html'
})
export class EstadotanquesComponent implements OnInit, AfterViewInit {
  private animacion0: any = liquidFillGaugeDefaultSettings();
  private animacion1: any = liquidFillGaugeDefaultSettings();
  private animacion2: any = liquidFillGaugeDefaultSettings();
  private animacion3: any = liquidFillGaugeDefaultSettings();
  private animacion4: any = liquidFillGaugeDefaultSettings();
  private animacion5: any = liquidFillGaugeDefaultSettings();
  private MODAL_AUTENTICACION_BOMBEROS: any;
  private MODAL_MOVIMIENTO_TANQUE: any;
  public EstadoTanques: EstadoTanque[];
  public tempEstadoTanques: EstadoTanque[];
  private movimientoTanque: MovimientoTanque;
  private MODAL_VENTA: any;
  private MODAL_MEDIDA_TANQUE: any;
  private responseAuth: GenericResponse<UsuarioAutenticado>;
  public showBigTanks = false;
  public firstTime: boolean = false;
  public updateTanksTimer: boolean = true;
  updateTanksTime = 3;

  constructor(private HelperServiceService: HelperServiceService, private popupProviderService: PopupProviderService, private autenticadorFirmantesService: AutenticadorFirmantesService,
    private EstadoTanquesService: EstadoTanquesService, private autenticadorBombero: AutenticadorBomberosService,
    private VentasService: VentasService, private router: Router, private dialogService: DialogService) {
    this.responseAuth = JSON.parse(localStorage.getItem('currentUser'));
    if (this.responseAuth.PossibleError === '') {
      if (this.responseAuth.Response.estado_tanques === false) {
        this.router.navigate(['permisodenegado']);
      } else {

        this.EstadoTanquesService.useTimerForUpdateTanks()
          .then(result => {
            this.updateTanksTimer = result;

            if (this.updateTanksTimer) {
              setInterval(() => this.getTanques(), this.updateTanksTime * 1000);
            } else {
              this.getTanques()
            }
          }).catch(error => {
            console.log(error);
          });

        this.inicializarConfiguraciones();

        this.movimientoTanque = new MovimientoTanque("", 0, 0, "", "", 0, 0, 0, "0", "", false, "");
      }
    } else {
      this.popupProviderService.SimpleMessage("Sesion Fallida", "No se puedo obtener la sesión", PopupType.ERROR);
    }
  }

  buildAnimation = (animacion: any, circleColor: string, textColor: string, waveTextColor: string, waveColor: string): any => {
    animacion.circleColor = circleColor.includes("#") ? circleColor : `#${circleColor}`;
    animacion.textColor = textColor.includes("#") ? textColor : `#${textColor}`;
    animacion.waveTextColor = waveTextColor.includes("#") ? waveTextColor : `#${waveTextColor}`;
    animacion.waveColor = waveColor.includes("#") ? waveColor : `#${waveColor}`;
    return animacion;
  }
  inicializarConfiguraciones = () => {
    this.animacion1.circleThickness = 0.2;
    this.animacion1.textVertPosition = 0.2;
    this.animacion1.waveAnimateTime = 1000;

    this.animacion2.circleThickness = 0.1;
    this.animacion2.circleFillGap = 0.2;
    this.animacion2.textVertPosition = 0.8;
    this.animacion2.waveAnimateTime = 2000;
    this.animacion2.waveHeight = 0.3;
    this.animacion2.waveCount = 1;

    this.animacion3.textVertPosition = 0.8;
    this.animacion3.waveAnimateTime = 5000;
    this.animacion3.waveHeight = 0.15;
    this.animacion3.waveAnimate = false;
    this.animacion3.waveOffset = 0.25;
    this.animacion3.valueCountUp = false;
    this.animacion3.displayPercent = false;

    this.animacion4.circleThickness = 0.15;
    this.animacion4.textVertPosition = 0.8;
    this.animacion4.waveAnimateTime = 1000;
    this.animacion4.waveHeight = 0.05;
    this.animacion4.waveAnimate = true;
    this.animacion4.waveRise = false;
    this.animacion4.waveHeightScaling = false;
    this.animacion4.waveOffset = 0.25;
    this.animacion4.textSize = 0.75;
    this.animacion4.waveCount = 3;

    this.animacion5.circleThickness = 0.4;
    this.animacion5.textVertPosition = 0.52;
    this.animacion5.waveAnimateTime = 5000;
    this.animacion5.waveHeight = 0;
    this.animacion5.waveAnimate = false;
    this.animacion5.waveCount = 2;
    this.animacion5.waveOffset = 0.25;
    this.animacion5.textSize = 1.2;
    this.animacion5.minValue = 30;
    this.animacion5.maxValue = 150
    this.animacion5.displayPercent = false;
  }

  verVenta = (sale_id: number) => {
    this.VentasService.getVentaById(sale_id).then(
      result => {
        if (result.PossibleError == "") {
          this.MODAL_VENTA = this.dialogService.addDialog(VentaModalComponent, {
            ventaRecibidaSistema: result.Response,
            ventaRecibidaFabricada: null
          })
            .subscribe(result => {
              this.MODAL_VENTA.unsubscribe();
            });
        }
      }
    ).catch(error => {
      this.popupProviderService.SimpleMessage('Estado de tanque', error, PopupType.ERROR);
    });
  }

  registrarMedida = (estadoTanque: EstadoTanque) => {
    this.MODAL_AUTENTICACION_BOMBEROS = this.autenticadorBombero.requestBomberoAutentication("Medida Tanque", (returnResult: RespuestaAutenticacionBombero): void => {
      let medidaTanque: MedidaTanque = new MedidaTanque(estadoTanque.id, estadoTanque.producto, estadoTanque.actualVolume, 0, "",
        returnResult.bombero.id_bombero, returnResult.bombero.bombero, 0);
      this.MODAL_MEDIDA_TANQUE = this.dialogService.addDialog(MedidaTanqueModalComponent, {
        dataRecibida: medidaTanque
      }).subscribe(result => {
        if (result.Success) {
          this.MODAL_MEDIDA_TANQUE.unsubscribe();
          this.getTanques();
          this.popupProviderService.SimpleMessage("Medidas de tanque", "La medida de tanque fue registrada", PopupType.SUCCESS);
        } else {
          this.MODAL_MEDIDA_TANQUE.unsubscribe();
          this.popupProviderService.SimpleMessage("Medidas de tanque", result.PossibleError, PopupType.ERROR);
        }
      });
    }, () => {

    }, { idBombero: 0 });

  }
  updateVolume = (EstadoTanque: EstadoTanque, volumenEditable: number, aumentando: boolean) => {
    if (volumenEditable == null || volumenEditable == 0) {
      this.popupProviderService.SimpleMessage("Movimientos de tanque", "Debe introducir el valor", PopupType.WARNING);
      return;
    }
    if (aumentando) {
      this.autenticadorFirmantesService.requestFirmanteAutentication
        (this.responseAuth.Response.ingresar_combustible, "No tiene permisos para ingresar combustible",
          "Estado de Tanques", () => {
            this.performUpdateVolume(EstadoTanque, volumenEditable, aumentando);
          }, { permisoRecibido: "ingresar_combustible" });
    } else {
      this.autenticadorFirmantesService.requestFirmanteAutentication
        (this.responseAuth.Response.egresar_combustible, "No tiene permisos para egresar combustible",
          "Estado de Tanques", () => {
            this.performUpdateVolume(EstadoTanque, volumenEditable, aumentando);
          }, { permisoRecibido: "egresar_combustible" });
    }
  }
  performUpdateVolume = (EstadoTanque: EstadoTanque, volumenEditable: number, aumentando: boolean) => {
    this.MODAL_AUTENTICACION_BOMBEROS = this.autenticadorBombero.requestBomberoAutentication
      ("Estado de Tanques", (returnResult: RespuestaAutenticacionBombero): void => {
        this.MODAL_AUTENTICACION_BOMBEROS.unsubscribe();
        this.movimientoTanque.bombero = returnResult.bombero.bombero;
        this.movimientoTanque.id_bombero = returnResult.bombero.id_bombero;
        this.movimientoTanque.id_tanque = EstadoTanque.id;
        this.movimientoTanque.aumentando = aumentando;
        this.movimientoTanque.producto = EstadoTanque.producto;
        this.movimientoTanque.volumen_movimiento = aumentando ? volumenEditable : volumenEditable * -1;
        this.MODAL_MOVIMIENTO_TANQUE = this.dialogService.addDialog(MovimientoTanqueModalComponent, {
          dataRecibida: this.movimientoTanque
        }).subscribe(result => {
          if (result == "Exito") {
            this.MODAL_MOVIMIENTO_TANQUE.unsubscribe();
            this.getTanques();
            this.popupProviderService.SimpleMessage("Movimientos de tanque", "El movimiento del tanque fue registrado", PopupType.SUCCESS);
          } else if (result == "") {
            this.MODAL_MOVIMIENTO_TANQUE.unsubscribe();
            this.popupProviderService.SimpleMessage
              ("Movimientos de tanque", "Error al registrar un movimiento en el tanque", PopupType.ERROR);
          }
        });
      }, () => {

      }, { idBombero: 0 });
  }

  RenderizarTanques = () => {
    if (this.EstadoTanques != null) {
      for (let i = 0; i < this.EstadoTanques.length; i++) {
        let AnimacionTanque: any = this.animacion0;
        if (this.EstadoTanques[i]['tankDesign']) {
          let TankDesign: TankDesign = this.EstadoTanques[i]['tankDesign'];
          if (TankDesign.circleColor != "" && TankDesign.textColor != "" && TankDesign.waveColor != "" && TankDesign.waveTextColor != ""
            && (TankDesign.silhouette != undefined || TankDesign.silhouette != null)) {
            switch (TankDesign.silhouette) {
              case 1:
                AnimacionTanque = this.buildAnimation(this.animacion1, TankDesign.circleColor, TankDesign.textColor, TankDesign.waveTextColor, TankDesign.waveColor);
                break;
              case 2:
                AnimacionTanque = this.buildAnimation(this.animacion2, TankDesign.circleColor, TankDesign.textColor, TankDesign.waveTextColor, TankDesign.waveColor);
                break;
              case 3:
                AnimacionTanque = this.buildAnimation(this.animacion3, TankDesign.circleColor, TankDesign.textColor, TankDesign.waveTextColor, TankDesign.waveColor);
                break;
              case 4:
                AnimacionTanque = this.buildAnimation(this.animacion4, TankDesign.circleColor, TankDesign.textColor, TankDesign.waveTextColor, TankDesign.waveColor);
                break;
              case 5:
                AnimacionTanque = this.buildAnimation(this.animacion5, TankDesign.circleColor, TankDesign.textColor, TankDesign.waveTextColor, TankDesign.waveColor);
                break;
              case 0:
              default:
                AnimacionTanque = this.animacion0;
                break;
            }
          }

        }
        this.EstadoTanques[i].tanque3D.gauge = loadLiquidFillGauge(this.EstadoTanques[i].tanque3D.id, this.EstadoTanques[i].lleno, AnimacionTanque);
      }
    }
  }

  updateTankVolume() {
    // console.log(this.tempEstadoTanques);
    // for (let index = 0; index < this.tempEstadoTanques.length; index++) {

      // console.log(this.tempEstadoTanques[index]);
      // console.log( this.EstadoTanques[index]);
      // this.EstadoTanques[index].id = this.tempEstadoTanques[index].id;
      // this.EstadoTanques[index].lleno = this.tempEstadoTanques[index].lleno;
      // this.EstadoTanques[index].Probe = this.tempEstadoTanques[index].Probe;
      // this.EstadoTanques[index].tankDesign = this.tempEstadoTanques[index].tankDesign;


      // this.EstadoTanques[index].producto = this.tempEstadoTanques[index].producto;
      // this.EstadoTanques[index].capacity = this.tempEstadoTanques[index].capacity;
      // this.EstadoTanques[index].dispensed = this.tempEstadoTanques[index].dispensed;
      // this.EstadoTanques[index].last_sale_id = this.tempEstadoTanques[index].last_sale_id;
      // this.EstadoTanques[index].actualVolume = this.tempEstadoTanques[index].actualVolume;
      // this.EstadoTanques[index].consoleVolume = this.tempEstadoTanques[index].consoleVolume;
      // this.EstadoTanques[index].ProbeInformation = this.tempEstadoTanques[index].ProbeInformation;
      // this.EstadoTanques[index].last_volume_receibed = this.tempEstadoTanques[index].last_volume_receibed;
      // this.RenderizarTanques();
      // this.EstadoTanques[index].tanque3D.gauge.update(this.tempEstadoTanques[index].lleno);
    // }
  }

  getTanques = () => {
    this.EstadoTanquesService.getEstadoTanques()
      .then(
        result => {
          if (result.PossibleError == "") {
            this.tempEstadoTanques = result.List;
          }
          // if (!this.firstTime) {
            this.EstadoTanques = result.List;
            setTimeout(() => {
              this.RenderizarTanques();
            }, 500);
          // } else {
          //   this.updateTankVolume();
          // }
          this.firstTime = true;
        }).catch(error => {
          this.popupProviderService.SimpleMessage(
            "Estado Tanques",
            error,
            PopupType.ERROR
          );
        });
  }
  ngAfterViewInit() {

  }
  es: any;
  esLocale = require('date-fns/locale/es');
  TankStatusFeature:boolean = false;
  ngOnInit() {
    this.TankStatusFeature = environment.FeatureFlags.TankStatus;
    this.es = this.HelperServiceService.getTimeConfiguration(this.esLocale);

    this.EstadoTanquesService.showBigTanks()
      .then(result => {
        this.showBigTanks = result;
      }).catch(error => {
        console.log(error);
      });

  }
}
