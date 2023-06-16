
import { Component, OnInit, HostListener } from '@angular/core';
import { SaleManipulationProviderService } from './services/sale-manipulation-provider.service';
import { BomberoByLado } from '../../models/manipulacion-venta/BomberoByLado.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sale-manipulation',
  templateUrl: './sale-manipulation.component.html'
})
export class SaleManipulationComponent implements OnInit {

  bomberoYLadoData: BomberoByLado;
  constructor(private router: Router,
    private SaleManipulationProviderServiceL: SaleManipulationProviderService) {
    this.SaleManipulationProviderServiceL.bomberoYLadoInfoEmitter.subscribe(data => {
      this.bomberoYLadoData = data;
    });
    this.SaleManipulationProviderServiceL.emitKeyPressInfo(null);
  }

  onActivate(componentRef) {
    componentRef.disableKeyPressEntry();
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent = (event: KeyboardEvent) => {
    const keyPress: string = event.key;
    if (this.router.url === '/sale-manipulation/pumps-selection') {
      this.SaleManipulationProviderServiceL.emitKeyPressInfo({ key: keyPress, receiver: 'pumps-selection' });
    } else if (this.router.url.includes('sales-selection')) {
      this.SaleManipulationProviderServiceL.emitKeyPressInfo({ key: keyPress, receiver: 'sales-selection' });
    } else if (this.router.url === '/sale-manipulation/comodines-selection') {
      this.SaleManipulationProviderServiceL.emitKeyPressInfo({ key: keyPress, receiver: 'comodines-selection' });
    } else if (this.router.url === '/sale-manipulation/fidelizacion-info') {
      this.SaleManipulationProviderServiceL.emitKeyPressInfo({ key: keyPress, receiver: 'fidelizacion-info' });
    } else if (this.router.url === '/sale-manipulation/sale-detail') {
      this.SaleManipulationProviderServiceL.emitKeyPressInfo({ key: keyPress, receiver: 'sale-detail' });
    } else if (this.router.url === '/sale-manipulation/payments-method-selection') {
      this.SaleManipulationProviderServiceL.emitKeyPressInfo({ key: keyPress, receiver: 'payments-method-selection' });
    } else if (this.router.url === '/sale-manipulation/payments-method-selected') {
      this.SaleManipulationProviderServiceL.emitKeyPressInfo({ key: keyPress, receiver: 'payments-method-selected' });
    } else if (this.router.url === '/sale-manipulation/rnc-selection') {
      this.SaleManipulationProviderServiceL.emitKeyPressInfo({ key: keyPress, receiver: 'rnc-selection' });
    } else if (this.router.url === '/sale-manipulation/invoices-types') {
      this.SaleManipulationProviderServiceL.emitKeyPressInfo({ key: keyPress, receiver: 'invoices-types' });
    }
  }
  ngOnInit() {
  }

}
