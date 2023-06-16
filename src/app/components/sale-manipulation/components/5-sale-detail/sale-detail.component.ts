import { Component, OnInit } from '@angular/core';
import { SaleManipulationProviderService } from '../../services/sale-manipulation-provider.service';
import { Router } from '@angular/router';
import { Venta } from '../../../../models/listado-ventas/venta.model';
import { ClienteFidelizado } from 'app/models/clientes-fidelizados/ClienteFidelizado.model';
import { Comodin } from 'app/models/manipulacion-venta/Comodin.model';
import { Incentivo } from 'app/models/incentivo/incentivo.model';
import { Modalidad } from 'app/models/configuracion_puntajes_fidelidad/Modalidad.model';

@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html'
})
export class SaleDetailComponent implements OnInit {

  venta: Venta;
  indice: number;
  canReceiveKeyPress = false;

  constructor(private router: Router, private SaleManipulationProviderService: SaleManipulationProviderService) {
    if (this.SaleManipulationProviderService.ventaInfo === null ||
      this.SaleManipulationProviderService.ventaInfo === undefined ||
      this.SaleManipulationProviderService.ventaI === undefined ||
      this.SaleManipulationProviderService.ventaI === null) {
      this.SaleManipulationProviderService.resetearFlujo().then(() => {
        this.router.navigate(['/sale-manipulation/pumps-selection']);
      });
    }
    this.venta = this.SaleManipulationProviderService.ventaInfo;
    this.indice = this.SaleManipulationProviderService.ventaI;

    this.SaleManipulationProviderService.keyPressInfoEmitter.subscribe(data => {
      if (data !== null && data.receiver === 'sale-detail' && this.canReceiveKeyPress) {
        if (Number(data.key) >= 1 && Number(data.key) <= 3) {
          if (data.key === '1') {
            this.print();
          } else if (data.key === '2') {
            this.pay();
          } else if (data.key === '3') {
            this.invoice();
          }
        } else if (data.key === '*') {
          this.GoBack();
        }
      }
    });
  }
  disableKeyPressEntry = (): void => {
    setTimeout(() => this.canReceiveKeyPress = true, 2000)
  }
  print = () => this.goNextStep('print');
  invoice = () => this.goNextStep('invoice');
  pay = () => this.goNextStep('pay');

  goNextStep = (instruccion: string): void => {
    this.SaleManipulationProviderService.instruccion = instruccion;
    this.router.navigate(['/sale-manipulation/payments-method-selection']);
  }

  GoBack() {
    this.SaleManipulationProviderService.emitKeyPressInfo(null);
    this.SaleManipulationProviderService.comodin = new Comodin(false, '', new ClienteFidelizado(0, '', '', '', '', '', 0, false, '', 0, 0, '','','',''), 0, new Incentivo(0, '', '', 0, false, ''), new Modalidad(false, false));
    this.router.navigate(['/sale-manipulation/comodines-selection']);
  }
  ngOnInit() {
  }

}
