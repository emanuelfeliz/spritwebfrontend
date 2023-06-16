import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopupProviderService, PopupType } from '../../../../services/popupProvider.service';
import { SaleManipulationProviderService } from '../../services/sale-manipulation-provider.service';
import { BomberoByLado } from '../../../../models/manipulacion-venta/BomberoByLado.model';
import { Venta } from '../../../../models/listado-ventas/venta.model';

@Component({
  selector: 'app-comodines-selection',
  templateUrl: './comodines-selection.component.html'
})
export class ComodinesSelectionComponent implements OnInit {

  bomberoYLadoData: BomberoByLado;
  venta: Venta;
  indice: number;
  canReceiveKeyPress = false;
  constructor(private router: Router, private popup: PopupProviderService,
    private SaleManipulationProviderService: SaleManipulationProviderService) {
    this.SaleManipulationProviderService.bomberoYLadoInfoEmitter.subscribe(data => {
      if (data === null) {
        this.GoBack();
      }
      this.bomberoYLadoData = data;
      this.venta = this.SaleManipulationProviderService.ventaInfo;
      this.indice = this.SaleManipulationProviderService.ventaI;
    });
    this.SaleManipulationProviderService.keyPressInfoEmitter.subscribe(data => {
      if (data !== null && data.receiver === 'comodines-selection' && this.canReceiveKeyPress) {
        if (Number(data.key) >= 1 && Number(data.key) <= 4) {
          if (data.key === '1') {
            this.fidelizaciones('fidelizaciones');
          } else if (data.key === '2') {
            this.fidelizaciones('canje');
          } else if (data.key === '3') {
            this.incentivo();
          } else if (data.key === '4') {
            this.prepago();
          } else if (data.key === '5') {
            this.normal();
          }
        } else if (data.key === '*') {
          this.GoBack();
        }
      }
    });
    ;
  }
  disableKeyPressEntry = (): void => {
    setTimeout(() => this.canReceiveKeyPress = true, 2000);
  }
  fidelizaciones = (tipo: string): void => {
    this.SaleManipulationProviderService.comodin.activado = true;
    this.SaleManipulationProviderService.comodin.tipo = tipo;
    this.router.navigate(['/sale-manipulation/fidelizacion-info']);
  }
  incentivo = (): void => {
    this.SaleManipulationProviderService.comodin.activado = true;
    this.SaleManipulationProviderService.comodin.tipo = 'incentivo';
    this.router.navigate(['/sale-manipulation/incentivo-info']);
  }
  prepago = (): void => this.popup.SimpleMessage('Advertencia', 'Opcion no disponible', PopupType.WARNING);
  normal = (): void => {
    this.SaleManipulationProviderService.ventaInfo = this.venta;
    this.SaleManipulationProviderService.ventaI = this.indice;
    this.router.navigate(['/sale-manipulation/sale-detail']);
  }
  GoBack = (): void => {
    this.SaleManipulationProviderService.emitKeyPressInfo(null);
    this.router.navigate(['/sale-manipulation/sales-selection', this.SaleManipulationProviderService.ladoSeleccionado]);
  }
  ngOnInit() {
  }

}
