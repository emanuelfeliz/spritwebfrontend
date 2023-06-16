import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopupProviderService, PopupType } from '../../../../services/popupProvider.service';
import { SaleManipulationProviderService } from '../../services/sale-manipulation-provider.service';
import { Venta } from '../../../../models/listado-ventas/venta.model';
import { ClientesFidelizadosService } from '../../../../services/clientes-fidelizados.service';
import { ClienteFidelizado } from 'app/models/clientes-fidelizados/ClienteFidelizado.model';
import { ConfiguracionPuntajesFidelidadService } from 'app/services/configuracion_puntajes_fidelidad.service';
import { Modalidad } from 'app/models/configuracion_puntajes_fidelidad/Modalidad.model';
declare var $;
@Component({
  selector: 'app-fidelizacion-info',
  templateUrl: './fidelizacion-info.component.html'
})
export class FidelizacionInfoComponent implements OnInit {

  venta: Venta;
  indice: number;
  clienteFidelizado: ClienteFidelizado = new ClienteFidelizado(0, '', '', '', '', '', 0, false, '', 0, 0, '','','','');
  clientInfoReady = false;
  keyboard = true;
  loadingData = false;
  canReceiveKeyPress = false;
  modalidad: string = '';
  validationCode:string = '';
  isCustomerValidated: boolean = false;

  constructor(private router: Router, private popup: PopupProviderService,
    private SaleManipulationProviderService: SaleManipulationProviderService,
    private clientesFidelizadosService: ClientesFidelizadosService,
    private configuracionPuntajesFidelidadService: ConfiguracionPuntajesFidelidadService) {
    this.SaleManipulationProviderService.bomberoYLadoInfoEmitter.subscribe(data => {
      if (data === null) {
        this.GoBack();
      }
      this.venta = this.SaleManipulationProviderService.ventaInfo;
      this.indice = this.SaleManipulationProviderService.ventaI;
    });
    this.SaleManipulationProviderService.keyPressInfoEmitter.subscribe(data => {
      if (data !== null && data.receiver === 'fidelizacion-info' && this.canReceiveKeyPress) {
        if (Number(data.key) === 1) {
          if (this.clientInfoReady) {
            this.continuar();
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
  toggleKeyboardInput = (activate: boolean): void => {
    this.canReceiveKeyPress = activate;
  }
  continuar = (): void => {
    this.SaleManipulationProviderService.comodin.clienteFidelizado = this.clienteFidelizado;
    this.router.navigate(['/sale-manipulation/sale-detail']);
  }

  validateSecretCodeAndCustomerCode = (): void => {
    if(this.clienteFidelizado.nombres == '') {
      this.popup.SimpleMessage('Advertencia', 'Primero de buscar el codigo del cliente', PopupType.WARNING);
      return;
    }
    if(this.validationCode != this.clienteFidelizado.cedula && this.validationCode != this.clienteFidelizado.barcode && this.validationCode != this.clienteFidelizado.countrycode){
          this.popup.SimpleMessage('Error', 'El codigo del cliente y el codigo de validacion no pertenecen al mismo cliente', PopupType.ERROR);
          this.clientInfoReady = false;     
    }
    else{
      this.SaleManipulationProviderService.comodin.clienteFidelizado = this.clienteFidelizado;  
      this.popup.SimpleMessage('Success', 'Cliente validado', PopupType.SUCCESS);
      this.isCustomerValidated = true;
      this.clienteFidelizado =  this.SaleManipulationProviderService.comodin.clienteFidelizado;
    }    
  }
  cleanData(){
    this.clienteFidelizado = new ClienteFidelizado(0, '', '', '', '', '', 0, false, '', 0, 0, '','','','');
    this.SaleManipulationProviderService.comodin.clienteFidelizado = new ClienteFidelizado(0, '', '', '', '', '', 0, false, '', 0, 0, '','','','');
    this.clientInfoReady = false;
    this.isCustomerValidated = false;
    this.validationCode = '';
  }
  getClientData = (): void => {
    if (this.keyboard === false) {
      return;
    }
    if (this.modalidad === ''){
      this.popup.SimpleMessage('Advertencia', 'Seleccione una modalidad', PopupType.WARNING);
      return;
    }
    this.loadingData = true;
    this.keyboard = false;
    this.clientesFidelizadosService.getDataClient(this.clienteFidelizado.codigo).then(data => {
      this.loadingData = false;
      if (data.Success) {
        this.clienteFidelizado = data.Response;
        this.keyboard = true;
        this.canReceiveKeyPress = true;
        if(this.SaleManipulationProviderService.comodin.tipo === 'fidelizaciones'){
          if(this.modalidad === 'galones'){
            this.SaleManipulationProviderService.comodin.modalidad = new Modalidad(true, false);
          } else if(this.modalidad === 'precio'){
            this.SaleManipulationProviderService.comodin.modalidad = new Modalidad(false, true);
          }
          this.configuracionPuntajesFidelidadService.getConfiguracionPuntajesFidelidadActiva(true, false, this.SaleManipulationProviderService.comodin.modalidad, this.clienteFidelizado.galonesConsumidos, this.clienteFidelizado.pesosConsumidos, this.clienteFidelizado.tipo_cliente, this.clienteFidelizado.id_tipo_cliente).then(data => {
            if(data.Success){
              this.clientInfoReady = true;
              if(data.Response === null){
                this.popup.SimpleMessage('Información', 'El cliente no aplica para ninguna de las configuraciones, proceda con el proceso de fidelización para acumular consumos', PopupType.INFO);
              }
            } else{
              this.popup.SimpleMessage('Advertencia', data.PossibleError, PopupType.WARNING);
            }
          });
        } else if (this.SaleManipulationProviderService.comodin.tipo === 'canje'){
          if(this.clienteFidelizado.puntosFidelizacion > 0){
            this.clientInfoReady = true;
          } else {
            this.popup.SimpleMessage('Advertencia', 'El cliente no tiene puntos de fidelización', PopupType.WARNING);
          }
        }
      } else {
        this.clientInfoReady = false;
        this.clienteFidelizado = new ClienteFidelizado(0, '', '', '', '', '', 0, false, '', 0, 0, '','','','');
        this.popup.SimpleMessage('Advertencia', 'Cliente no válido', PopupType.WARNING, () => {
          setTimeout(() => this.keyboard = true, 2000);
        });
      }
    }).catch(error => {
      this.popup.SimpleMessage('No se obtuvo info sobre el cliente', error, PopupType.ERROR);
      this.loadingData = false;
    });
  }
  ngOnInit() {
  }
  GoBack = (): void => {
    this.SaleManipulationProviderService.emitKeyPressInfo(null);
    this.SaleManipulationProviderService.comodin.activado = false;
    this.SaleManipulationProviderService.comodin.tipo = null;
    this.router.navigate(['/sale-manipulation/comodines-selection']);
  }
}
