import { VentaFabricada } from './../../../../../models/listado-ventas/VentaFabricada.model';
import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng6-bootstrap-modal";
import { Pago, Verifone } from 'app/models/pagos/Pago.model';
import { Venta } from 'app/models/listado-ventas/venta.model';
import { VentaModalComponent } from 'app/components/Ventas/listado-ventas/modals/Venta/venta_modal.component';
import { ProductoPorTurno } from 'app/models/cuadres/ProductoPorTurno.model';
import { CuadresService } from 'app/services/cuadre.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { ProductosService } from '../../../../../services/productos.service';
import { Product } from '../../../../../models/multiple_bills/product.model';
import { VentasService } from '../../../../../services/ventas.service';
import { AutenticadorFirmantesService } from '../../../../../services/autenticador-firmantes.service';
import { GenericResponse } from '../../../../../models/GenericResponse.model';
import { UsuarioAutenticado } from '../../../../../models/usuarios/UsuarioAutenticado.model';
import { ComprobanteDataModel } from '../../../../../models/listado-ventas/ComprobanteDataModel.model';
import { TipoComprobante } from '../../../../../models/listado-ventas/tipo_comprobante.model';
import { CreditUserService } from 'app/services/credit_user.service';
import { Cuadre } from 'app/models/cuadres/cuadre.model';

export interface IPagosPorBombero {
  pagosRecibidos: Array<Pago>;
  bomberoRecibido: string;
  startDateRecibido: string;
  startTimeRecibido: string;
  readOnly_recibido: boolean;
  cuadre: Cuadre;
}

export interface IComprobanteDataModel {
  comprobanteDataModel: ComprobanteDataModel;
}

declare var $;
@Component({
  selector: 'app-modals',
  templateUrl: './pagos-por-bombero-cuadre.component.html'
})
export class PagosPorBomberoCuadreModalComponent extends DialogComponent<IPagosPorBombero, string> implements IPagosPorBombero, OnInit {
  pagosRecibidos: Array<Pago>;
  bomberoRecibido: string;
  startDateRecibido: string;
  readOnly_recibido: boolean;
  startTimeRecibido: string;
  cuadre: Cuadre;

  p = 1;
  bombero: string;
  pagos: Array<Pago>;
  MODAL_VENTA: any;
  startDate: string;
  startTime: string;
  metodo_pago = 'Tarjeta';
  tipo_otro: string = "Ninguno";
  tarjeta: string;
  dato_otro: string;
  Productos: Array<Product>;
  volumen: number;
  monto: number;
  productSelected: string;
  price: number = 0;

