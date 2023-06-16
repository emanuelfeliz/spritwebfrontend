import { Component, OnInit } from '@angular/core';
import { DataEstacion } from '../../models/configuration/DataEstacion.model';
import { GenericResponse } from '../../models/GenericResponse.model';
import { ConfigurationService } from '../../services/configuration.service';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html'
})
export class ConfigurationComponent implements OnInit {
  public dataEstacionList: Array<DataEstacion>;
  public DATA: DataEstacion;
  constructor(private popupProviderService: PopupProviderService, private router: Router,
    private ConfigurationService: ConfigurationService) {
    const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError == '') {
      if (responseAuth.Response.configuracion_sistema == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.DATA = new DataEstacion('', '', '', '', '', '', '', '', '', '', '', '', '', '','',
          false, false, false, false, false, false, false, '', '', '', '', '', '', '','','','',false, '','',false,'','','','','',false, false, false, false, false,'','','',
          false, false, false, '', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, '', false, false, 
          false, '', false, '', false, false, false, false, '');
        this.getDataEstacion();
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión',
        PopupType.ERROR);
    }

  }
  configuracionValida = (): boolean => {
    if (this.DATA.address != '' && this.DATA.mensaje != '' && this.DATA.name != '' && this.DATA.rnc != '' && this.DATA.rnc != null && this.DATA.ruta_exportacion_cierres_pumptablet != '' &&
      this.DATA.ruta_exportacion_comprobante_venta != '' && this.DATA.ruta_exportacion_reporte_turno_cerrado != '' && this.DATA.ruta_exportacion_reporte_turno_curso != ''
      && this.DATA.ruta_exportacion_listadocomprobantes != '' && this.DATA.ruta_exportacion_reporte_turno_periodo != ''
      && this.DATA.telefono != '' && this.DATA.ruta_exportacion_reporte_venta_tipo_pago != '' && this.DATA.rutaLogsSpiritConsolePumpLogs != '' && this.DATA.pumpLogFileName != ''
      && this.DATA.rutaFocusFileExcel != '' && this.DATA.consoleType != '' && this.DATA.validationPumpsWorking != '' && this.DATA.delayToClosePump && this.DATA.webpagesVersion != ''
      && this.DATA.CrystalImageCleanerSleep != '' && this.DATA.CrystalImageCleanerAge != '' && this.DATA.listadodeventas != '' && this.DATA.LimiteVentasAndroid != '' &&
      this.DATA.LogDirectory != '' && this.DATA.TimeToWaitForWorkWithTally != '' && this.DATA.URL_PUMPER_PRICES != '' && this.DATA.appVersion != '') {
      return true;
    } else {
      return false;
    }
  }
  getDataEstacion = () => {
    this.ConfigurationService.GetDatosEstacion().then(
      result => {
        if (result.PossibleError == '') {
          this.dataEstacionList = result.List;
          this.DATA = this.dataEstacionList[0];
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Configuracion', error, PopupType.ERROR);
      });
  }

  SetDatosEstacion = () => {
    this.popupProviderService.QuestionMessage('Guardando configuración', 'Está seguro de Guardar los cambios?',
      PopupType.WARNING, 'SI!', 'NO!',
      () => {
        this.ConfigurationService.SetDatosEstacion(this.DATA).then(
          result => {
            if (result.Success) {
              this.getDataEstacion();
              this.popupProviderService.SimpleMessage('Guardando Configuración', 'La configuración fue registrada',
                PopupType.SUCCESS);
            }
          }
        ).catch(error => {
          this.popupProviderService.SimpleMessage('Guardando Configuración', error,
            PopupType.ERROR);
        });
      }, () => {
        this.popupProviderService.SimpleMessage('Aviso', 'La operación fue cancelada',
          PopupType.WARNING);
      });
  }

  ngOnInit() {
  }

}
