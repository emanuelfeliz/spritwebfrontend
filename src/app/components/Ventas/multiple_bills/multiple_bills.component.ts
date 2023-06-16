import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../services/productos.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { SalesService } from '../../../services/sales.service';
import { TipoComprobante } from '../../../models/listado-ventas/tipo_comprobante.model';
import { Bill } from '../../../models/multiple_bills/Bill.model';
import { Product } from '../../../models/multiple_bills/product.model';
import { VentasService } from '../../../services/ventas.service';
import { PrintServiceService } from '../../../services/print-service.service';
import { Router } from '@angular/router';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';

@Component({
  selector: 'app-multiple_bills',
  templateUrl: './multiple_bills.component.html',
  styleUrls: ['./multiple_bills.component.css']
})

export class MultipleBills implements OnInit {

  productSelected: "Combustible" | "Products_of_warehouse" = "Products_of_warehouse";
  products: Array<Product>;
  products_warehouse: Array<Product>;
  products_fuel: Array<Product>;
  rnc = '';
  ncf = '';
  clientName = '';
  loadingRnc = false;
  bills: Bill[] = [];
  TIPOS_COMPROBANTES: Array<TipoComprobante>;
  toggleProduct = true;
  productIsSelected = false;
  newBill: Bill = {
    Payment_method: 'Efectivo',
    Price: 0,
    Itbis: 0,
    Product: null,
    Quantity: 0,
    Subtotal: 0,
    Total: 0,
    Voucher_type: '',
    Card: '',
    Amount: 0,
    Product_id: 1,
    Product_type: 1,
    RNC: '',
    ClientName: '',
    NCF: ''
  };

  responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem("currentUser"));
  alterVolume = false;
  constructor(private popupProviderService: PopupProviderService, private productService: ProductosService,
    private salesService: SalesService, private router: Router,
    private ventasService: VentasService, private printer: PrintServiceService) {

  }

  ngOnInit(): void {
    //Comprobantes 
    
    this.TIPOS_COMPROBANTES = [
      new TipoComprobante('1-Factura para crédito fiscal', '01'),
      new TipoComprobante('8-Regimenes Especiales de Tributacion', '14'),
      new TipoComprobante('9-Comprobantes Gurbernamentales', '15')
    ];
    //Comprobantes
    this.loadTanksProducts();
    this.loadWarehouseProducts();
    this.changeProductsType();
    if(this.router.getNavigatedData()){
      this.mapFacturaComprobanteToFactura(JSON.parse(this.router.getNavigatedData()));
    }

    if (this.router.getNavigatedData() === undefined) {
      this.cleanBill();
    }

  }

  mapFacturaComprobanteToFactura(facturaComprobante): void {

    this.newBill.Product = facturaComprobante.combustible;
    this.newBill.Voucher_type = facturaComprobante.descripcion;
    this.newBill.Payment_method = facturaComprobante.forma_pago;
    this.newBill.Card = facturaComprobante.tarjeta;
    this.newBill.Amount = facturaComprobante.monto;
    this.newBill.Quantity = facturaComprobante.volumen;
    this.newBill.NCF = facturaComprobante.ncf;
    this.ncf = facturaComprobante.ncf;
    this.newBill.ClientName = facturaComprobante.cliente;
    this.newBill.RNC = facturaComprobante.rnc;
    this.addNewBill();
    this.cleanBill();
  }

  loadWarehouseProducts() {
    this.productService.getProductsFromWarehouse()
      .then((result) => {
        if (result.PossibleError === '') {
          this.products_warehouse = result.List;
          this.products = this.products_warehouse;
        }
      })
      .catch((error) => {
        this.popupProviderService.SimpleMessage('Facturación Multiple', 'Error cargando los productos del almacen', PopupType.ERROR);
      });
  }

  loadTanksProducts() {
    this.productService.getAllProducts()
      .then((result) => {
        if (result.PossibleError === '') {
          this.products_fuel = result.List;
        }
      })
      .catch(error => {
        this.popupProviderService.SimpleMessage('Facturación Multiple', 'Error cargando los gasolinas', PopupType.ERROR);
      });
  }

  changePrice = (AmountOrQuantity:number): void => {
    this.calcular(AmountOrQuantity);
  }

  calcular = (AmountOrQuantity?:number): void => {
    if (this.newBill.Product !== '' && this.newBill.Product != null && this.newBill.Product !== 'undefined') {
      const Product: Product = this.products.find(x => {
        return x.name == this.newBill.Product;
      });

      if (this.responseAuth.Response.allow_user_insert_volume_and_price_in_multiple_bills) {
        this.newBill.Total = this.newBill.Amount;
        // return;
      }

       if (this.productSelected === 'Combustible') {
        if (AmountOrQuantity == 1) {
          this.newBill.Quantity = this.newBill.Amount / Product.price;
        } else if (AmountOrQuantity == 2 && !this.alterVolume) {
          this.newBill.Amount = this.newBill.Quantity * Product.price;
        }

        this.newBill.Total = this.newBill.Amount;
      }

       if (this.productSelected === 'Products_of_warehouse') {
        this.newBill.Product_type = 2;
        this.newBill.Amount = Product.price;
        this.newBill.Itbis = (0.18 * Product.price);
        this.newBill.Total = ((this.newBill.Amount * this.newBill.Quantity) + (this.newBill.Itbis * this.newBill.Quantity));
      }

      this.newBill.Product_id = Product.product_id;
    }
  }

  changeProduct = (): void => {
    if (this.newBill.Product !== '' && this.newBill.Product != null && this.newBill.Product !== 'undefined') {
      this.productIsSelected = true;
    }else{
      this.productIsSelected = false;
    }
    this.calcular(1);
  }

  addNewBill = (): void => {
    this.newBill.RNC = this.rnc;
    this.newBill.NCF = this.ncf;
    this.newBill.ClientName = this.clientName;
    this.bills.push(this.newBill);

    this.cleanBill();
  }

  checkBill() {
    const exist: boolean = this.bills.find(x => {
      return x.Product == this.newBill.Product
    }) == null ? false : true;

    if (!exist) {
      this.addNewBill();
      return;
    }

    this.popupProviderService.SimpleMessage('Factura multiple',
      'El Producto ya esta en la lista, si desea actualizar el producto debe eliminarlo y proceder agregarlo con los valores deseados',
      PopupType.INFO);
  }

  validate(): boolean {
    if (this.newBill.Product !== '' && this.newBill.Voucher_type.length > 0 &&
      this.newBill.Payment_method !== '' && this.newBill.Product !== '' && this.clientName !== '' && this.rnc !== '') {
      if (this.productSelected === 'Combustible') {
        return this.newBill.Amount > 0;
      }

      if (this.productSelected === 'Products_of_warehouse') {
        return this.newBill.Quantity > 0 && this.newBill.Itbis > 0;
      }
    }
    return false;
  }

  invoice(): void {
    this.salesService.multiplesBils(this.bills)
      .then((result) => {
        if (result.Response === 'SI') {
          this.popupProviderService.SimpleMessage('Factura Multiple', 'La factura ha sido genereda', PopupType.SUCCESS);
          this.clientName = '';
          this.rnc = '';
          this.bills = [];
          this.printer.openNewTab(`WebForms/MultipleBills.aspx?masterInvoiceId=${result.Details}`, 'Factura Multiple');
        }

        else {
          this.popupProviderService.SimpleMessage('Factura Multiple', `${result.Response}`, PopupType.ERROR);
        }
      })
      .catch((error) => {
        this.popupProviderService.SimpleMessage('Factura Multiple', 'Error de parte del server', PopupType.ERROR);
        console.log(error);
      });
  }

  remover = (bill: Bill): void => {
    this.bills.splice(this.bills.indexOf(bill), 1);
  }

  changeProductsType() {
    this.cleanBill();
    (this.productSelected === 'Combustible') ? this.products = this.products_fuel : this.products = this.products_warehouse;
  }

  cleanBill() {
    this.newBill = {
      Payment_method: 'Efectivo',
      Price: 0,
      Itbis: 0,
      Product: '',
      Quantity: 0,
      Subtotal: 0,
      Total: 0,
      Voucher_type: '',
      Card: '',
      Amount: 0,
      Product_id: 1,
      Product_type: 1,
      RNC: '',
      ClientName: '',
      NCF: ''
    };
    
    this.rnc = '';
    this.clientName = '';
  }

  anyElements(): boolean {
    return this.bills.length > 0;
  }

  findRnc = () => {
    this.loadingRnc = true;
    setTimeout(() => {
      this.ventasService.getClientByRnc(this.rnc).then(
        result => {
          if (result.Response === 'NO_DATA') {
            this.popupProviderService.SimpleMessage('Buscar Cliente', `No hay cliente con el rnc ${this.rnc}`, PopupType.ERROR);

            this.rnc = '';
            this.clientName = '';
            this.loadingRnc = false;
            return;
          }
          if (result.PossibleError == '' && result.Success) {
            this.clientName = result.Response;
            this.loadingRnc = false;
            return;
          }
        }
      ).catch(error => {
        this.popupProviderService.SimpleMessage('RNC ERROR', error, PopupType.ERROR);
      });
    }, 250);
  }

  activeQuantityField() {
    if (this.responseAuth.Response.allow_user_insert_volume_and_price_in_multiple_bills) {
      return false;
    }else if (this.productSelected == 'Combustible' && this.responseAuth.Response.allow_user_insert_volume_and_price_in_multiple_bills) {
      return false;
    }else{
      return true;
    }
    
    
  }
}
