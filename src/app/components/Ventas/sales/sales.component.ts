import { Component, OnInit } from "@angular/core";
import { Sale, SaleWithVoucher } from "../../../models/ventas/sale.model";
import { SaleDetail } from "../../../models/ventas/sale_detail.model";
import { SalesService } from "../../../services/sales.service";
import { Producto } from "../../../models/productos/producto.model";
import { ProductosService } from "../../../services/productos.service";
import { GenericResponse } from "../../../models/GenericResponse.model";
import { UsuarioAutenticado } from "../../../models/usuarios/UsuarioAutenticado.model";
import { Router } from "@angular/router";
import { DialogService } from "ng6-bootstrap-modal";
import { RespuestaAutenticacionBombero } from "app/modalsGenerales/RespuestaAutenticacionBombero.model";
import { PrintServiceService } from "app/services/print-service.service";
import { AutenticadorBomberosService } from "app/services/autenticador-bomberos.service";
import {
  PopupProviderService,
  PopupType,
} from "app/services/popupProvider.service";
import { SaleModalComponent } from "./modals/sales-modal.component";
import {
  ComprobanteDataModelFacturacion,
} from "app/models/listado-ventas/ComprobanteDataModel.model";
import { VentasService } from "app/services/ventas.service";
import { Bombero } from "app/models/bomberos/bomberos.model";
import { AperturaTurnosService } from "app/services/apertura_turno.service";
declare var alertify;
@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
})
export class SalesComponent implements OnInit {
  public loading: boolean = false;
  public creando: boolean = false;
  public page: number = 1;
  public limit: number = 5;
  public total: number = 0;
  public is_bombero: boolean = false;
  public mostrando: boolean = false;
  public products: Array<Producto>;
  public facturas: Array<Sale>;
  private MODAL_AUTENTICACION_BOMBEROS: any;
  public Venta: Sale;
  public detallesGenerales: SaleDetail[] = [];
  MODAL_DETALLE_VENTA: any;
  bomberoSelected = "";
  productSelected = "";
  search = "";
  bomberos: Bombero[] = [];
  fechaDesde = "";
  fechaHasta = "";
  comprobanteDataModel: ComprobanteDataModelFacturacion = {
    bombero: "",
    cliente: "",
    codigo_ncf: "",
    dato_otro: "",
    letraPlaca: "",
    metodo_pago: "",
    numeroPlaca: "",
    placa: "",
    productos: [],
    rnc: "",
    tarjeta: "",
    tipo_otro: "",
    total: 0,
    itbis: 0,
  };
  es: any;
  responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(
    localStorage.getItem("currentUser")
  );
  MENU_ACTUAL = "NINGUNO";

  constructor(
    private popupProviderService: PopupProviderService,
    private productsService: ProductosService,
    private dialogService: DialogService,
    private aperturaTurnosService: AperturaTurnosService,
    private salesService: SalesService,
    private router: Router,
    private autenticatorBombero: AutenticadorBomberosService,
    private AutenticadorBomberosService: AutenticadorBomberosService,
    private printer: PrintServiceService,
    private ventasService: VentasService
  ) {
    let responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(
      localStorage.getItem("currentUser")
    );
    if (responseAuth.PossibleError == "") {
      if (responseAuth.Response.sales == false) {
        this.router.navigate(["permisodenegado"]);
      } else {
        this.InicializarVenta();
        this.getProducts();
      }
    } else {
      this.popupProviderService.SimpleMessage(
        "Sesion Fallida",
        "No se puedo obtener la sesión",
        PopupType.ERROR
      );
    }
  }

  generateSalesReport() {
    let sales_codes = "";
    this.facturas.forEach((x) => (sales_codes += "," + x.codigo));

    this.printer.openNewTab(
      `WebForms/SalesReport.aspx?sales_codes=${sales_codes}`,
      "Reporte de ventas"
    );
  }

