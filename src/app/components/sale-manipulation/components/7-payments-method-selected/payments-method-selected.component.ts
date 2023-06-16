import { Component, OnInit } from '@angular/core';
import { SaleManipulationProviderService } from '../../services/sale-manipulation-provider.service';
import { Venta } from '../../../../models/listado-ventas/venta.model';
import { Router } from '@angular/router';
import { PopupProviderService, PopupType } from '../../../../services/popupProvider.service';
import { PaymentSale } from '../../../../models/manipulacion-venta/PaymentSale.model';
import { VentasService } from '../../../../services/ventas.service';
import { PrintServiceService } from '../../../../services/print-service.service';
import { ComprobanteDataModel } from '../../../../models/listado-ventas/ComprobanteDataModel.model';

@Component({
  selector: 'app-payments-method-selected',
  templateUrl: './payments-method-selected.component.html'
})
export class PaymentsMethodSelectedComponent implements OnInit {

  venta: Venta;
  indice: number;
  paymentType: string;
  tipos_otros: Array<string> = [
    'Prepagos',
    'Cheques',
    'Vales de Credito',
    'Vales de estacion Planta',
    'Vales de estacion Mensajeria',
    'Vales de estacion Consumo',
    'Calibracion Mezcla',
    'Calibracion Mantenimiento'
  ];
  placas_disponibles: Array<string> = [
    'A', 'G', 'I', 'L', 'K', 'X', 'OE', 'OM', 'EA', 'EI', 'EG', 'EL', 'O', 'ED', 'EM', 'DD', 'Z', 'YX',
    'D', 'C', 'P', 'B', 'M', 'F', 'T', 'H', 'S',
    'U', 'J', 'W', 'OI', 'VC', 'EX', 'OF', 'OP'
  ];
  tipo_otro_selected = '0';
  dato_otro: string;
  tarjeta: string;
  canReceiveKeyPress = false;
  placa_selected = '0';
  placa: string;
  constructor(private printer: PrintServiceService,
    private ventasService: VentasService, private router: Router, private popupProvider: PopupProviderService,
    private saleManipulationService: SaleManipulationProviderService) {

    if (this.saleManipulationService.ventaInfo === null ||
      this.saleManipulationService.ventaInfo === undefined ||
      this.saleManipulationService.ventaI === null ||
      this.saleManipulationService.ventaI === null) {
      this.saleManipulationService.resetearFlujo().then(() => {
        this.router.navigate(['/sale-manipulation/pumps-selection']);
      });
    }
    this.venta = this.saleManipulationService.ventaInfo;
    this.indice = this.saleManipulationService.ventaI;
    this.paymentType = saleManipulationService.paymentType;

    this.saleManipulationService.keyPressInfoEmitter.subscribe(data => {
      if (data !== null && data.receiver === 'payments-method-selected' && this.canReceiveKeyPress) {
        if (Number(data.key) === 1) {
          this.continue();
        } else if (data.key === '*') {
          this.GoBack();
        }
      }
    });
  }
  disableKeyPressEntry = (): void => {
    setTimeout(() => this.canReceiveKeyPress = true, 2000)
  }
  GoBack = (): void => {
    this.saleManipulationService.emitKeyPressInfo(null);
    this.router.navigate(['/sale-manipulation/payments-method-selection']);
  }
  continue = (): void => {
    if (this.paymentType === 'Tarjeta') {
      if (this.placa_selected === '0' ||
        this.placa === '' ||
        this.tarjeta === '') {
        this.popupProvider.SimpleMessage('Validación', 'Debe introducir la tarjeta y la placa', PopupType.WARNING);
        return;
      }
    } else if (this.paymentType === 'Otros') {
      if (this.tipo_otro_selected === '0' ||
        this.dato_otro === '') {
        this.popupProvider.SimpleMessage('Validación', 'Debe introducir el Dato del Metodo de pago alternativo', PopupType.WARNING);
        return;
      }
    }
    this.handleContinue(this.paymentType, this.saleManipulationService.ventaInfo,
      this.tarjeta, this.placa_selected + this.placa, this.dato_otro,
      this.tipo_otro_selected);
  }
  // handleContinue = (metodo: string, sale: Venta,
  //   tarjeta: string, placa: string,
  //   dato_otro: string, tipo_otro: string): void => {
  //   const paymentSale: PaymentSale = new PaymentSale();
  //   paymentSale.comodin = this.saleManipulationService.comodin;
  //   paymentSale.dato_otro = metodo === 'Otros' ? dato_otro : '';
  //   paymentSale.tipo_otro = metodo === 'Otros' ? tipo_otro : '';
  //   paymentSale.tarjeta = metodo === 'Tarjeta' ? tarjeta : '';
  //   paymentSale.placa = metodo === 'Tarjeta' ? placa : '';
  //   paymentSale.metodo = metodo;
  //   paymentSale.sale = sale;
  //   this.saleManipulationService.bomberoYLadoInfo.subscribe(data => {
  //     paymentSale.bomberoAutenticado = data.bomberoAutenticado;
  //     switch (this.saleManipulationService.instruccion) {
  //       case 'print':
  //         this.printSaleTicket(paymentSale);
  //         break;
  //       case 'pay':
  //         this.ventasService.pagarVentaAndroid(paymentSale).then(data => {
  //           if (data.Success) {
  //             this.printPaymentTicket(data.Response);
  //             this.popupProvider.SimpleMessage('Exito', 'Venta pagada correctamente', PopupType.SUCCESS);
  //           } else {
  //             this.popupProvider.SimpleMessage('Advertencia', data.PossibleError, PopupType.WARNING);
  //           }
  //         }).catch(error => this.popupProvider.SimpleMessage('Error', 'Ocurrio un error al pagar la venta', PopupType.ERROR));
  //         break;
  //       case 'invoice':
  //         this.saleManipulationService.paymentSale = paymentSale;
  //         this.router.navigate(['sale-manipulation/rnc-selection']);
  //         break;
  //     }
  //   });
  // }

