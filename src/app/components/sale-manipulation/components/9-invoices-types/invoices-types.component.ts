import { Component, OnInit } from '@angular/core';
import { ComprobantesService } from '../../../../services/comprobantes.service';
import { Router } from '@angular/router';
import { SaleManipulationProviderService } from '../../services/sale-manipulation-provider.service';
import { Venta } from '../../../../models/listado-ventas/venta.model';
import { InvoiceType } from '../../../../models/consulta-comprobantes/InvoiceType.model';
import { PopupProviderService, PopupType } from '../../../../services/popupProvider.service';
import { InvoiceDataStructure } from '../../../../models/manipulacion-venta/InvoiceDataStructure.model';
import { ClientInfo } from '../../../../models/manipulacion-venta/ClientInfo.model';
import { VentasService } from '../../../../services/ventas.service';
import { PrintServiceService } from '../../../../services/print-service.service';

@Component({
  selector: 'app-invoices-types',
  templateUrl: './invoices-types.component.html'
})
export class InvoicesTypesComponent implements OnInit {
  venta: Venta;
  indice: number;
  canReceiveKeyPress = false;
  invoices_types: Array<InvoiceType> = [];
  constructor(private printer: PrintServiceService,
    private router: Router, private popup: PopupProviderService,
    private salesManipulationProvider: SaleManipulationProviderService,
    private comprobantesService: ComprobantesService,
    private ventasService: VentasService) {
    this.salesManipulationProvider.bomberoYLadoInfoEmitter.subscribe(data => {
      if (data === null) {
        this.GoBack();
      }
      this.venta = this.salesManipulationProvider.ventaInfo;
      this.indice = this.salesManipulationProvider.ventaI;
    });
    this.loadInvoicesTypes();
    this.salesManipulationProvider.keyPressInfoEmitter.subscribe(data => {
      if (data !== null && data.receiver === 'invoices-types' && this.canReceiveKeyPress) {
        if (Number(data.key) >= 1 && Number(data.key) <= 9) {
          this.selectInvoiceType(this.invoices_types[Number(data.key)]);
        } else if (data.key === '*') {
          this.GoBack();
        }
      }
    });
  }
  printInvoiceTicket = (ncf: string): void => {
    this.printer.openNewTab(`WebForms/ComprobanteVenta.aspx?ncf=${ncf}`, 'Comprobante de Venta');
  }
  selectInvoiceType = (invoiceType: InvoiceType): void => {
    const invoiceDataStructure: InvoiceDataStructure = new InvoiceDataStructure();
    invoiceDataStructure.invoiceType = invoiceType;
    invoiceDataStructure.paymentSale = this.salesManipulationProvider.paymentSale;
    invoiceDataStructure.clientInfo = new ClientInfo(this.salesManipulationProvider.rnc.rnc, this.salesManipulationProvider.rnc.cliente);
    this.ventasService.GenerateInvoice(invoiceDataStructure)
      .then(data => {
        if (data.Success) {
          this.popup.SimpleMessage('Exito', 'Comprobante generado', PopupType.SUCCESS);
          this.printInvoiceTicket(data.Response);
          this.salesManipulationProvider.resetearFlujo().then(() => {
            this.router.navigate(['/sale-manipulation/pumps-selection']);
          });
        } else {
          this.popup.SimpleMessage('Advertencia', data.PossibleError, PopupType.WARNING);
        }
      })
      .catch(error => {
        this.popup.SimpleMessage('Ocurrio un error generando el comprobante', error, PopupType.ERROR);
      });
  }
  ngOnInit() {
  }
  loadInvoicesTypes = (): void => {
    this.comprobantesService.LoadInvoicesTypes()
      .then(data => {
        if (data.PossibleError === '') {
          this.invoices_types = data.List;
        } else {
          this.popup.SimpleMessage('Advertencia', 'Error al obtener los tipos de comprobantes', PopupType.WARNING);
        }
      })
      .catch(error => {
        this.popup.SimpleMessage('Advertencia', error, PopupType.WARNING);
        setTimeout(() => this.GoBack(), 2000);
      });
  }
  disableKeyPressEntry = (): void => {
    setTimeout(() => this.canReceiveKeyPress = true, 2000)
  }
  GoBack = (): void => {
    this.salesManipulationProvider.emitKeyPressInfo(null);
    this.salesManipulationProvider.rnc = {
      cliente: '',
      rnc: ''
    };
    this.router.navigate(['/sale-manipulation/rnc-selection']);
  }
}