  OPCION_ACTUAL: number;
  keyboard = true;
  comprobanteDataModel: ComprobanteDataModel;
  loadingRnc = false;
  ShowingAlertRnc = false;
  creatingRnc = false;
  PC: Map<number, string> = new Map<number, string>()
    .set(2, '0').set(1, '01').set(2, '02').set(3, '03')
    .set(4, '04').set(5, '05').set(6, '12').set(7, '13')
    .set(8, '14').set(9, '15');
  TIPOS_COMPROBANTES: Array<TipoComprobante>;
  arrayWordPlaca = [
    'A', 'G', 'I', 'L', 'K', 'X', 'OE', 'OM', 'EA', 'EI', 'EG', 'EL', 'O', 'ED', 'EM', 'DD', 'Z', 'YX',
    'D', 'C', 'P', 'B', 'M', 'F', 'T', 'H', 'S',
    'U', 'J', 'W', 'OI', 'VC', 'EX', 'OF', 'OP'
  ];
  permiso_otro_name: string;
  client_rnc: string;
  verifones_list: Verifone[] = [];
  verifone_selected = '';
  responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));

  descuento: number = 0;

  discount_amount_by_gallons: number = 0;

  ngOnInit() {
    this.pagos = this.pagosRecibidos;
    this.bombero = this.bomberoRecibido;
    this.startDate = this.startDateRecibido;
    this.startTime = this.startTimeRecibido;

    this.comprobanteDataModel = new ComprobanteDataModel('', '', '', '', '', '', '', '', '', '');
    this.loadTanksProducts();

  }

  changePrice = (): void => {
    this.calcularGalones();
  }
  agregar = (): void => {

    if (this.tipo_otro === 'Pago Contado Instantaneo') {
      this.descuento += this.discount_amount_by_gallons * this.volumen;
      this.cuadre.total_descuento += this.descuento;
    }
    if(this.tipo_otro === 'Ninguno' || this.tipo_otro === null){
      this.tipo_otro = "";
    }

    this.pagos.push(new Pago('pago_interno', this.client_rnc, this.comprobanteDataModel.rnc, null, this.metodo_pago, this.dato_otro, this.tipo_otro, this.bombero,
      new VentaFabricada(this.productSelected, this.volumen, this.monto), this.tarjeta, '', this.monto, '', 0, '', this.price, this.volumen, this.comprobanteDataModel.instantDiscount || false));

    this.dato_otro = '';
    this.tipo_otro = 'Ninguno';
    this.productSelected = '';
    this.volumen = 0;
    this.monto = 0;
  }

  remover = (pago: Pago): void => {

    console.log(pago)


    this.autenticadorFirmantesService
      .requestFirmanteAutentication(this.responseAuth.Response.anular_pago, "No tiene permisos para anular pagos",
        "Pagos", () => {
          this.popupProviderService.QuestionMessage("Eliminar pago",
            "Estás seguro de eliminar el pago?, Esta accion no es reversible", PopupType.QUESTION, "Si", "No",
            () => {
              this.ventasService.anularPago(pago, true).then(
                result => {
                  if (result.Success) {
                    if (pago.tipo_otro === 'Pago Contado Instantaneo') {
                      this.searchCreditUser(pago.rnc, false, false, true, pago);
                    }
                    this.pagos.splice(this.pagos.indexOf(pago), 1);
                    this.popupProviderService.SimpleMessage("Pagos", "Pago eliminado", PopupType.SUCCESS);
                  } else {
                    this.popupProviderService.SimpleMessage("Pagos", "El pago no fue eliminado", PopupType.WARNING);
                  }
                }
              ).catch(error => {
                this.popupProviderService.SimpleMessage('Pagos', error, PopupType.ERROR);
              });
            }, () => {

            });
        }, { permisoRecibido: "anular_pago" });
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

  calcularGalones = (): void => {
    if (this.productSelected !== '' && this.productSelected != null && this.productSelected !== 'undefined') {
      const Producto: ProductoPorTurno = this.Productos.find(x => {
        return x.name == this.productSelected;
      });
      this.price = Producto.price;
      this.volumen = this.monto / this.price;
    }
  }

  loadTanksProducts() {
    this.productService.getAllProducts()
      .then((result) => {
        if (result.PossibleError === '') {
          this.Productos = result.List;
        }
      })
      .catch(error => {
        this.popupProviderService.SimpleMessage('Facturación Multiple', 'Error cargando los gasolinas', PopupType.ERROR);
      });
  }

  changeProduct = (): void => {
    // alert(this.productSelected);
    this.calcularGalones();
  }
  validate = (): boolean => {
    if (this.metodo_pago === 'Tarjeta') {
      return this.monto > 0 && this.volumen > 0 && this.productSelected != "";
    } else if (this.metodo_pago === 'Otros') {
      return this.monto > 0 && this.volumen > 0 && this.productSelected != "" && this.tipo_otro != "" && this.dato_otro != "";
    }
    return false;

  }
  verDetalles = (venta: Venta): void => {
    this.MODAL_VENTA = this.dialogService.addDialog(VentaModalComponent, {
      ventaRecibidaFabricada: null,
      ventaRecibidaSistema: venta
    }).subscribe(
      result => {
        if (result === 'close') {
          this.MODAL_VENTA.unsubscribe();
        }
      });
  }
  constructor(private popupProviderService: PopupProviderService, dialogService: DialogService, private cuadreService: CuadresService,
    private productService: ProductosService, private ventasService: VentasService, private autenticadorFirmantesService: AutenticadorFirmantesService, private creditUserService: CreditUserService) {
    super(dialogService);
  }
  cerrar() {
    this.close();
  }

  tipoOtroChange = (tipoOtro: string) => {
    this.permiso_otro_name = tipoOtro;
    if (this.tipo_otro == 'Vales de Crédito')
      this.permiso_otro_name = "Vales_Credito";

    if (this.tipo_otro === "Pago Contado Instantaneo") {
      this.comprobanteDataModel.instantDiscount = true;
    }
  }

  searchCreditUser = (rnc: string, setData = true, calculateDiscount = false, minus = false, pago: Pago = undefined) => {
    setTimeout(() => {
      if (!this.ShowingAlertRnc) {
        this.loadingRnc = true;
        this.creditUserService.SearchCreditUserAndReturnsComplete(rnc).then(
          result => {
            if (!result.Success) {
              this.ShowingAlertRnc = true;
              this.popupProviderService.SimpleMessage('Buscar Cliente', `No hay cliente con el rnc ${rnc}`, PopupType.ERROR);
              setTimeout(() => {
                this.ShowingAlertRnc = false;
              }, 1000);
              this.comprobanteDataModel.rnc = '';
              this.comprobanteDataModel.cliente = '';
              this.loadingRnc = false;
              return;
            }
            if (result.PossibleError === '' && result.Success) {

              if (setData) {
                console.log('Setting data.')
                this.comprobanteDataModel.cliente = result.Response.CompanyName;
                this.comprobanteDataModel.rnc = rnc.trim();
                this.client_rnc = result.Response.CompanyName;
                this.loadingRnc = false;
                $('#rnc_clientInput').prop('disabled', true);
              }

              debugger;
              if (calculateDiscount) {
                if (pago.venta_sistema.SaleId !== 0)
                  this.cuadre.total_descuento += (result.Response.discountAmount || 0) * pago.venta_sistema.Volume;
                else
                  this.cuadre.total_descuento += (result.Response.discountAmount || 0) * pago.venta_fabricada.Volume;
              }

              if (minus) {
                if (pago.venta_sistema.SaleId !== 0)
                  this.cuadre.total_descuento -= (result.Response.discountAmount || 0) * pago.venta_sistema.Volume;
                else
                  this.cuadre.total_descuento -= (result.Response.discountAmount || 0) * pago.venta_fabricada.Volume;
              }

              this.discount_amount_by_gallons = result.Response.discountAmount || 0;

              return;
            }
          }
        ).catch(error => {
          this.popupProviderService.SimpleMessage('RNC ERROR', 'Error', PopupType.ERROR);
        });;
      }
    }, 250);
  }
}
