import { Component, OnInit } from '@angular/core';
import { EstadoTanquesService } from 'app/services/estado-tanques.service';
import { TankDesign } from 'app/models/Tanques/TankDesign.model';
import { Router } from '@angular/router';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';
import { ModelList } from 'app/models/ModelList.model';
import { Tanks } from 'app/models/Tanques/Tanks.model';
import { Gauge } from 'app/models/Tanques/Gauge.model';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { ColorPickerService } from 'ngx-color-picker';
declare var $, liquidFillGaugeDefaultSettings, loadLiquidFillGauge;
@Component({
  selector: 'app-configuracion-tanques',
  templateUrl: './configuracion-tanques.component.html'
})
export class ConfiguraciontanquesComponent implements OnInit {
  public tanquesExitosos: Gauge[];
  private animacion_default: any = liquidFillGaugeDefaultSettings();
  private animacion1: any = liquidFillGaugeDefaultSettings();
  private animacion2: any = liquidFillGaugeDefaultSettings();
  private animacion3: any = liquidFillGaugeDefaultSettings();
  private animacion4: any = liquidFillGaugeDefaultSettings();
  private animacion5: any = liquidFillGaugeDefaultSettings();

  public tanksDesigns: TankDesign[];
  public tankDesign: TankDesign;
  public creando = false;
  public editando = false;
  public textoBoton: string;
  public loading = false;
  public tanques: Tanks[];

  NewValue(gauge: any) {
    let rnd = 0;
    if (Math.random() > .5) {
      rnd = Math.round(Math.random() * 100);
    } else {
      rnd = Number((Math.random() * 100).toFixed(1));
    }
    gauge.update(rnd);
  }


  constructor(private cpService:ColorPickerService, private popupProviderService: PopupProviderService,
    private EstadoTanquesService: EstadoTanquesService, private router: Router) {
    const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError == '') {
      if (responseAuth.Response.bomberos == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.tankDesign = new TankDesign(0, '', '', '', '', 0, '', 0);
        this.textoBoton = 'Crear configuración de tanque';

        this.animacion1.circleColor = '#FF7777';
        this.animacion1.textColor = '#FF4444';
        this.animacion1.waveTextColor = '#FFAAAA';
        this.animacion1.waveColor = '#FFDDDD';
        this.animacion1.circleThickness = 0.2;
        this.animacion1.textVertPosition = 0.2;
        this.animacion1.waveAnimateTime = 1000;

        this.animacion2.circleColor = '#D4AB6A';
        this.animacion2.textColor = '#553300';
        this.animacion2.waveTextColor = '#805615';
        this.animacion2.waveColor = '#AA7D39';
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
        this.animacion4.circleColor = '#808015';
        this.animacion4.textColor = '#555500';
        this.animacion4.waveTextColor = '#FFFFAA';
        this.animacion4.waveColor = '#AAAA39';
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
        this.animacion5.circleColor = '#6DA398';
        this.animacion5.textColor = '#0E5144';
        this.animacion5.waveTextColor = '#6DA398';
        this.animacion5.waveColor = '#246D5F';
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

        this.tanquesExitosos = [
          new Gauge('Animacion-0', Object),
          new Gauge('Animacion-1', Object),
          new Gauge('Animacion-2', Object),
          new Gauge('Animacion-3', Object),
          new Gauge('Animacion-4', Object),
          new Gauge('Animacion-5', Object)
        ];
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }
  }
  loadTanks() {
    this.EstadoTanquesService.loadTanks()
      .then(
        result => {
          if (result.PossibleError == '') {
            this.tanques = result.List;
            this.loading = false;
          }
        }).catch(error => {
          this.popupProviderService.SimpleMessage('Configuracion tanques', error, PopupType.ERROR);
        });
  }
  