  verVenta = (ventaEntrante: Sale) => {
    this.printer.openNewTab(
      `WebForms/Facturacion.aspx?codigo_sale=${ventaEntrante.codigo}`,
      "Factura"
    );
  };
  cancelSale = (ventaEntrante: Sale) => {
    this.salesService
      .cancelSale(ventaEntrante)
      .then((response) => {
        if (response.Success) {
          alertify.success("Venta anulada");
          this.getSales();
        } else {
          alertify.error("Venta no anulada");
        }
      })
      .catch((error) => {
        this.popupProviderService.SimpleMessage(
          "Facturación",
          error,
          PopupType.ERROR
        );
      });
  };
  TotalizarDetails = (): number => {
    let total = 0;
    let itbis = 0;

    this.Venta.detalles.map((detalle: SaleDetail) => {
      total += detalle.price * detalle.quantity;
      // itbis
    });
    return total;
  };
  cancelVentaConfirm = (ventaEntrante: Sale) => {
    this.popupProviderService.QuestionMessage(
      "Estás seguro de anular la venta?",
      "Los productos se restableceran del stock",
      PopupType.WARNING,
      "SI!",
      "NO!",
      () => {
        this.cancelSale(ventaEntrante);
      },
      () => {}
    );
  };
  addProductToList = (product: Producto) => {
    if (this.productExistsInList(product)) {
      alertify.message("El producto ya se encuentra en la lista");
      return;
    }
    //SI llego a este punto, quiere decir que el producto no ha sido añadido a la lista entonces lo agrego
    this.Venta.detalles.push(
      new SaleDetail(
        product.description,
        1,
        product.id,
        product.price,
        product.itbis
      )
    );

    this.Venta.total = this.TotalizarDetails();
  };
  onSubmit = () => {
    this.MODAL_AUTENTICACION_BOMBEROS =
      this.autenticatorBombero.requestBomberoAutentication(
        "Facturación",
        (returnResult: RespuestaAutenticacionBombero): void => {
          this.MODAL_AUTENTICACION_BOMBEROS.unsubscribe();

          this.comprobanteDataModel.productos = this.Venta.detalles;
          this.comprobanteDataModel.bombero = returnResult.bombero.bombero;

          this.comprobanteDataModel.total = this.TotalizarDetails();

          this.MODAL_DETALLE_VENTA = this.dialogService
            .addDialog(SaleModalComponent, {
              comprobanteDataModel: this.comprobanteDataModel,
            })
            .subscribe((respuestaDetalleVenta) => {
              //TODO: depend of the response make the payment

              this.Venta.id_bombero = returnResult.bombero.id_bombero;
              this.Venta.bombero = returnResult.bombero.bombero;
              this.Venta.total = this.TotalizarDetails();
              this.Venta.tipo_pago =
                respuestaDetalleVenta.comprobanteDataModel.metodo_pago;

              if (respuestaDetalleVenta.respuesta === "PagarComprobante") {
                this.Venta.placa =
                  respuestaDetalleVenta.comprobanteDataModel.placa;
                this.Venta.tarjeta =
                  respuestaDetalleVenta.comprobanteDataModel.tarjeta;
                this.Venta.cliente =
                  respuestaDetalleVenta.comprobanteDataModel.cliente;
                this.Venta.rnc = respuestaDetalleVenta.comprobanteDataModel.rnc;
              }

              const saleWithVoucher: SaleWithVoucher = {
                sale: this.Venta,
                voucher: {
                  client: "",
                  NCF: "",
                  RNC: "",
                  fuel: "",
                  paymentMethod: "",
                },
              };

              if (respuestaDetalleVenta.respuesta === "SaveComprobante") {
                saleWithVoucher.voucher.RNC =
                  respuestaDetalleVenta.comprobanteDataModel.rnc;
                saleWithVoucher.voucher.NCF =
                  respuestaDetalleVenta.comprobanteDataModel.codigo_ncf;
                saleWithVoucher.voucher.client =
                  respuestaDetalleVenta.comprobanteDataModel.cliente;
                saleWithVoucher.voucher.paymentMethod =
                  respuestaDetalleVenta.comprobanteDataModel.metodo_pago;
              }

              this.salesService
                .saveSale(saleWithVoucher)
                .then((response) => {
                  if (response.Success) {
                    this.popupProviderService.SimpleMessage(
                      "Éxito",
                      "Venta registrada",
                      PopupType.SUCCESS
                    );

                    this.printer.openNewTab(
                      `WebForms/Facturacion.aspx?codigo_sale=${response.Response}`,
                      "Factura"
                    );
                    this.getSales();
                  } else {
                    this.popupProviderService.SimpleMessage(
                      "Venta no registrada",
                      response.PossibleError,
                      PopupType.ERROR
                    );
                  }
                })
                .catch((error) => {
                  this.popupProviderService.SimpleMessage(
                    "Facturación",
                    error,
                    PopupType.ERROR
                  );
                });
              this.creando = false;
              this.InicializarVenta();

              if (respuestaDetalleVenta.respuesta === "salir") {
                this.MODAL_DETALLE_VENTA.unsubscribe();
                this.MENU_ACTUAL = "NINGUNO";
              }
            });
        },
        () => {},
        { idBombero: 0 }
      );
  };
  removeProduct = (detalle: SaleDetail) => {
    this.Venta.detalles.splice(this.Venta.detalles.indexOf(detalle), 1);
    this.Venta.total = this.TotalizarDetails();
  };
  productExistsInList = (producto: Producto): boolean => {
    let result: boolean = false;
    if (this.Venta.detalles) {
      for (var i = 0; i < this.Venta.detalles.length; i++) {
        if (this.Venta.detalles[i].productid === producto.id) {
          result = true;
        }
      }
    }
    return result;
  };
  getProducts(page: number = 0) {
    this.loading = true;
    this.page = page !== 0 ? page : this.page;
    this.productsService
    .getProducts(this.page, this.limit, this.search)
    .then((result) => {
      if (result.PossibleError === "") {
        this.products = result.List;
        this.total = result.TotalRecords;
      }
      this.loading = false;
    })
    .catch((error) => {
      this.popupProviderService.SimpleMessage(
        "Sales",
        error,
        PopupType.ERROR
      );
      this.loading = false;
    });
}

