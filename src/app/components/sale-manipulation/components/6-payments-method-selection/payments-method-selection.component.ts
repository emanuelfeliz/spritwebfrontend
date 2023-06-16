import { Component, OnInit } from '@angular/core';
import { SaleManipulationProviderService } from '../../services/sale-manipulation-provider.service';
import { Venta } from '../../../../models/listado-ventas/venta.model';
import { Router } from '@angular/router';
import { PopupProviderService, PopupType } from '../../../../services/popupProvider.service';
import { ConfiguracionPuntajesFidelidadService } from 'app/services/configuracion_puntajes_fidelidad.service';
import { ConfiguracionPuntajesFidelidad } from 'app/models/configuracion_puntajes_fidelidad/ConfiguracionPuntajesFidelidad.model';
import { TiposCliente } from 'app/models/clientes-fidelizados/TiposCliente.enum';

@Component({
  selector: 'app-payments-method-selection',
  templateUrl: './payments-method-selection.component.html'
})
export class PaymentsMethodSelectionComponent implements OnInit {

  venta: Venta;
  indice: number;
  canReceiveKeyPress = false;
  configuracionPuntajesFidelidadCanje: ConfiguracionPuntajesFidelidad = new ConfiguracionPuntajesFidelidad(0, 0, 0, 0, null, null);
  puntosFidelizacion: number = 0;
  configuracionParametroModalidad: number = 0;
  configuracionPuntos: number = 0;
  galonesVenta: number = 0;
  costoVenta: number = 0;
  puntosACanjear: number = 0;
  descuento: number = 0;
  montoDescuento: number = 0;
  canje: boolean = false;
  incentivo: boolean = false;
  ventaPagadaTotalmenteConFidelizacion: boolean = false;
  costoFinalVenta: number = 0;
  configuracionActiva: boolean = false;
  TiposClienteEnum = TiposCliente;