  validateModel = (tankDesign: TankDesign): boolean => {
    return tankDesign.circleColor != '' && tankDesign.textColor != '' && tankDesign.waveColor != '' &&
      tankDesign.waveTextColor != '' && (tankDesign.silhouette != null || tankDesign.silhouette != undefined);
  }
  editarTankDesign = (tankDesign: TankDesign) => {
    this.creando = false;
    this.editando = true;
    this.textoBoton = 'Cancelar edición';
    this.tankDesign = tankDesign;
  }
  botones = () => {
    if (!this.creando && !this.editando) {
      this.creando = true;
      this.tankDesign = new TankDesign(0, '', '', '', '', 0, '', 0);
      this.textoBoton = 'Cancelar';
    } else if (this.creando) {
      this.creando = false;
      this.tankDesign = new TankDesign(0, '', '', '', '', 0, '', 0);
      this.textoBoton = 'Crear configuración de tanque';
    } else if (this.editando) {
      this.editando = false;
      this.tankDesign = new TankDesign(0, '', '', '', '', 0, '', 0);
      this.textoBoton = 'Crear configuración de tanque';
    }
  }
  sanitizeTankDesing = (td: TankDesign): void => {
    td.circleColor = td.circleColor.substring(1);
    td.textColor = td.textColor.substring(1);
    td.waveColor = td.waveColor.substring(1);
    td.waveTextColor = td.waveTextColor.substring(1);
  }
  onSubmit = () => {
    this.sanitizeTankDesing(this.tankDesign);
    if (this.creando) {
      this.EstadoTanquesService.saveTanksDesign(this.tankDesign)
        .then(
          result => {
            if (result.Success) {
              this.popupProviderService.SimpleMessage(
                'Éxito',
                'Configuración tanque agregada',
                PopupType.SUCCESS
              );
              this.getTanksDesign();
            } else {
              this.popupProviderService.SimpleMessage(
                'Configuración tanque no agregada',
                'Algo salió mal!',
                PopupType.ERROR
              );
            }
            this.creando = false;
            this.textoBoton = 'Crear configuración de tanque';
          }).catch(error => {
            this.popupProviderService.SimpleMessage('Configuracion tanques', error, PopupType.ERROR);
          });
    } else if (this.editando) {
      this.EstadoTanquesService.editTanksDesign(this.tankDesign)
        .then(
          result => {
            if (result.Success) {
              this.popupProviderService.SimpleMessage(
                'Éxito',
                'Configuración tanque editada',
                PopupType.SUCCESS
              );
              this.getTanksDesign();
            } else {
              this.popupProviderService.SimpleMessage(
                'Configuración tanque no editada',
                'Algo salió mal!',
                PopupType.ERROR
              );
            }
            this.editando = false;
            this.textoBoton = 'Crear configuración de tanque';
          }).catch(error => {
            this.popupProviderService.SimpleMessage('Configuracion tanques', error, PopupType.ERROR);
          });
    }
  }
  getTanksDesign = () => {
    this.loading = true;
    this.EstadoTanquesService.getTanksDesign()
      .then(
        result => {
          if (result.PossibleError == '') {
            this.tanksDesigns = result.List;
          }
          this.loading = false;
        }).catch(error => {
          this.popupProviderService.SimpleMessage('Configuracion tanques', error, PopupType.ERROR);
        });
  }
  ngOnInit() {
    this.getTanksDesign();
    this.loadTanks();
    setTimeout(() => {
      for (let i = 0; i < this.tanquesExitosos.length; i++) {
        let animacion: any;
        switch (this.tanquesExitosos[i].id) {
          case 'Animacion-0':
            animacion = liquidFillGaugeDefaultSettings();
            break;
          case 'Animacion-1':
            animacion = this.animacion1;
            break;
          case 'Animacion-2':
            animacion = this.animacion2;
            break;
          case 'Animacion-3':
            animacion = this.animacion3;
            break;
          case 'Animacion-4':
            animacion = this.animacion4;
            break;
          case 'Animacion-5':
            animacion = this.animacion5;
            break;
        }
        this.tanquesExitosos[i].gauge = loadLiquidFillGauge(this.tanquesExitosos[i].id, 50, animacion);
      }
    }, 500);

  }
  deleteTanksDesign = (id: number) => {
    this.EstadoTanquesService.deleteTanksDesign(id).then(response => {
      if (response.Success) {
        this.popupProviderService.SimpleMessage(
          'Éxito',
          'Configuración de tanque eliminada',
          PopupType.SUCCESS
        );
        this.getTanksDesign();
      } else {
        this.popupProviderService.SimpleMessage(
          'Configuración de tanque no eliminada',
          'Algo salió mal!',
          PopupType.ERROR
        );
      }
    }).catch(error => {
      this.popupProviderService.SimpleMessage('Configuracion tanques', error, PopupType.ERROR);
    });
  }
  confirmarBorrarTankDesign = (tankDesign: TankDesign) => {
    this.popupProviderService.QuestionMessage('Eliminar configuración',
      `Estás seguro de eliminar la configuracion del tanque ${tankDesign.tanque}?`, PopupType.WARNING,
      'SI!', 'NO!',
      () => {
        this.deleteTanksDesign(tankDesign.id);
      }, () => {
      });
  }
}