  getGasJockeys = () => {
    this.aperturaTurnosService
      .cargarBomberos()
      .then((result) => {
        if (result.PossibleError == "") {
          this.bomberos = result.List;
        }
      })
      .catch((error) => {
        this.popupProviderService.SimpleMessage(
          "Apertura Turno",
          error,
          PopupType.ERROR
        );
      });
  };

  cancelar = () => {
    this.mostrando = false;
    this.creando = false;
    this.InicializarVenta();
  };
  nuevo = () => {
    this.creando = true;
    this.InicializarVenta();
  };
  InicializarVenta = () => {
    //INICIALIZO el ENTRY
    this.Venta = new Sale(
      "",
      "",
      "",
      0,
      "EMITIDO",
      0,
      "",
      "",
      "",
      0,
      "",
      "",
      ""
    );
    //INICIALIZO SUS ENTRY_DETAILS
    this.Venta.detalles = this.detallesGenerales.splice(
      0,
      this.detallesGenerales.length
    );
  };
  validate = (venta: Sale) => {
    return (
      venta.total != 0 &&
      venta.tipo_pago != "0" &&
      (venta.tipo_pago == "Efectivo" ||
        (venta.tipo_pago == "Tarjeta" && venta.tarjeta != "")) &&
      venta.detalles != null &&
      venta.detalles.length > 0
    );
  };

  getSales = () => {
    this.loading = true;
    this.salesService
      .getSales(
        this.fechaDesde,
        this.fechaHasta,
        this.bomberoSelected,
        this.productSelected,
        this.is_bombero
      )
      .then((response) => {
        if (response.PossibleError === "") {
          this.facturas = response.List;
          this.loading = false;
        } else {
          this.popupProviderService.SimpleMessage(
            "Facturación",
            response.PossibleError,
            PopupType.ERROR
          );
          this.loading = false;
        }
      })
      .catch((error) => {
        this.popupProviderService.SimpleMessage(
          "Facturación",
          error,
          PopupType.ERROR
        );
      });
  };

  ngOnInit() {
    if (this.responseAuth.Response.is_bombero) {
      this.AutenticadorBomberosService.requestBomberoAutentication(
        "Cerrar lados seleccionados",
        (result) => {
          this.bomberoSelected = result.bombero.bombero;
          this.is_bombero = true;
          this.getSales();
        },
        () => {},
        { idBombero: 0 }
      );
    } else {
      this.getSales();
      this, this.getGasJockeys();
    }
  }
}
