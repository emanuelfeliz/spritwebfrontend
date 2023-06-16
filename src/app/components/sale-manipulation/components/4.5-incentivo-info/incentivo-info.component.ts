import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopupProviderService, PopupType } from '../../../../services/popupProvider.service';
import { SaleManipulationProviderService } from '../../services/sale-manipulation-provider.service';
import { Venta } from '../../../../models/listado-ventas/venta.model';
import { IncentivosService } from '../../../../services/incentivos.service';
import { Incentivo } from 'app/models/incentivo/incentivo.model';
import { ClienteFidelizado } from 'app/models/clientes-fidelizados/ClienteFidelizado.model';
import { Empleado } from 'app/models/empleado/empleado.model';
import { Flotilla } from 'app/models/flotilla/flotilla.model';
import { ClientesFidelizadosService } from 'app/services/clientes-fidelizados.service';
import { EmpleadosService } from 'app/services/empleados.service';
import { FlotillasService } from 'app/services/flotillas.service';
import { Modalidad } from 'app/models/configuracion_puntajes_fidelidad/Modalidad.model';
import { ConfiguracionPuntajesFidelidadService } from 'app/services/configuracion_puntajes_fidelidad.service';
import { TiposCliente } from 'app/models/clientes-fidelizados/TiposCliente.enum';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { TiposIncentivo } from 'app/models/incentivo/TiposIncentivo.enum';
declare var $;
@Component({
  selector: 'app-incentivo-info',
  templateUrl: './incentivo-info.component.html'
})
export class IncentivoInfoComponent implements OnInit {

  venta: Venta;
  indice: number;
  incentivo: Incentivo = new Incentivo(0, '', '', null, false, '');
  incentivoInfoReady = false;
  keyboard = true;
  loadingData = false;
  canReceiveKeyPress = false;
  cliente: ClienteFidelizado = new ClienteFidelizado(0, '', '', '', '', '', 0, false, '', 0, 0, '','','','');
  empleado: Empleado = new Empleado(0, '', '', '', '','','','');
  flotilla: Flotilla = new Flotilla(0, '', '');
  modalidad: string = '';
  TiposClienteEnum = TiposCliente;
  TiposIncentivoEnum = TiposIncentivo;
  constructor(private router: Router, private popup: PopupProviderService,
    private SaleManipulationProviderService: SaleManipulationProviderService,
    public incentivosService: IncentivosService,
    public clientesService: ClientesFidelizadosService,
    public empleadosService: EmpleadosService,
    public flotillasService: FlotillasService,
    private configuracionPuntajesFidelidadService: ConfiguracionPuntajesFidelidadService
  ) {
    this.SaleManipulationProviderService.bomberoYLadoInfoEmitter.subscribe(data => {
      if (data === null) {
        this.GoBack();
      }
      this.venta = this.SaleManipulationProviderService.ventaInfo;
      this.indice = this.SaleManipulationProviderService.ventaI;
    });
    this.SaleManipulationProviderService.keyPressInfoEmitter.subscribe(data => {
      if (data !== null && data.receiver === 'incentivo-info' && this.canReceiveKeyPress) {
        if (Number(data.key) === 1) {
          if (this.incentivoInfoReady) {
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
    this.SaleManipulationProviderService.comodin.incentivo = this.incentivo;
    this.router.navigate(['/sale-manipulation/sale-detail']);
  }
  cargar = (
    getConfiguracionActiva: boolean, 
    cargarMethod: (codigo: string) => Promise<GenericResponse<any>>, 
    entity: Incentivo | ClienteFidelizado | Empleado | Flotilla
  ): void => {
    if (this.keyboard === false) {
      return;
    }
    if(getConfiguracionActiva){
      if (this.modalidad === ''){
        this.popup.SimpleMessage('Advertencia', 'Seleccione una modalidad', PopupType.WARNING);
        return;
      }
    }
    this.loadingData = true;
    this.keyboard = false;
    cargarMethod(entity.codigo).then(data => {
      this.loadingData = false;
      if (data.Success) {
        if(entity instanceof Incentivo){
          this.incentivo = data.Response;
        } else if (entity instanceof ClienteFidelizado){
          this.cliente = data.Response;
        } else if (entity instanceof Empleado){
          this.empleado = data.Response;
        } else if (entity instanceof Flotilla){
          this.flotilla = data.Response;
        }
        this.keyboard = true;
        this.canReceiveKeyPress = true;
        
        if(getConfiguracionActiva){
          if(this.modalidad === 'galones'){
            this.SaleManipulationProviderService.comodin.modalidad = new Modalidad(true, false);
          } else if(this.modalidad === 'precio'){
            this.SaleManipulationProviderService.comodin.modalidad = new Modalidad(false, true);
          }
          this.configuracionPuntajesFidelidadService.getConfiguracionPuntajesFidelidadActiva(false, true, this.SaleManipulationProviderService.comodin.modalidad, 0, 0, this.TiposClienteEnum.incentivo,0).then(data => {
            if(!data.Success){
              this.popup.SimpleMessage('Advertencia', data.PossibleError, PopupType.WARNING);
              return;
            }
            this.incentivoInfoReady = true;
          });
        } else {
          this.incentivoInfoReady = false;
        }

        if(entity instanceof Incentivo && entity['canjeado']){
          this.popup.SimpleMessage('Advertencia', 'Este incentivo ya fue canjeado', PopupType.WARNING);
        }
      } else {
        this.incentivoInfoReady = false;
        if(entity instanceof Incentivo){
          this.incentivo = null;
        } else if (entity instanceof ClienteFidelizado){
          this.cliente = null;
        } else if (entity instanceof Empleado){
          this.empleado = null;
        } else if (entity instanceof Flotilla){
          this.empleado = null;
        }
        this.popup.SimpleMessage('Advertencia', 'Código no válido', PopupType.WARNING);
      }
    }).catch(error => {
      this.popup.SimpleMessage('Error', error, PopupType.ERROR);
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
