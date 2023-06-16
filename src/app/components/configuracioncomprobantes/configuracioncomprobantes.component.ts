import { Component, OnInit } from '@angular/core';
import { TipoComprobante } from '../../models/listado-ventas/tipo_comprobante.model';
import { NCFDataModel } from '../../models/conf-comprobantes/NCFDataModel.model';
import { ComprobantesService } from '../../services/comprobantes.service';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { GenericResponse } from '../../models/GenericResponse.model';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
@Component({
  selector: 'app-configuracioncomprobantes',
  templateUrl: './configuracioncomprobantes.component.html'
})

export class ConfiguracioncomprobantesComponent implements OnInit {
  TIPOS_COMPROBANTES: Array<TipoComprobante>;
  NCFTest: string;
  ncfSELECTED: NCFDataModel;

  constructor(private popupProviderService: PopupProviderService,
    private router: Router, private Comprobantes: ComprobantesService) {
    const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError == '') {
      if (responseAuth.Response.configuracion_comprobantes == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.TIPOS_COMPROBANTES = [
          new TipoComprobante('1-Factura para crédito fiscal', '01'),
          new TipoComprobante('2-Facturas para Consumidores Finales', '02'),
          new TipoComprobante('3-Nota de Debito', '03'),
          new TipoComprobante('4-Nota de Credito', '04'),
          new TipoComprobante('5-Proveedores Informales', '05'),
          new TipoComprobante('6-Registros Unico de Ingresos', '12'),
          new TipoComprobante('7-Gastos Menores', '13'),
          new TipoComprobante('8-Regimenes Especiales de Tributacion', '14'),
          new TipoComprobante('9-Comprobantes Gurbernamentales', '15')
        ];
        this.ncfSELECTED = new NCFDataModel('', '', 0, 0, 0, '', '');
        setTimeout(() => {
          this.onComprobanteChange(this.TIPOS_COMPROBANTES[0].codigo);
        }, 250);
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión',
      PopupType.ERROR);
    }

  }
  valido = () => {
    if (this.ncfSELECTED.Serie != '' && (this.ncfSELECTED.Hasta > this.ncfSELECTED.Desde)) {
      return true;
    } else {
      return false;
    }
  };
  GuardarCambios = () => {
    this.Comprobantes.updateComprobantes(this.ncfSELECTED)
      .then(
      result => {
        if (result.Success) {
          this.popupProviderService.SimpleMessage('Configuración de comprobantes', 'Configuración guardada', 
                                                    PopupType.SUCCESS);
        } else {
          this.popupProviderService.SimpleMessage('Configuración de comprobantes', 'La configuración no fue guardada',
                                                    PopupType.ERROR);
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Configuración de comprobantes', error,
                                                  PopupType.ERROR);
      });
  };
  onComprobanteChange = (codigo_tipo: string) => {
    this.Comprobantes.getByTipo(codigo_tipo)
      .then(
      result => {
        if (result.PossibleError == '') {
          if (result.List == undefined || result.List == null || result.List.length == 0) {
            this.ncfSELECTED = new NCFDataModel('', '', 0, 0, 0, codigo_tipo,'');
            this.NCFTest = '';
            this.popupProviderService
            .SimpleMessage('Configuración de comprobantes',
            `El comprobante seleccionado no se encuentra disponible, rellene los datos para registrarlo`,
                                                    PopupType.WARNING);
          } else {
            this.ncfSELECTED = result.List[0];
            this.NCFTest = this.ncfSELECTED.Serie +
              '00000000'.substring(0, '00000000'.length - this.ncfSELECTED.Consecutivo.toString().length) + 
                this.ncfSELECTED.Consecutivo.toString();
          }
        } else {
          this.popupProviderService.SimpleMessage('Configuración de comprobantes', 
                                                  'Fallo al obtener los comprobantes', 
                                                    PopupType.ERROR);
        }
      }
      ).catch(error => {
        this.popupProviderService.SimpleMessage('Configuracion Comprobantes', error, 
                                                  PopupType.ERROR);
      });
  }
  ngOnInit() {
  }

}
