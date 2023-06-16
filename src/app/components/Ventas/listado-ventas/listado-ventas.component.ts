import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HostListener } from '@angular/core';
import { Venta } from '../../../models/listado-ventas/venta.model';
import { ComprobanteDataModel } from '../../../models/listado-ventas/ComprobanteDataModel.model';
import { GenericResponse } from '../../../models/GenericResponse.model';
import { VentasService } from '../../../services/ventas.service';
import { DialogService } from "ng6-bootstrap-modal";
import { UsuarioAutenticado } from '../../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { RespuestaAutenticacionBombero } from 'app/modalsGenerales/RespuestaAutenticacionBombero.model';
import { SaleDetailModalComponent } from 'app/components/Ventas/listado-ventas/modals/DetalleVenta/SaleDetail.component';
import { RespuestaSaleDetail } from 'app/components/Ventas/listado-ventas/modals/DetalleVenta/RespuestaSaleDetail.model';
import { PrintServiceService } from 'app/services/print-service.service';
import { ValidacionManipulacionVentas } from 'app/models/listado-ventas/ValidacionManipulacionVentas.model';
import { AutenticadorBomberosService } from 'app/services/autenticador-bomberos.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
declare var $;
@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.component.html',
  styleUrls: ['./listado-ventas.component.css']
})

export class ListadoVentasComponent implements OnInit {
  ventas: Venta[] = [];
  loading: boolean;
  PumpSelected = 0;
  NozzleSelected = 0;
  LimitSelected = 5;
  MENU_ACTUAL = 'NINGUNO';
  keyboard = true;
  comprobanteDataModel: ComprobanteDataModel;
  ventaSeleccionada: Venta;
  MODAL_AUTENTICACION_BOMBEROS: any;
  MODAL_DETALLE_VENTA: any;
  ventasLimitadas: boolean;
  p = 1;
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent = (event: KeyboardEvent) => {
    if (this.MENU_ACTUAL === 'NINGUNO' && Number(event.key) >= 0 && Number(event.key) <= 9 && this.keyboard) {
      $('#BotonDetalle' + event.key).click();
    }
  }

