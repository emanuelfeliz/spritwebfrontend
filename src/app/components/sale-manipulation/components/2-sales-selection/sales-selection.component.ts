import { Component, OnInit } from '@angular/core';
import { SaleManipulationProviderService } from '../../services/sale-manipulation-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Venta } from '../../../../models/listado-ventas/venta.model';
import { VentasService } from '../../../../services/ventas.service';
import { BomberoByLado } from '../../../../models/manipulacion-venta/BomberoByLado.model';
import { PopupProviderService, PopupType } from '../../../../services/popupProvider.service';

@Component({
  selector: 'app-sales-selection',
  templateUrl: './sales-selection.component.html'
})
export class SalesSelectionComponent implements OnInit {

  canReceiveKeyPress = false;
  ventas: Array<Venta> = [];
  ultimas = 5;
  bomberoYLadoData: BomberoByLado;
  constructor(private router: Router, private popup: PopupProviderService,
    private SaleManipulationProviderService: SaleManipulationProviderService,
    private actr: ActivatedRoute, private ventasService: VentasService) {
    this.SaleManipulationProviderService.ventaI = null;
    this.SaleManipulationProviderService.ventaInfo = null;
    this.SaleManipulationProviderService.bomberoYLadoInfoEmitter.subscribe(data => {
      if (data === null) {
        this.GoBack();
      }
      this.bomberoYLadoData = data;
    });
    this.actr.data.map(data => data.dataVentas).subscribe((res) => {
      this.ventas = res;
    });
    this.SaleManipulationProviderService.keyPressInfoEmitter.subscribe(data => {
      if (data !== null && data.receiver === 'sales-selection' && this.canReceiveKeyPress) {
        if (Number(data.key) >= 0 && Number(data.key) <= 9) {
          setTimeout(() => {
            this.SelectSale({ i: parseInt(data.key, 10), venta: this.ventas[parseInt(data.key, 10)] });
          }, 0);
        } else if (data.key === '*') {
          this.GoBack();
        }
      }
    });
  }
  disableKeyPressEntry = (): void => {
    setTimeout(() => this.canReceiveKeyPress = true, 2000)
  }
  LastSalesChanged = (): void => {
    this.ventasService.LoadSalesByPump(this.bomberoYLadoData.lado, this.ultimas)
      .then(data => {
        if (data.PossibleError === '') {
          this.ventas = data.List;
        } else {
          this.popup.SimpleMessage('Error al cargar ventas', data.PossibleError, PopupType.WARNING);
        }
      })
      .catch(error => {
        this.popup.SimpleMessage('Error al cargar ventas', error, PopupType.ERROR);
      });
  }
  GoBack = (): void => {
    this.SaleManipulationProviderService.emitKeyPressInfo(null);
    this.SaleManipulationProviderService.resetearFlujo().then(() => {
      this.router.navigate(['/sale-manipulation/pumps-selection']);
    });
  }
  SelectSale = (data: { venta: Venta, i: number }): void => {
    this.SaleManipulationProviderService.ventaInfo = data.venta;
    this.SaleManipulationProviderService.ventaI = data.i;
    this.router.navigate(['/sale-manipulation/comodines-selection']);
  }
  ngOnInit() {
  }

}