  handleContinue = (metodo: string, sale: Venta,
    tarjeta: string, placa: string,
    dato_otro: string, tipo_otro: string): void => {
    const paymentSale: PaymentSale = new PaymentSale();
    paymentSale.comodin = this.saleManipulationService.comodin;
    paymentSale.dato_otro = metodo === 'Otros' ? dato_otro : '';
    paymentSale.tipo_otro = metodo === 'Otros' ? tipo_otro : '';
    paymentSale.tarjeta = metodo === 'Tarjeta' ? tarjeta : '';
    paymentSale.placa = metodo === 'Tarjeta' ? placa : '';
    paymentSale.metodo = metodo;
    paymentSale.sale = sale;
    paymentSale.Client = this.saleManipulationService.comodin.clienteFidelizado.nombres;
    paymentSale.Client = ' ' + paymentSale.Client + this.saleManipulationService.comodin.clienteFidelizado.apellidos;
    paymentSale.Rnc = '';
    this.saleManipulationService.bomberoYLadoInfo.subscribe(data => {  
      paymentSale.bomberoAutenticado = data.bomberoAutenticado;
      switch (this.saleManipulationService.instruccion) {
        case 'print':
          this.printSaleTicket(paymentSale);
          break;
        case 'pay':
          this.ventasService.pagarVentaWeb(paymentSale).then(data => {     
            if (data.Success) {            
              // this.printPaymentTicket(data.Response);
              this.popupProvider.SimpleMessage('Exito', 'Venta pagada correctamente', PopupType.SUCCESS);
            } else {
              this.popupProvider.SimpleMessage('Advertencia', data.PossibleError, PopupType.WARNING);
            }
          }).catch(error => {this.popupProvider.SimpleMessage('Error', 'Ocurrio un error al pagar la venta', PopupType.ERROR); console.log(error);});
          break;
        case 'invoice':
          this.saleManipulationService.paymentSale = paymentSale;
          this.router.navigate(['sale-manipulation/rnc-selection']);
          break;
      }
    });
  }
  impresionVenta = (url: string): void => {
    this.printer.openNewTab(url, 'Impresion venta');
  }
  printSaleTicket = (paymentSale: PaymentSale): void => {
    const c: ComprobanteDataModel = new ComprobanteDataModel('', '', paymentSale.tarjeta,
      paymentSale.placa, '', paymentSale.metodo,
      paymentSale.bomberoAutenticado.bombero, paymentSale.tipo_otro, paymentSale.dato_otro);
    c.venta = paymentSale.sale;
    this.impresionVenta(`WebForms/ImpresionVenta.aspx?json=${JSON.stringify(c)}`);
    this.QuitManipulation();
  }
  printPaymentTicket = (paymentId: string): void => {
    this.printer.openNewTab(`WebForms/ComprobanteVentaPagada.aspx?id_pago=${paymentId}`, 'Comprobante de Venta');
    this.QuitManipulation();
  }
  QuitManipulation = (): void => {
    this.saleManipulationService.resetearFlujo().then(() => {
      this.router.navigate(['/sale-manipulation/pumps-selection']);
    });
  }
  ngOnInit() {
  }

}
