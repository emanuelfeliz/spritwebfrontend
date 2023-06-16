import { IResponseWithElement } from './../../../../../models/response/IResponse';
import { IAzulSale, IAzulResponse } from './../../../../../models/azul/IRequest';
import { HttpService } from './../../../../../services/communication_services/http.service';
import { Component, OnInit,  OnDestroy } from '@angular/core';
import { DialogComponent, DialogService } from 'ng6-bootstrap-modal';
import { ComprobanteDataModel } from '../../../../../models/listado-ventas/ComprobanteDataModel.model';
import { TipoComprobante } from '../../../../../models/listado-ventas/tipo_comprobante.model';
import { RespuestaSaleDetail } from 'app/components/Ventas/listado-ventas/modals/DetalleVenta/RespuestaSaleDetail.model';
import { VentasService } from 'app/services/ventas.service';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';
import { AutenticadorFirmantesService } from 'app/services/autenticador-firmantes.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { CreditUserService } from 'app/services/credit_user.service';
import { CreditUser } from 'app/models/credit_user/credit_user.model';
import { Verifone, Pago, PaymentInfo } from 'app/models/pagos/Pago.model';
import { environment } from 'environments/environment';

export interface IComprobanteDataModel {
  comprobanteDataModel: ComprobanteDataModel;
}
declare var $;
@Component({
  selector: 'app-modals',
  templateUrl: './SaleDetail.component.html'
})
export class SaleDetailModalComponent extends
  DialogComponent<IComprobanteDataModel, RespuestaSaleDetail>
  implements IComprobanteDataModel, OnInit, OnDestroy {

  constructor(dialogService: DialogService, private popupProviderService: PopupProviderService, private ventasService: VentasService,
    private autenticadorFirmantesService: AutenticadorFirmantesService, private creditUserService: CreditUserService, private httpService: HttpService) {
    super(dialogService);
    this.OPCION_ACTUAL = 1;
    this.responseAuth = JSON.parse(localStorage.getItem('currentUser'));
  }
  
  responseAuth: GenericResponse<UsuarioAutenticado>;
  OPCION_ACTUAL: number;
  keyboard = true;
  comprobanteDataModel: ComprobanteDataModel;
  loadingRnc = false;
  ShowingAlertRnc = false;
  creatingRnc = false;
  creditUserId: number = 0;
  PC: Map<number, string> = new Map<number, string>()
    .set(2, '0').set(1, '01').set(2, '02').set(3, '03')
    .set(4, '04').set(5, '05').set(6, '12').set(7, '13')
    .set(8, '14').set(9, '15');
  TIPOS_COMPROBANTES: Array<TipoComprobante>;
  arrayWordPlaca = [
    'A', 'G', 'I', 'L', 'K', 'X', 'OE', 'OM', 'EA', 'EI', 'EG', 'EL', 'O', 'ED', 'EM', 'DD', 'Z', 'YX',
    'D', 'C', 'P', 'B', 'M', 'F', 'T', 'H', 'S',
    'U', 'J', 'W', 'OI', 'VC', 'EX', 'OF', 'OP', 'VSP0001', 'MSP0001', 'VCE0001'
  ];
  permiso_otro_name: string;
  client_rnc: string;

  credit_user: CreditUser = {
    BarCode: '',
    CountryIdCode: '',
    Id: 0,
    QrCode: '',
    RNC: '',
    CompanyName: '',
    discountCategory: 0,
    discountAmount: 0,
    categoryname: '',
    customerType: '0'
  };
  verifones_list: Verifone[] = [];
  verifone_selected = '';
  paymentsInfo: PaymentInfo[] = [];
  cardAmount: 0;
  payment_method: string = '';

  // @HostListener('window:keydown', ['$event'])
  // handleKeyboardEvent = (event: KeyboardEvent) => {
  //   if (event.key === '*' && this.keyboard) {
  //     this.cerrarTodo();
  //   }

  //   if ((event.key === '1' || event.key === '2' || event.key === '3') && this.keyboard && this.OPCION_ACTUAL == 1) {
  //     this.changeTipoPago(Number(event.key) == 1 ? 'Efectivo' :
  //       Number(event.key) == 2 ? 'Tarjeta' : Number(event.key) == 3 ? 'Otros' : Number(event.key) == 3 ? 'Verifone' : '');
  //   }
  //   if ((Number(event.key) >= 1 && Number(event.key) <= 8) && this.keyboard && this.OPCION_ACTUAL == 3) {
  //     $('#btnSelectTipoOtro' + event.key).click();
  //   }
  //   if (event.key === '/' && this.keyboard && this.OPCION_ACTUAL == 3) {
  //     setTimeout(() => {
  //       this.focusInput('#datoInput');
  //     }, 500);
  //   }
  //   if ((event.key === '1' || event.key === '2' || event.key === '3') && this.keyboard && this.OPCION_ACTUAL == 4) {
  //     if (event.key === '2') {
  //       this.imprimir();
  //     } else if (event.key === '1') {
  //       this.toggleRnc();
  //     } else if (event.key === '3') {
  //       this.pagar();
  //     }
  //   }
  //   if ((event.key === '/' || (Number(event.key) >= 1 && Number(event.key) < 9)) && this.keyboard && this.OPCION_ACTUAL == 5) {
  //     if (event.key === '/') {
  //       if (this.DataValidada()) {
  //         this.saveComprobante();
  //       }
  //     } else {
  //       $('#btnAbrirTipoPago' + event.key).click();
  //     }

  //   }
  //   if (event.key === '+' && this.OPCION_ACTUAL < 5) {
  //     if (this.OPCION_ACTUAL == 1) {
  //       if (this.comprobanteDataModel.metodo_pago === 'Tarjeta') {
  //         this.OPCION_ACTUAL = 2;
  //       } else if (this.comprobanteDataModel.metodo_pago === 'Efectivo') {
  //         this.OPCION_ACTUAL = 4;
  //       } else if (this.comprobanteDataModel.metodo_pago === 'Otros') {
  //         this.OPCION_ACTUAL = 3;
  //       }
  //       else if (this.comprobanteDataModel.metodo_pago === 'Verfione') {
  //         this.OPCION_ACTUAL = 3;
  //       }
  //     } else if (this.OPCION_ACTUAL == 3) {
  //       this.OPCION_ACTUAL = 4;
  //     }
  //     else if (this.OPCION_ACTUAL == 2) {
  //       this.OPCION_ACTUAL = 4;
  //     } else if (this.OPCION_ACTUAL == 4) {
  //       if (this.creatingRnc) {
  //         this.OPCION_ACTUAL = 5;
  //       }
  //     }
  //     this.adaptarMenu();
  //   } else if (event.key === '-' && this.OPCION_ACTUAL > 1) {
  //     if (this.OPCION_ACTUAL == 2) {
  //       this.OPCION_ACTUAL = 1;
  //     } else if (this.OPCION_ACTUAL == 4) {
  //       if (this.comprobanteDataModel.metodo_pago === 'Tarjeta') {
  //         this.OPCION_ACTUAL = 2;
  //       } else if (this.comprobanteDataModel.metodo_pago === 'Efectivo') {
  //         this.OPCION_ACTUAL = 1;
  //       } else if (this.comprobanteDataModel.metodo_pago === 'Otros') {
  //         this.OPCION_ACTUAL = 3;
  //       }
  //       else if (this.comprobanteDataModel.metodo_pago === 'Verifone') {
  //         this.OPCION_ACTUAL = 3;
  //       }
  //     } else if (this.OPCION_ACTUAL == 3) {
  //       this.OPCION_ACTUAL = 1;
  //     }
  //     else if (this.OPCION_ACTUAL == 5) {
  //       this.OPCION_ACTUAL = 4;
  //     }
  //     this.adaptarMenu();
  //   }
  // }
  adaptarMenu = () => {
    switch (this.OPCION_ACTUAL) {
      case 1:
        $('#focus1').focus();
        break;
      case 2:
        $('#focus2').focus();
        setTimeout(() => {
          $('#tarjetaInput').focus();
        }, 50);
        break;
      case 3:
        $('#focus3').focus();
        setTimeout(() => {
          $('#tipo_otro').focus();
        }, 50);
        break;
      case 4:
        $('#focus4').focus();
        break;
      case 5:
        $('#focus5').focus();
        setTimeout(() => {
          $('#rncInput').focus();
        }, 50);
        break;
      default:
        break;
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
  }
  selectTipoDatoOtros = (i: number, tp: string): void => {
    let permiso_otro: boolean;
    this.comprobanteDataModel.cliente = '';
    this.comprobanteDataModel.rnc = '';
    this.client_rnc = '';
    switch (i) {
      case 1:
        permiso_otro = this.responseAuth.Response.tpo_prepago;
        this.permiso_otro_name = 'tpo_prepago';
        break;
      // case 2:
      //     permiso_otro = this.responseAuth.Response.tpo_cheques;
      //     this.permiso_otro_name = 'tpo_cheques';
      //     break;
      case 2:
        permiso_otro = this.responseAuth.Response.tpo_vale_credito;
        this.permiso_otro_name = 'tpo_vale_credito';
        break;
      case 3:
        permiso_otro = this.responseAuth.Response.tpo_vale_planta;
        this.permiso_otro_name = 'tpo_vale_planta';
        break;
      case 4:
        permiso_otro = this.responseAuth.Response.tpo_vale_mensajeria;
        this.permiso_otro_name = 'tpo_vale_mensajeria';
        break;
      case 5:
        permiso_otro = this.responseAuth.Response.tpo_vale_consumo;
        this.permiso_otro_name = 'tpo_vale_consumo';
        break;
      case 6:
        permiso_otro = this.responseAuth.Response.tpo_calibracion_mezcla;
        this.permiso_otro_name = 'tpo_calibracion_mezcla';
        break;
      case 7:
        permiso_otro = this.responseAuth.Response.tpo_calibracion_mantenimiento;
        this.permiso_otro_name = 'tpo_calibracion_mantenimiento';
        break;
      case 8:
        permiso_otro = this.responseAuth.Response.tpo_pago_contado;
        this.permiso_otro_name = 'tpo_pago_contado';
        break;
      case 9:
        permiso_otro = this.responseAuth.Response.tpo_pago_contado_desc;
        this.permiso_otro_name = 'tpo_pago_contado_desc';
        break;
      case 0:
        permiso_otro = true;
        this.permiso_otro_name = 'pago_bono';
        break;
    }
    this.autenticadorFirmantesService
      .requestFirmanteAutentication(permiso_otro, `No tiene permiso para usar el tipo de pago (${this.permiso_otro_name})`,
        'Detalle de Venta', () => {
          if ($('#btnSelectTipoOtro' + i).hasClass('btn-warning')) {
            $('#btnSelectTipoOtro' + i).removeClass('btn-warning');
            this.comprobanteDataModel.tipo_otro = '';
          } else {
            $('.BX').removeClass('btn-warning');
            $('.BX').addClass('btn-secondary');
            $('#btnSelectTipoOtro' + i).removeClass('btn-secondary');
            $('#btnSelectTipoOtro' + i).addClass('btn-warning');
            this.comprobanteDataModel.tipo_otro = tp;
          }
        }, { permisoRecibido: this.permiso_otro_name });

    this.payment_method = tp;
    this.comprobanteDataModel.tipo_otro = 'Ninguno';
  }
  seleccionarComprobante = (i: number, tp: TipoComprobante): void => {
    if ($('#btnAbrirTipoPago' + (i + 1)).hasClass('btn-warning')) {
      $('#btnAbrirTipoPago' + (i + 1)).removeClass('btn-warning');
      this.comprobanteDataModel.codigo_ncf = '';
    } else {
      $('.BC').removeClass('btn-warning');
      $('#btnAbrirTipoPago' + (i + 1)).removeClass('btn-secondary');
      $('#btnAbrirTipoPago' + (i + 1)).addClass('btn-warning');
      this.comprobanteDataModel.codigo_ncf = tp.codigo;
    }
  }
  onClickLetraPlaca = (letra) => {
    $('.search-panel span#search_concept').text(letra);
    $('.input-group #search_param').val(letra);
    this.comprobanteDataModel.letraPlaca = letra;
  }
  ngOnInit(): void {
    this.comprobanteDataModel.tipo_otro = 'Ninguno';
    this.comprobanteDataModel.letraPlaca = this.arrayWordPlaca[0];
    document.getElementsByTagName('body')[0].classList.add('modal-open');
    this.changeTipoPago('Efectivo');
    this.TIPOS_COMPROBANTES = [
      new TipoComprobante('1-Factura para crédito fiscal', '01'),
      new TipoComprobante('2-Facturas para Consumidores Finales', '02'),
      //new TipoComprobante('3-Nota de Debito', '03'),
      //new TipoComprobante('4-Nota de Credito', '04'),
      //new TipoComprobante('5-Proveedores Informales', '05'),
      //new TipoComprobante('6-Registros Unico de Ingresos', '12'),
      //new TipoComprobante('7-Gastos Menores', '13'),
      new TipoComprobante('8-Regimenes Especiales de Tributacion', '14'),
      new TipoComprobante('9-Comprobantes Gurbernamentales', '15')
    ];
    this.OPCION_ACTUAL = 1;
    this.getVerifones();
  }

  addPaymentInfo() {
    const paymentInfo: PaymentInfo = { VerifoneType: this.verifone_selected, cardNumber: this.comprobanteDataModel.tarjetaTemp, cardAmount: this.cardAmount };
    this.paymentsInfo.push(paymentInfo);

    //Clean fields
    this.cardAmount = 0;
    this.verifone_selected = '';
    this.comprobanteDataModel.tarjetaTemp = '';
  }

  deletePaymentInfo(paymentInfo: PaymentInfo) {
    this.paymentsInfo = this.paymentsInfo.filter(x => x != paymentInfo);
  }

  getVerifones() {
    this.ventasService.getVerifones()
      .then(success => {
        if (success.PossibleError === '') {
          this.verifones_list = success.List;
        } else {
          this.popupProviderService.SimpleMessage('Pagos', success.PossibleError, PopupType.ERROR);
        }
      })
      .catch(error => {
        this.popupProviderService.SimpleMessage('Pagos', error, PopupType.ERROR);
        console.log(error);
      });
  }
  buscarRnc = (rnc: string) => {
    setTimeout(() => {
      if (!this.ShowingAlertRnc) {
        this.loadingRnc = true;
        this.ventasService.getClientByRnc(rnc).then(
          result => {
            if (result.Response === 'NO_DATA') {
              this.ShowingAlertRnc = true;
              this.popupProviderService
                .SimpleMessage('Buscar Cliente', `No hay cliente con el rnc ${rnc}`, PopupType.ERROR);
              setTimeout(() => {
                this.ShowingAlertRnc = false;
              }, 1000);
              this.comprobanteDataModel.rnc = '';
              this.comprobanteDataModel.cliente = '';
              this.loadingRnc = false;
              return;
            }
            if (result.PossibleError == '' && result.Success) {
              this.comprobanteDataModel.cliente = result.Response;
              this.comprobanteDataModel.rnc = rnc;
              this.client_rnc = result.Response;
              this.loadingRnc = false;
              $('#rncInput').prop('disabled', true);
              return;
            }
          }
        ).catch(error => {
          this.popupProviderService.SimpleMessage('RNC ERROR', error, PopupType.ERROR);
        });;
      }
    }, 250);
  }

  searchCreditUser = (rnc: string) => {
    setTimeout(() => {
      if (!this.ShowingAlertRnc) {
        this.loadingRnc = true;
        this.creditUserService.SearchCreditUserAndReturnsComplete(rnc).then(
          result => {
            if (!result.Success) {
              this.ShowingAlertRnc = true;
              this.popupProviderService
                .SimpleMessage('Buscar Cliente', `No hay cliente con el rnc ${rnc}`, PopupType.ERROR);
              setTimeout(() => {
                this.ShowingAlertRnc = false;
              }, 1000);
              this.comprobanteDataModel.rnc = '';
              this.comprobanteDataModel.cliente = '';
              this.loadingRnc = false;
              return;
            }
            if (result.PossibleError == '' && result.Success) {
              this.comprobanteDataModel.cliente = result.Response.CompanyName;
              this.comprobanteDataModel.rnc = rnc;
              this.client_rnc = result.Response.CompanyName;
              this.credit_user = result.Response;
              this.loadingRnc = false;
              if (this.credit_user.customerType !== 'Credito' && this.permiso_otro_name === 'tpo_vale_credito') {
                this.popupProviderService
                  .SimpleMessage('Error', `Este cliente no esta registrado para pagar ventas credito `, PopupType.ERROR);
                $('#paybutton').prop('disabled', true);
                return;
              }

              if (this.credit_user.customerType !== 'Descuento' && (this.permiso_otro_name === 'tpo_pago_contado' || this.permiso_otro_name === 'tpo_pago_contado_desc')) {
                this.popupProviderService
                  .SimpleMessage('Error', `Este cliente no esta registrado para pagar ventas contado`, PopupType.ERROR);
                $('#paybutton').prop('disabled', true);
                return;
              }
              $('#rncInput').prop('disabled', true);
              $('#paybutton').prop('disabled', false);
              return;
            }
          }
        ).catch(error => {
          this.popupProviderService.SimpleMessage('RNC ERROR', error, PopupType.ERROR);
        });;
      }
    }, 250);
  }


  pagar = (): void => {
    if (this.payment_method !== '') {
      this.comprobanteDataModel.metodo_pago = this.payment_method;
    }

    if (this.comprobanteDataModel.metodo_pago === 'Verifone') {
      //TODO: Add logger to the front end...
      this.httpService.Get<IResponseWithElement<string>>(environment.Urls.PaymentGatewayApi, 'Azul/Sale/Order/Last')
        .subscribe(result => {
          console.log(result);
          if (result.success) {

            let azulSale: IAzulSale = {
              itbis: '0',
              promoData: '',
              installment: '1',
              useMultiMessaging: '1',
              terminalId: '01290010',
              merchantId: '39036630010',
              orderNumber: result.element || '1',
              amount: this.comprobanteDataModel.venta.Money.toString(),
            };

            this.httpService.Post<IResponseWithElement<IAzulResponse>, IAzulSale>(environment.Urls.PaymentGatewayApi, 'Azul/Sale/Pay', azulSale).subscribe(
              result => {
                if (result.success) {
                  this.popupProviderService.SimpleMessage('Listado de ventas', result.message, PopupType.SUCCESS);
                } else {
                  this.popupProviderService.SimpleMessage('Listado de ventas', result.error, PopupType.SUCCESS);
                }
              },
              error => {
                this.popupProviderService.SimpleMessage('Listado de ventas', 'Error de comunicacion con el servidor, favor intentar mas tarde', PopupType.ERROR);
                console.log(error);
              });
          }
        },
          error => {
            this.popupProviderService.SimpleMessage('Listado de ventas', 'Error de comunicacion con el servidor, favor intentar mas tarde', PopupType.ERROR);
            console.log(error);
          }
        );

      return;
    }

    if (this.comprobanteDataModel.metodo_pago === 'Otros') {
      this.popupProviderService
        .SimpleMessage('Error', `Debes seleccionar un metodo de pago `, PopupType.ERROR);
      return;
    }
    this.addPaymentInfo();
    if (this.credit_user.customerType !== 'Credito' && this.permiso_otro_name === 'tpo_vale_credito') {
      this.popupProviderService
        .SimpleMessage('Error', `Este cliente no esta registrado para pagar ventas credito `, PopupType.ERROR);
      return;
    }

    if (this.credit_user.customerType !== 'Descuento' && (this.permiso_otro_name === 'tpo_pago_contado' || this.permiso_otro_name === 'tpo_pago_contado_desc')) {
      this.popupProviderService
        .SimpleMessage('Error', `Este cliente no esta registrado para pagar ventas contado`, PopupType.ERROR);
      return;
    }

    if (this.comprobanteDataModel.numeroPlaca !== '' && this.comprobanteDataModel.numeroPlaca !== '') {
      this.comprobanteDataModel.placa = this.comprobanteDataModel.letraPlaca + this.comprobanteDataModel.numeroPlaca;
    } else {
      this.comprobanteDataModel.placa = '';
    }

    if (this.permiso_otro_name === 'tpo_pago_contado_desc') {

      this.comprobanteDataModel.instantDiscount = true;

    }

    this.comprobanteDataModel.paymentsInfo = this.paymentsInfo;

    this.result = new RespuestaSaleDetail(this.comprobanteDataModel, 'PagarComprobante');
    this.close();
  }
  saveComprobante = (): void => {
    if (this.comprobanteDataModel.numeroPlaca !== '') {
      this.comprobanteDataModel.placa = this.comprobanteDataModel.letraPlaca + this.comprobanteDataModel.numeroPlaca;
    } else {
      this.comprobanteDataModel.placa = '';
    }
    this.result = new RespuestaSaleDetail(this.comprobanteDataModel, 'SaveComprobante');
    this.close();
  }
  DataValidada = (): boolean => {
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
        && this.comprobanteDataModel.codigo_ncf !== '' && this.comprobanteDataModel.tipo_otro != '0'
        && this.comprobanteDataModel.dato_otro != '') {
        return true;
      } else {
        return false;
      }
    }
  }
  toggleRnc = () => {
    if (this.creatingRnc) {
      $('#btnToggleRnc').html('(1)-Comprobante');
      this.creatingRnc = false;
      this.comprobanteDataModel.cliente = '';
      this.comprobanteDataModel.codigo_ncf = '';
      this.comprobanteDataModel.rnc = '';
      this.OPCION_ACTUAL = 3;
    } else {
      this.creatingRnc = true;
      $('#btnToggleRnc').html('(1)-Cancelar Comprobante');
    }
  }

  focusInput = (id: string) => { $(id).focus(); }
  cerrarTodo = () => {
    this.result = new RespuestaSaleDetail(null, 'cancelarOperacion');
    this.close();
  }
  imprimir = () => {
    this.comprobanteDataModel.placa = this.comprobanteDataModel.letraPlaca + this.comprobanteDataModel.numeroPlaca;
    if (this.comprobanteDataModel.metodo_pago == 'Efectivo') {
      this.result = new RespuestaSaleDetail(this.comprobanteDataModel, 'imprimirEfectivo');
      this.close();
    } else if (this.comprobanteDataModel.metodo_pago == 'Tarjeta') {
      if (this.comprobanteDataModel.tarjeta != '' &&
        this.comprobanteDataModel.tarjeta.length == 4) {
        this.result = new RespuestaSaleDetail(this.comprobanteDataModel, 'imprimirTarjeta');
        this.close();
      } else {
        this.popupProviderService.SimpleMessage('Detalle de Venta', 'Debe introducir los últimos 4 dígitos de la tarjeta',
          PopupType.WARNING);
      }
    } else if (this.comprobanteDataModel.metodo_pago == 'Otros') {
      if (this.comprobanteDataModel.tipo_otro != '' &&
        this.comprobanteDataModel.dato_otro != '') {
        this.result = new RespuestaSaleDetail(this.comprobanteDataModel, 'imprimirOtros');
        this.close();
      } else {
        this.popupProviderService.SimpleMessage('Detalle de Venta', 'Debe completar los campos de Otros',
          PopupType.WARNING);
      }

    }
  }
  toggleKeyboardInput = (value: boolean) => {
    this.keyboard = value;
  }
  changeTipoPago = (tp: string) => {
    if (tp === 'Efectivo' || tp === 'Tarjeta' || tp === 'Otros' || tp === 'Verifone') {
      this.comprobanteDataModel.metodo_pago = tp;
      $('.BTP').removeClass('btn-warning');
      $('#btn' + tp).removeClass('btn-secondary');
      $('#btn' + tp).addClass('btn-warning');
    }
  }
  exit() {
    this.result = new RespuestaSaleDetail(null, 'salir');
    this.close();
  }

  showDiscountByPaymentMethod(){
    return (this.comprobanteDataModel.metodo_pago == "Efectivo" || this.comprobanteDataModel.metodo_pago == "Tarjeta")
  }


}
