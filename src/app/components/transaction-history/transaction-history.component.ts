import { HttpService } from './../../services/communication_services/http.service';
import { Component, OnInit } from '@angular/core';
import { Sale } from './../../models/ventas/sale.model';
import { SaleDetail } from './../../models/ventas/sale_detail.model';
import { Producto } from './../../models/productos/producto.model';
import { GenericResponse, IResponseWithList } from './../../models/GenericResponse.model';
import { Router } from '@angular/router';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { ComprobanteDataModelFacturacion } from 'app/models/listado-ventas/ComprobanteDataModel.model';
import { Bombero } from 'app/models/bomberos/bomberos.model';
import { IAzulResponse, IAzulCancellation, IAzulRefund } from 'app/models/azul/IRequest';
import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';
import { environment } from 'environments/environment';

declare var alertify;

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {

  public loading: boolean = false;
  public creando: boolean = false;
  public is_bombero: boolean = false;
  public mostrando: boolean = false;
  public products: Array<Producto>;
  public facturas: Array<Sale>;
  private MODAL_AUTENTICACION_BOMBEROS: any;
  public Venta: Sale;
  public detallesGenerales: SaleDetail[] = [];
  MODAL_DETALLE_VENTA: any;
  bomberoSelected = '';
  productSelected = '';
  bomberos: Bombero[] = [];
  fechaDesde = '';
  fechaHasta = '';
  comprobanteDataModel: ComprobanteDataModelFacturacion = {
    bombero: '',
    cliente: '',
    codigo_ncf: '',
    dato_otro: '',
    letraPlaca: '',
    metodo_pago: '',
    numeroPlaca: '',
    placa: '',
    productos: [],
    rnc: '',
    tarjeta: '',
    tipo_otro: '',
    total: 0,
    itbis: 0
  };
  es: any;
  responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
  MENU_ACTUAL = 'NINGUNO';

  public transactions: Array<IAzulResponse>;

  constructor(private popupProviderService: PopupProviderService, private router: Router, private httpService: HttpService) {
    let responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError == '') {
      if (responseAuth.Response.sales == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.getTransactions();
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }
  }

  getTransactions(): void {
    this.httpService.Get<IResponseWithList<IAzulResponse>>(environment.Urls.PaymentGatewayApi, 'Azul/Transactions')
      .subscribe(result => {
        if (result.success) {
          this.transactions = result.list;
          console.log(this.transactions);
        } else {
          this.popupProviderService.SimpleMessage('Historial de transacciones', `Error: ${result.error}`, PopupType.ERROR);
        }
      },
        error => {
          this.popupProviderService.SimpleMessage('Historial de transacciones', 'Error de comunicacion con el servidor, favor intentar mas tarde', PopupType.ERROR);
          console.log(error);
        }
      );
  }

  cancelSale(transaction: IAzulResponse) {

    if (transaction.authorizationNumber === '' || transaction.authorizationNumber === undefined) {
      this.popupProviderService.SimpleMessage('Historial de transacciones', 'Esta transaccion no puede ser cancelada.', PopupType.INFO);
      return;
    }

    let azulCancellation: IAzulCancellation = {
      itbis: '0',
      authorizationNumber: transaction.authorizationNumber,
      terminalId: '01290010',
      merchantId: '39036630010',
      amount: transaction.amount,
      orderNumber: transaction.orderNumber,
    };
    this.httpService.Post<IResponseWithList<IAzulResponse>, IAzulCancellation>(environment.Urls.PaymentGatewayApi, 'Azul/Sale/Cancel', azulCancellation)
      .subscribe(result => {
        if (result.success) {
          this.getTransactions();
          this.popupProviderService.SimpleMessage('Historial de transacciones', result.message, PopupType.SUCCESS);
        } else {
          this.popupProviderService.SimpleMessage('Historial de transacciones', result.error, PopupType.ERROR);
        }
      },
        error => {
          console.log(error);
          this.popupProviderService.SimpleMessage('Historial de transacciones', 'Error de parte del servidor, favor intentar mas tarde', PopupType.ERROR);
        });
  }

  refundSale(transaction: IAzulResponse) {
    let azulRefund: IAzulRefund = {
      itbis: '0',
      terminalId: '01290010',
      merchantId: '39036630010',
      amount: transaction.amount,
      orderNumber: transaction.orderNumber,
    };
    this.httpService.Post<IResponseWithList<IAzulResponse>, IAzulRefund>(environment.Urls.PaymentGatewayApi, 'Azul/Sale/Refund', azulRefund)
      .subscribe(result => {
        if (result.success) {
          this.getTransactions();
          this.popupProviderService.SimpleMessage('Historial de transacciones', result.message, PopupType.SUCCESS);
        } else {
          this.popupProviderService.SimpleMessage('Historial de transacciones', result.error, PopupType.ERROR);
        }
      },
        error => {
          console.log(error);
          this.popupProviderService.SimpleMessage('Historial de transacciones', 'Error de parte del servidor, favor intentar mas tarde', PopupType.ERROR);
        });
  }

  ngOnInit() {

  }

}