  constructor(private printer: PrintServiceService, private autenticarBombero: AutenticadorBomberosService,
    private ventasService: VentasService, private dialogService: DialogService,
    private router: Router, private popupProvider: PopupProviderService) {
    this.ventasLimitadas = false;
    const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem("currentUser"));
    if (responseAuth.PossibleError === '') {
      if (responseAuth.Response.listado_ventas === false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.loading = false;
        this.inicializarComprobanteDataModel();
        if (responseAuth.Response.listado_ventas_limitado !== '0') {

          this.ventasLimitadas = true;
          if (!isNaN(parseInt(responseAuth.Response.listado_ventas_limitado, 10)))
            this.LimitSelected = parseInt(responseAuth.Response.listado_ventas_limitado, 10);
        }
      }
    } else {
      this.popupProvider.SimpleMessage('Sesion Fallida',
        'No se puedo obtener la sesión',
        PopupType.ERROR);
    }
  }
  inicializarComprobanteDataModel = (): void => {
    this.comprobanteDataModel = new ComprobanteDataModel('', '', '', '', '', '', '', '', '');
    this.comprobanteDataModel.venta = this.ventaSeleccionada;
  }
  toggleKeyboardInput = (value: boolean) => {
    this.keyboard = value;
  }
  getVentas = () => {
    let i = 0;
    this.loading = true;
    this.ventasService.getVentas(this.PumpSelected, this.NozzleSelected, this.LimitSelected)
      .then(
        result => {
          this.loading = false;
          if (result.PossibleError === '') {
            this.ventas = result.List;
            this.ventas.map((v: Venta) => {
              v.NumeroVenta = i++;
            });
          }
        }).catch(error => {
          this.loading = false;
          this.popupProvider.SimpleMessage('Obteniendo Ventas',
            'Error obteniendo las ventas',
            PopupType.ERROR);
        });
  }

  impresionVenta = (url: string): void => {
    this.printer.openNewTab(url, 'Impresion venta');
  }
  detalleVenta = (venta: Venta) => {
    this.MENU_ACTUAL = 'AUTENTICACION_BOMBEROS';
    this.MODAL_AUTENTICACION_BOMBEROS = this.autenticarBombero.requestBomberoAutentication
      ("Listado de Ventas", (returnResult: RespuestaAutenticacionBombero): void => {
        this.MENU_ACTUAL = "NINGUNO";

        // VALIDAR que ese bombero autenticado
        // tenga una apertura ACTIVA realizada que le permita
        // manipular ventas del lado seleccionado
        const validacion: ValidacionManipulacionVentas = new ValidacionManipulacionVentas(returnResult.bombero, this.comprobanteDataModel);
        validacion.comprobante.venta = venta;
        this.ventasService.validarPermisoManipulacionVenta(validacion).then(
          result => {
            if (result.Success) {
              this.MENU_ACTUAL = "DETALLE_VENTA_EXITOSO";
              this.ventaSeleccionada = venta;
              this.comprobanteDataModel.venta = this.ventaSeleccionada;
              this.comprobanteDataModel.bombero = returnResult.bombero.bombero;
              this.comprobanteDataModel.tarjeta = '';
              this.comprobanteDataModel.placa = '';
              this.MODAL_DETALLE_VENTA = this.dialogService
                .addDialog(SaleDetailModalComponent, { comprobanteDataModel: this.comprobanteDataModel })
                .subscribe(respuestaDetalleVenta => {
                  if (respuestaDetalleVenta.respuesta === 'salir') {
                    this.MODAL_DETALLE_VENTA.unsubscribe();
                    this.inicializarComprobanteDataModel();
                    this.MENU_ACTUAL = "NINGUNO";
                  } else if (respuestaDetalleVenta.respuesta === 'imprimirEfectivo') {
                    this.MODAL_DETALLE_VENTA.unsubscribe();
                    this.inicializarComprobanteDataModel();
                    this.MENU_ACTUAL = "NINGUNO";
                    this.impresionVenta(`WebForms/ImpresionVenta.aspx?json=${JSON.stringify(respuestaDetalleVenta.comprobanteDataModel)}`);
                  } else if (respuestaDetalleVenta.respuesta === 'imprimirTarjeta') {
                    this.MODAL_DETALLE_VENTA.unsubscribe();
                    this.inicializarComprobanteDataModel();
                    this.MENU_ACTUAL = "NINGUNO";
                    this.impresionVenta(`WebForms/ImpresionVenta.aspx?json=${JSON.stringify(respuestaDetalleVenta.comprobanteDataModel)}`);
                  } else if (respuestaDetalleVenta.respuesta === 'imprimirOtros') {
                    this.MODAL_DETALLE_VENTA.unsubscribe();
                    this.inicializarComprobanteDataModel();
                    this.MENU_ACTUAL = "NINGUNO";
                    this.impresionVenta(`WebForms/ImpresionVenta.aspx?json=${JSON.stringify(respuestaDetalleVenta.comprobanteDataModel)}`);
                  } else if (respuestaDetalleVenta.respuesta === 'SaveComprobante') {
                    this.MODAL_DETALLE_VENTA.unsubscribe();
                    this.MENU_ACTUAL = "NINGUNO";
                    this.saveComprobante();
                  } else if (respuestaDetalleVenta.respuesta === 'PagarComprobante') {
                    this.MODAL_DETALLE_VENTA.unsubscribe();
                    this.MENU_ACTUAL = "NINGUNO";
                    this.pagarComprobante();
                  }
                  else if (respuestaDetalleVenta.respuesta === 'cancelarOperacion') {
                    this.MODAL_DETALLE_VENTA.unsubscribe();
                    this.MENU_ACTUAL = "NINGUNO";
                  }
                });
            } else {
              this.popupProvider.SimpleMessage('Validación manipulación ventas',
                result.Response,
                PopupType.WARNING);
            }
          }
        ).catch(error => {
          this.popupProvider.SimpleMessage('Validación manipulación ventas', error, PopupType.ERROR);
        });
      }, () => {
        this.MENU_ACTUAL = "NINGUNO";
      }, { idBombero: 0 });
  }

  validarComprobanteDataModel = (): boolean => {
    if (this.comprobanteDataModel.metodo_pago === 'Efectivo') {
      if (this.comprobanteDataModel.cliente !== '' && this.comprobanteDataModel.rnc !== ''
        && this.comprobanteDataModel.codigo_ncf !== '') {
        return true;
      } else {
        return false;
      }
    } else if (this.comprobanteDataModel.metodo_pago === 'Tarjeta') {
      if (this.comprobanteDataModel.cliente !== '' && this.comprobanteDataModel.rnc !== ''
        && this.comprobanteDataModel.tarjeta.length === 4 && this.comprobanteDataModel.codigo_ncf !== '') {
        return true;
      } else {
        return false;
      }
    } else {
      if (this.comprobanteDataModel.cliente !== '' && this.comprobanteDataModel.rnc !== ''
        && this.comprobanteDataModel.codigo_ncf !== '' && this.comprobanteDataModel.tipo_otro != "0"
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
  validarPagoComprobanteDataModel = (): boolean => {
    if (this.comprobanteDataModel.metodo_pago === 'Tarjeta') {
      // validate with the rol

      if (this.comprobanteDataModel.paymentsInfo.length > 0) {
        if (this.comprobanteDataModel.tarjeta.length === 4 && this.comprobanteDataModel.letraPlaca !== '' && this.comprobanteDataModel.placa !== '') {
          return true;
        } else {
          return false;
        }
      } else {

        if (this.comprobanteDataModel.paymentsInfo === []) {

          this.comprobanteDataModel.tarjeta = this.comprobanteDataModel.paymentsInfo[0].cardNumber;
        }

        if (this.comprobanteDataModel.tarjeta.length === 4) {
          return true;
        } else {
          return false;
        }
      }

    } else {
      if (this.comprobanteDataModel.tipo_otro != "") {
        return true;
      } else {
        return false;
      }
    }
  }
  pagarComprobante = (): void => {
    if (this.validarPagoComprobanteDataModel()) {

      let tempDataTipoOtro = this.comprobanteDataModel.tipo_otro;

      let tempInstantDiscount = this.comprobanteDataModel.instantDiscount;

      this.ventasService.pagarVenta(this.comprobanteDataModel).then(
        result => {
          this.inicializarComprobanteDataModel();
          if (result.Success) {
            this.popupProvider.SimpleMessage('Comprobante',
              'Comprobante registrado',
              PopupType.SUCCESS);

            // alert('Hola');

            this.printer.openNewTab(`WebForms/ComprobanteVentaPagada.aspx?id_pago=${result.IDENTIFICADOR}&tipo_pago=${tempDataTipoOtro
              }&instant_discount=${tempInstantDiscount}`, 'Comprobante de Venta');

            this.popupProvider.SimpleMessage('Listado de comprobantes',
              'Venta pagada',
              PopupType.SUCCESS);

          } else {
            let errorMessage: string = "";
            switch (result.PossibleError) {
              case "VENTA_PAGADA":
                errorMessage = "Esta venta ya fue pagada";
                break;
              default:
                errorMessage = result.PossibleError;
                break;
            }
            this.popupProvider.SimpleMessage('Comprobante',
              errorMessage,
              PopupType.ERROR);

          }
        }
      ).catch(error => {
        this.popupProvider.SimpleMessage('Listado de ventas', error, PopupType.ERROR);
      });
    } else {
      this.popupProvider.SimpleMessage('Listado de ventas',
        'Debe completar los campos antes de pagar la venta',
        PopupType.WARNING);

    }
  }
  saveComprobante = (): void => {
    // Si se valido el comprobante efectivamente
    if (this.validarComprobanteDataModel()) {
      this.ventasService.saveComprobante(this.comprobanteDataModel).then(
        result => {
          this.inicializarComprobanteDataModel();
          if (result.Success) {
            this.popupProvider.SimpleMessage('Comprobante',
              'Comprobante registrado',
              PopupType.SUCCESS);


            this.printer.openNewTab(`WebForms/ComprobanteVenta.aspx?ncf=${result.Response}`, 'Comprobante de Venta');
            if (result.Details !== 'EXPORTADOS') {
              this.popupProvider.SimpleMessage('Listado de comprobantes, no actualizado',
                result.Details,
                PopupType.WARNING);
            }
          } else {
            let errorMessage = '';
            switch (result.PossibleError) {
              case 'ERROR_SERVIDOR_RNC':
              case 'ERROR_SERVIDOR_VENTA_DUPLICADA':
                errorMessage = 'Error en el servidor';
                break;
              case "COMPROBANTE_VENTA_GENERADO":
                errorMessage = 'Esta venta ya tiene un comprobante';
                break;
              case "COMPROBANTE_NO_DISPONIBLE":
                errorMessage = 'Comprobante no disponible';
                break;
              case "LIMITE_COMPROBANTE":
                errorMessage = 'Este tipo de comprobante, ha excedido el límite';
                break;
              case "RNC_INVALIDO":
                errorMessage = 'Rnc inválido';
                break;
              default:
                errorMessage = result.PossibleError;
                break;
            }
            this.popupProvider.SimpleMessage('Comprobante',
              errorMessage,
              PopupType.ERROR);
          }
        }
      ).catch(error => {
        this.popupProvider.SimpleMessage('Listado de ventas', error, PopupType.ERROR);
      });
    }
  };

  ngOnInit() {
    this.getVentas();
  }
}