  constructor(private router: Router,
    private popupProvider: PopupProviderService,
    private saleManipulationProviderService: SaleManipulationProviderService, 
    private configuracionPuntajesFidelidadService: ConfiguracionPuntajesFidelidadService) {
    if (this.saleManipulationProviderService.ventaInfo === null ||
      this.saleManipulationProviderService.ventaInfo === undefined ||
      this.saleManipulationProviderService.ventaI === null ||
      this.saleManipulationProviderService.ventaI === null) {
      this.saleManipulationProviderService.resetearFlujo().then(() => {
        this.router.navigate(['/sale-manipulation/pumps-selection']);
      });
    }
    this.venta = this.saleManipulationProviderService.ventaInfo;
    this.indice = this.saleManipulationProviderService.ventaI;

    this.canje = this.saleManipulationProviderService.comodin.tipo === 'canje';
    this.incentivo = this.saleManipulationProviderService.comodin.tipo === 'incentivo';
    if(this.canje || this.incentivo){
      let tipoCliente: string;
      let id_tipo_cliente:number =0;
      if(this.canje){
        this.puntosFidelizacion = this.saleManipulationProviderService.comodin.clienteFidelizado.puntosFidelizacion;
        tipoCliente = this.saleManipulationProviderService.comodin.clienteFidelizado.tipo_cliente;
        id_tipo_cliente = this.saleManipulationProviderService.comodin.clienteFidelizado.id_tipo_cliente;
      } else if (this.incentivo){
        this.puntosFidelizacion = this.saleManipulationProviderService.comodin.incentivo.puntos;
        tipoCliente = this.TiposClienteEnum.incentivo;
      }
      this.galonesVenta = this.saleManipulationProviderService.ventaInfo.Volume;
      this.costoVenta = this.saleManipulationProviderService.ventaInfo.Money;

      this.configuracionPuntajesFidelidadService.getConfiguracionPuntajesFidelidadActiva(
        false,
        true,
        this.saleManipulationProviderService.comodin.modalidad,
        this.saleManipulationProviderService.comodin.clienteFidelizado.galonesConsumidos, 
        this.saleManipulationProviderService.comodin.clienteFidelizado.pesosConsumidos,
        tipoCliente,id_tipo_cliente
      ).then(data => {
        if(data.Success){
          this.configuracionActiva = true;
          this.configuracionPuntajesFidelidadCanje = data.Response;
          this.configuracionParametroModalidad = this.configuracionPuntajesFidelidadCanje.parametroModalidad;
          this.configuracionPuntos = this.configuracionPuntajesFidelidadCanje.puntos;
          this.getDescuento();
          this.calculateMontoDescuento();
          this.ventaPagadaTotalmenteConFidelizacion = this.montoDescuento >= this.costoVenta;
          this.saleManipulationProviderService.comodin.puntosACanjear = this.puntosACanjear;
          this.saleManipulationProviderService.ventaInfo.DescuentoComodin = this.montoDescuento;
          this.costoFinalVenta = this.costoVenta - this.montoDescuento;
        } else {
          this.popupProvider.SimpleMessage('Advertencia', data.PossibleError, PopupType.WARNING);
        }
      }).catch(error => {
        this.popupProvider.SimpleMessage('Error', 'Error al obtener configuración de puntajes de fidelidad', PopupType.ERROR);
      });
    }

    this.saleManipulationProviderService.keyPressInfoEmitter.subscribe(data => {
      if (data !== null && data.receiver === 'payments-method-selection' && this.canReceiveKeyPress) {
        if (Number(data.key) >= 1 && Number(data.key) <= 3) {
          if(!this.ventaPagadaTotalmenteConFidelizacion){
            if (data.key === '1') {
              this.efectivo();
            } else if (data.key === '2') {
              this.tarjeta();
            } else if (data.key === '3') {
              this.otros();
            }
          } else {
            if(data.key === '1'){
              this.continuar();
            }
          }
        } else if (data.key === '*') {
          this.GoBack();
        }
      }
    });
  }
  getUnidad = (): string => {
    if(this.configuracionPuntajesFidelidadCanje.modalidad.porGalones && !this.configuracionPuntajesFidelidadCanje.modalidad.porPrecio){
      return 'galones';
    } else if(!this.configuracionPuntajesFidelidadCanje.modalidad.porGalones && this.configuracionPuntajesFidelidadCanje.modalidad.porPrecio){
      return 'pesos';
    }
  }
  getDescuento = (): void => {
    let descuento = this.puntosFidelizacion * this.configuracionParametroModalidad / this.configuracionPuntos;
    this.puntosACanjear = this.puntosFidelizacion;
    if(this.getUnidad() === 'galones' && descuento > this.galonesVenta){
      let puntosACanjear = this.puntosFidelizacion * this.galonesVenta / descuento;
      this.puntosACanjear = Number(puntosACanjear.toFixed(3));
      descuento = this.galonesVenta;
    } else if(this.getUnidad() === 'pesos' && descuento > this.costoVenta){
      let puntosACanjear = this.puntosFidelizacion * this.costoVenta / descuento;
      this.puntosACanjear = Number(puntosACanjear.toFixed(3));
      descuento = this.costoVenta;
    }
    this.descuento = Number(descuento.toFixed(3));
  }
  getMontoDescuento = (): string => {
    if(this.getUnidad() === 'pesos'){
      return '.';
    } else if(this.getUnidad() === 'galones'){
      return `, lo cual equivale a ${this.montoDescuento} pesos.`;
    }
  }
  calculateMontoDescuento = (): void => {
    if(this.getUnidad() === 'pesos'){
      this.montoDescuento = this.descuento;
    } else if(this.getUnidad() === 'galones'){
      let dineroEquivalente: number = this.descuento * this.costoVenta / this.galonesVenta;
      this.montoDescuento = Number(dineroEquivalente.toFixed(3));
    }
  }
  disableKeyPressEntry = (): void => {
    setTimeout(() => this.canReceiveKeyPress = true, 2000)
  }
  efectivo = (): void => {
    if (this.saleManipulationProviderService.instruccion === 'pay') {
      this.popupProvider.SimpleMessage('Advertencia', 'No puede pagar una venta en efectivo', PopupType.WARNING);
      return;
    }
    this.paymentSelected('Efectivo');
  }
  tarjeta = (): void => this.paymentSelected('Tarjeta');
  otros = (): void => this.paymentSelected('Otros');
  continuar = (): void => {
    if(this.canje){
      this.paymentSelected('Canje de puntos de fidelización');
    } else if(this.incentivo){
      this.paymentSelected('Canje de incentivo');
    }
  };
  paymentSelected = (paymentType: string): void => {
    this.saleManipulationProviderService.paymentType = paymentType;
    this.router.navigate(['/sale-manipulation/payments-method-selected']);
  }
  GoBack() {
    this.saleManipulationProviderService.emitKeyPressInfo(null);
    this.saleManipulationProviderService.instruccion = null;
    this.saleManipulationProviderService.paymentType = '';
    this.router.navigate(['/sale-manipulation/sale-detail']);
  }
  ngOnInit() {
  }

}
