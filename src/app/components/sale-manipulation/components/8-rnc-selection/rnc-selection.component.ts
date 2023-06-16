import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Venta } from '../../../../models/listado-ventas/venta.model';
import { SaleManipulationProviderService } from '../../services/sale-manipulation-provider.service';
import { VentasService } from '../../../../services/ventas.service';
import { PopupType, PopupProviderService } from '../../../../services/popupProvider.service';

@Component({
  selector: 'app-rnc-selection',
  templateUrl: './rnc-selection.component.html'
})
export class RncSelectionComponent implements OnInit {

  loadingData = false;
  venta: Venta;
  indice: number;
  rncCliente: string;
  name: string;
  clientInfoReady = false;
  keyboard = true;
  canReceiveKeyPress = false;
  constructor(private popup: PopupProviderService,
    private ventasService: VentasService,
    private router: Router, private SaleManipulationProviderService: SaleManipulationProviderService) {
    this.SaleManipulationProviderService.bomberoYLadoInfoEmitter.subscribe(data => {
      if (data === null) {
        this.GoBack();
      }
      this.venta = this.SaleManipulationProviderService.ventaInfo;
      this.indice = this.SaleManipulationProviderService.ventaI;
    });
    this.SaleManipulationProviderService.keyPressInfoEmitter.subscribe(data => {
      if (data !== null && data.receiver === 'rnc-selection' && this.canReceiveKeyPress) {
        if (Number(data.key) === 1 && this.clientInfoReady) {
          this.continuar();
        } else if (data.key === '*') {
          this.GoBack();
        }
      }
    });

    console.log(this.venta);
  }
  ngOnInit() {
  }
  continuar = (): void => {
    this.SaleManipulationProviderService.rnc = {
      cliente: this.name,
      rnc: this.rncCliente
    };
    this.router.navigate(['sale-manipulation/invoices-types']);
  }
  getClientData = (): void => {
    if (this.keyboard === false) {
      return;
    }
    this.loadingData = true;
    this.keyboard = false;
    this.ventasService.getClientByRnc(this.rncCliente).then(data => {
      this.loadingData = false;
      if (data.Success) {
        this.clientInfoReady = true;
        this.name = data.Response;
        this.keyboard = true;
      } else {
        this.clientInfoReady = false;
        this.name = '';
        this.popup.SimpleMessage('Advertencia', 'Rnc no válido', PopupType.WARNING, () => {
          setTimeout(() => this.keyboard = true, 2000);
        });
      }
    }).catch(error => {
      this.popup.SimpleMessage('No se obtuvo info sobre el cliente', error, PopupType.ERROR);
      this.loadingData = false;
    });
  }
  disableKeyPressEntry = (): void => {
    setTimeout(() => this.canReceiveKeyPress = true, 2000)
  }
  GoBack = (): void => {
    this.SaleManipulationProviderService.emitKeyPressInfo(null);
    this.router.navigate(['/sale-manipulation/payments-method-selected']);
  }
}
