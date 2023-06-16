import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng6-bootstrap-modal";
import { Sale } from 'app/models/ventas/sale.model';
import { SaleDetail } from 'app/models/ventas/sale_detail.model';
import { ProductosService } from 'app/services/productos.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { Producto } from 'app/models/productos/producto.model';
import { Cuadre } from 'app/models/cuadres/cuadre.model';
import { SalesService } from 'app/services/sales.service';
declare var alertify;
export interface IVentasPorBomberoCuadre {
  ventasRecibidas: Array<Sale>;
  cuadreRecibido: Cuadre;
}
declare var $;
@Component({
  selector: 'app-modals',
  templateUrl: './ventas-por-bombero-cuadre.component.html'
})
export class VentasPorBomberoCuadreModalComponent extends
  DialogComponent<IVentasPorBomberoCuadre, string> implements IVentasPorBomberoCuadre, OnInit {
  ventasRecibidas: Array<Sale>;
  cuadreRecibido: Cuadre;
  disableInput:boolean;
  IsCardSale:boolean;
  CardSale:string="";
  ventas: Array<Sale>;
  public Venta: Sale = new Sale('', '', '', 0, 'EMITIDO', 0, '', 'Efectivo', '', 0, '', '', '');
  detalles: Array<SaleDetail>;
  public products: Array<Producto>;
  public detallesGenerales: SaleDetail[] = [];
  p = 1;
  p2 = 1;
  p3 = 1;
  sales_details: SaleDetail[] = [];

  ngOnInit() {
    this.Venta.detalles = [];
    this.ventas = this.ventasRecibidas;
    this.getProducts();

    this.Venta.turno = this.cuadreRecibido.turno;
    this.Venta.bombero = this.cuadreRecibido.bombero;
    this.Venta.id_bombero = this.cuadreRecibido.id_bombero;
  }
  constructor(dialogService: DialogService, private productsService: ProductosService, private popupProviderService: PopupProviderService, private salesService: SalesService) {
    super(dialogService);
    this.detalles = [];
    this.disableInput=false;
  }

  getProducts = () => {
    this.productsService.getProductos().then(
      result => {
        if (result.PossibleError == '') {
          this.products = result.List;
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Sales', error, PopupType.ERROR);
      });
  }

  addProductToList = (product: Producto, quantity) => {
    if (this.productExistsInList(product)) {
      this.popupProviderService.SimpleMessage('Facturación', 'El producto ya se encuentra en la lista', PopupType.ERROR);
      return;
    }
    if(this.IsCardSale && this.CardSale.length < 4){
      this.popupProviderService.SimpleMessage('Facturación', 'Debe digitar la tarjeta', PopupType.ERROR);
      return;
    }


    if(this.IsCardSale){
      this.Venta.tipo_pago="Tarjeta";
      this.Venta.tarjeta=this.CardSale;
    }else{
      this.Venta.tipo_pago="Efectivo";
      this.Venta.tarjeta="";
    }
    this.disableInput = true;
    
    //Si llego a este punto, quiere decir que el producto no ha sido añadido a la lista entonces lo agrego
    this.Venta.detalles = [];
    this.sales_details.push(new SaleDetail(product.description, parseInt(quantity), product.id, product.price, product.itbis));
    this.Venta.detalles.push(
      new SaleDetail(product.description, parseInt(quantity), product.id, product.price, product.itbis)
    );
    this.Venta.total = this.TotalizarDetails();

    this.saveProduct();
  };

  TotalizarDetails = (): number => {
    let total = 0;

    this.sales_details.map((detalle: SaleDetail) => {
      total += detalle.price * detalle.quantity;
      // itbis
    });
    return total;
  }

  cancelProduct(sale: Sale) {
    this.salesService.cancelSale(sale)
      .then(response => {
        if (response.Success) {
          this.ventas.splice(this.ventas.indexOf(sale), 1);
          this.popupProviderService.SimpleMessage('Facturacion', 'La venta fue anulada.', PopupType.SUCCESS);

        } else {
          this.popupProviderService.SimpleMessage('Facturacion', response.Response, PopupType.ERROR);
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Facturación', error, PopupType.ERROR);
      });
  }

  saveProduct() {
    this.salesService.saveSaleFromCuadre(this.Venta)
      .then(
        response => {
          if (response.Success) {
            this.ventas.splice(this.ventas.indexOf(this.Venta), 1);
            this.Venta.detalles = this.sales_details;
            this.ventas.push(this.Venta);
            this.popupProviderService.SimpleMessage('Éxito', 'Venta registrada', PopupType.SUCCESS);
          } else {
            this.popupProviderService.SimpleMessage('Venta no registrada', response.PossibleError, PopupType.ERROR);
          }
        }
      ).catch(error => {
        this.popupProviderService.SimpleMessage('Facturación', error, PopupType.ERROR);
      });
    // this.InicializarVenta();
  }

  InicializarVenta = () => {
    //INICIALIZO el ENTRY
    this.Venta = new Sale('', '', '', 0, 'EMITIDO', 0, '', '', '', 0, '', '', '');
    //INICIALIZO SUS ENTRY_DETAILS
    this.Venta.detalles = this.detallesGenerales.splice(0, this.detallesGenerales.length);
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

  verDetalles(venta: Sale) {
    this.detalles = venta.detalles;
  }

  cerrar() {
    this.close();
  }

  pageChanged(event) {
    this.detalles = [];
    this.p = event;
  }
}
