import { Component, OnInit,  OnDestroy } from '@angular/core';
import { DialogComponent, DialogService } from "ng6-bootstrap-modal";
import { HostListener } from '@angular/core';
import {  RespuestaSaleDetailFacturacion } from 'app/components/Ventas/listado-ventas/modals/DetalleVenta/RespuestaSaleDetail.model';
import { VentasService } from 'app/services/ventas.service';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';
import { AutenticadorFirmantesService } from 'app/services/autenticador-firmantes.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { CreditUserService } from 'app/services/credit_user.service';
import {  ComprobanteDataModelFacturacion } from 'app/models/listado-ventas/ComprobanteDataModel.model';
import { TipoComprobante } from 'app/models/listado-ventas/tipo_comprobante.model';

export interface IComprobanteDataModel {
    comprobanteDataModel: ComprobanteDataModelFacturacion;
}
declare var $;
@Component({
    selector: 'app-modals',
    templateUrl: './sales-cuadre-modal.component.html'
})
export class SaleCuadreModalComponent extends
    DialogComponent<IComprobanteDataModel, RespuestaSaleDetailFacturacion>
    implements IComprobanteDataModel, OnInit, OnDestroy {

    constructor(dialogService: DialogService, private popupProviderService: PopupProviderService, private ventasService: VentasService,
        private autenticadorFirmantesService: AutenticadorFirmantesService, private creditUserService: CreditUserService) {
        super(dialogService);
        this.OPCION_ACTUAL = 1;
        this.responseAuth = JSON.parse(localStorage.getItem('currentUser'));
    }

    responseAuth: GenericResponse<UsuarioAutenticado>;
    OPCION_ACTUAL: number;
    keyboard = true;
    comprobanteDataModel: ComprobanteDataModelFacturacion;
    loadingRnc = false;
    ShowingAlertRnc = false;
    creatingRnc = false;
    totalProducts = 0;
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
    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent = (event: KeyboardEvent) => {
        if (event.key === '*' && this.keyboard) {
            this.cerrarTodo();
        }

        if ((event.key === '1' || event.key === '2' || event.key === '3') && this.keyboard && this.OPCION_ACTUAL == 1) {
            this.changeTipoPago(Number(event.key) == 1 ? 'Efectivo' :
                Number(event.key) == 2 ? 'Tarjeta' : Number(event.key) == 3 ? 'Otros' : '');
        }
        if ((Number(event.key) >= 1 && Number(event.key) <= 8) && this.keyboard && this.OPCION_ACTUAL == 3) {
            $('#btnSelectTipoOtro' + event.key).click();
        }
        if (event.key === '/' && this.keyboard && this.OPCION_ACTUAL == 3) {
            setTimeout(() => {
                this.focusInput('#datoInput');
            }, 500);
        }
        if ((event.key === '1' || event.key === '2' || event.key === '3') && this.keyboard && this.OPCION_ACTUAL == 4) {
            if (event.key === '2') {
                this.imprimir();
            } else if (event.key === '1') {
                this.toggleRnc();
            } else if (event.key === '3') {
                this.pagar();
            }
        }
        if ((event.key === '/' || (Number(event.key) >= 1 && Number(event.key) < 9)) && this.keyboard && this.OPCION_ACTUAL == 5) {
            if (event.key === '/') {
                if (this.DataValidada()) {
                    this.saveComprobante();
                }
            } else {
                $('#btnAbrirTipoPago' + event.key).click();
            }

        }
        if (event.key === '+' && this.OPCION_ACTUAL < 5) {
            if (this.OPCION_ACTUAL == 1) {
                if (this.comprobanteDataModel.metodo_pago === 'Tarjeta') {
                    this.OPCION_ACTUAL = 2;
                } else if (this.comprobanteDataModel.metodo_pago === 'Efectivo') {
                    this.OPCION_ACTUAL = 4;
                } else if (this.comprobanteDataModel.metodo_pago === 'Otros') {
                    this.OPCION_ACTUAL = 3;
                }
            } else if (this.OPCION_ACTUAL == 3) {
                this.OPCION_ACTUAL = 4;
            }
            else if (this.OPCION_ACTUAL == 2) {
                this.OPCION_ACTUAL = 4;
            } else if (this.OPCION_ACTUAL == 4) {
                if (this.creatingRnc) {
                    this.OPCION_ACTUAL = 5;
                }
            }
            this.adaptarMenu();
        } else if (event.key === '-' && this.OPCION_ACTUAL > 1) {
            if (this.OPCION_ACTUAL == 2) {
                this.OPCION_ACTUAL = 1;
            } else if (this.OPCION_ACTUAL == 4) {
                if (this.comprobanteDataModel.metodo_pago === 'Tarjeta') {
                    this.OPCION_ACTUAL = 2;
                } else if (this.comprobanteDataModel.metodo_pago === 'Efectivo') {
                    this.OPCION_ACTUAL = 1;
                } else if (this.comprobanteDataModel.metodo_pago === 'Otros') {
                    this.OPCION_ACTUAL = 3;
                }
            } else if (this.OPCION_ACTUAL == 3) {
                this.OPCION_ACTUAL = 1;
            }
            else if (this.OPCION_ACTUAL == 5) {
                this.OPCION_ACTUAL = 4;
            }
            this.adaptarMenu();
        }
    }
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
            case 2:
                permiso_otro = this.responseAuth.Response.tpo_cheques;
                this.permiso_otro_name = 'tpo_cheques';
                break;
            case 3:
                permiso_otro = this.responseAuth.Response.tpo_vale_credito;
                this.permiso_otro_name = 'tpo_vale_credito';
                break;
            case 4:
                permiso_otro = this.responseAuth.Response.tpo_vale_planta;
                this.permiso_otro_name = 'tpo_vale_planta';
                break;
            case 5:
                permiso_otro = this.responseAuth.Response.tpo_vale_mensajeria;
                this.permiso_otro_name = 'tpo_vale_mensajeria';
                break;
            case 6:
                permiso_otro = this.responseAuth.Response.tpo_vale_consumo;
                this.permiso_otro_name = 'tpo_vale_consumo';
                break;
            case 7:
                permiso_otro = this.responseAuth.Response.tpo_calibracion_mezcla;
                this.permiso_otro_name = 'tpo_calibracion_mezcla';
                break;
            case 8:
                permiso_otro = this.responseAuth.Response.tpo_calibracion_mantenimiento;
                this.permiso_otro_name = 'tpo_calibracion_mantenimiento';
                break;
            case 9:
                permiso_otro = this.responseAuth.Response.tpo_pago_contado;
                this.permiso_otro_name = 'tpo_pago_contado';
                break;
            case 0:
                permiso_otro = true;
                this.permiso_otro_name = 'pago_bono';
                break;
        }
        this.autenticadorFirmantesService
            .requestFirmanteAutentication(permiso_otro, `No tiene permiso para usar el tipo de pago (${this.permiso_otro_name})`,
                'Facturacion', () => {
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
        this.totalProducts = this.comprobanteDataModel.total;
        this.comprobanteDataModel.productos.forEach(product => {
            if (product.itbis) {
                this.totalProducts += product.price * 0.18;
            }
        });
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
                this.creditUserService.searchCreditUser(rnc).then(
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
                            this.comprobanteDataModel.cliente = result.Response.split('-')[0];
                            this.comprobanteDataModel.rnc = rnc;
                            this.client_rnc = result.Response.split('-')[0];
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

    pagar = (): void => {
        if (this.comprobanteDataModel.numeroPlaca !== '' && this.comprobanteDataModel.numeroPlaca !== '') {
            this.comprobanteDataModel.placa = this.comprobanteDataModel.letraPlaca + this.comprobanteDataModel.numeroPlaca;
        } else {
            this.comprobanteDataModel.placa = '';
        }

        this.result = new RespuestaSaleDetailFacturacion(this.comprobanteDataModel, 'PagarComprobante');
        this.close();
    }
    saveComprobante = (): void => {
        if (this.comprobanteDataModel.numeroPlaca !== '') {
            this.comprobanteDataModel.placa = this.comprobanteDataModel.letraPlaca + this.comprobanteDataModel.numeroPlaca;
        } else {
            this.comprobanteDataModel.placa = '';
        }
        this.result = new RespuestaSaleDetailFacturacion(this.comprobanteDataModel, 'SaveComprobante');
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
        } else if (this.comprobanteDataModel.metodo_pago === 'Otros') {
            if (this.comprobanteDataModel.cliente !== '' && this.comprobanteDataModel.rnc !== ''
                && this.comprobanteDataModel.codigo_ncf !== '' && this.comprobanteDataModel.tipo_otro != '0'
                && this.comprobanteDataModel.dato_otro != '') {
                return true;
            } else {
                return false;
            }
        }
        return false;
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
        this.result = new RespuestaSaleDetailFacturacion(null, 'cancelarOperacion');
        this.close();
    }
    imprimir = () => {
        this.comprobanteDataModel.placa = this.comprobanteDataModel.letraPlaca + this.comprobanteDataModel.numeroPlaca;
        if (this.comprobanteDataModel.metodo_pago == 'Efectivo') {
            this.result = new RespuestaSaleDetailFacturacion(this.comprobanteDataModel, 'imprimirEfectivo');
            this.close();
        } else if (this.comprobanteDataModel.metodo_pago == 'Tarjeta') {
            if (this.comprobanteDataModel.tarjeta != '' &&
                this.comprobanteDataModel.tarjeta.length == 4) {
                this.result = new RespuestaSaleDetailFacturacion(this.comprobanteDataModel, 'imprimirTarjeta');
                this.close();
            } else {
                this.popupProviderService.SimpleMessage('Facturacion', 'Debe introducir los últimos 4 dígitos de la tarjeta',
                    PopupType.WARNING);
            }
        } else if (this.comprobanteDataModel.metodo_pago == 'Otros') {
            if (this.comprobanteDataModel.tipo_otro != '' &&
                this.comprobanteDataModel.dato_otro != '') {
                this.result = new RespuestaSaleDetailFacturacion(this.comprobanteDataModel, 'imprimirOtros');
                this.close();
            } else {
                this.popupProviderService.SimpleMessage('Facturacion', 'Debe completar los campos de Otros',
                    PopupType.WARNING);
            }

        }
    }
    toggleKeyboardInput = (value: boolean) => {
        this.keyboard = value;
    }
    changeTipoPago = (tp: string) => {
        if (tp === 'Efectivo' || tp === 'Tarjeta' || tp === 'Otros') {
            this.comprobanteDataModel.metodo_pago = tp;
            $('.BTP').removeClass('btn-warning');
            $('#btn' + tp).removeClass('btn-secondary');
            $('#btn' + tp).addClass('btn-warning');
        }
    }
    exit() {
        this.result = new RespuestaSaleDetailFacturacion(null, 'salir');
        this.close();
    }
}
