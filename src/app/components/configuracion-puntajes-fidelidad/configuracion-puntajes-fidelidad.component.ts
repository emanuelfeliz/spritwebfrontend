import { Component } from '@angular/core';
import { ConfiguracionPuntajesFidelidadService } from '../../services/configuracion_puntajes_fidelidad.service';
import { ConfiguracionPuntajesFidelidad } from '../../models/configuracion_puntajes_fidelidad/ConfiguracionPuntajesFidelidad.model';
import { PopupProviderService, PopupType } from '../../services/popupProvider.service';
import { ModelList } from 'app/models/ModelList.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { ClientesFidelizadosService } from '../../services/clientes-fidelizados.service';
import { TipoClienteFidelizado } from '../../models/clientes-fidelizados/TipoClienteFidelizado.model';

@Component({
  selector: 'app-configuracion-puntajes-fidelidad',
  templateUrl: './configuracion-puntajes-fidelidad.component.html'
})
export class ConfiguracionPuntajesFidelidadComponent {
  public configuracionPuntajesFidelidad: ConfiguracionPuntajesFidelidad;
  public configuracionesPuntajesFidelidad: ConfiguracionPuntajesFidelidad[];
  public crear: boolean;
  public operacion: string;
  public modalidad: string;
  public tiposCliente;

  constructor(private configuracionPuntajesFidelidadService: ConfiguracionPuntajesFidelidadService,
    private clientesFidelizadosService: ClientesFidelizadosService,
    private popupProviderService: PopupProviderService) {
    this.initEntidad();
    this.configuracionesPuntajesFidelidad = [];
    this.crear = false;
    this.cargar();
    this.loadTiposClientes();
    //  this.TiposClienteEnum = TiposCliente;
  }

  initEntidad = (): void => {
    this.operacion = '';
    this.modalidad = '';
    this.configuracionPuntajesFidelidad = new ConfiguracionPuntajesFidelidad(0, null, null, null, null, null);
  }
  loadTiposClientes()
	{
		this.clientesFidelizadosService.getTiposCliente(0,0).then(( response: ModelList<TipoClienteFidelizado>) => {
			this.tiposCliente = response.List;
		}).catch((response: ModelList<TipoClienteFidelizado>) => {
			this.popupProviderService.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
		});
	}

  guardar = (): void => {
    if(this.operacion === 'fidelizacion'){
      this.configuracionPuntajesFidelidad.operacion = { fidelizacion: true, canje: false };
    } else if(this.operacion === 'canje'){
      this.configuracionPuntajesFidelidad.operacion = { fidelizacion: false, canje: true };
    }

    if(this.modalidad === 'galones'){
      this.configuracionPuntajesFidelidad.modalidad = { porGalones: true, porPrecio: false };
    } else if(this.modalidad === 'precio'){
      this.configuracionPuntajesFidelidad.modalidad = { porGalones: false, porPrecio: true };
    }

    if (this.validar()) {
      this.popupProviderService.SimpleMessage('Advertencia', 'Todos los campos son obligatorios', PopupType.WARNING);
      return;
    }

    let tipoClienteSplitted = this.configuracionPuntajesFidelidad.tipoCliente.split('/');

		this.configuracionPuntajesFidelidad.tipoCliente = tipoClienteSplitted[1];
		this.configuracionPuntajesFidelidad.id_tipo_cliente = parseInt(tipoClienteSplitted[0]);

    this.configuracionPuntajesFidelidadService.guardar(this.configuracionPuntajesFidelidad).then((response: GenericResponse<ConfiguracionPuntajesFidelidad>) => {
      if(response.Success){
        this.popupProviderService.SimpleMessage('Éxito', `Configuración de puntajes de fidelidad guardada`, PopupType.SUCCESS);
        this.crear = false;
        this.initEntidad();
        this.cargar();
      } else {
        this.popupProviderService.SimpleMessage(`Advertencia`, `${response.PossibleError}`, PopupType.WARNING);
      }
    }).catch((response: GenericResponse<ConfiguracionPuntajesFidelidad>) => {
      this.popupProviderService.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
    });
  }

  cargar = (): void => {
    this.configuracionPuntajesFidelidadService.cargar().then((response: ModelList<ConfiguracionPuntajesFidelidad>) => {
      this.configuracionesPuntajesFidelidad = response.List;
    }).catch((response: ModelList<ConfiguracionPuntajesFidelidad>) => {
      this.popupProviderService.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
    });
  }

  validar = (): boolean => {
    return this.configuracionPuntajesFidelidad.parametroModalidad === null || 
    this.configuracionPuntajesFidelidad.parametroModalidad.toString() === "" || 
    this.configuracionPuntajesFidelidad.puntos === null || 
    this.configuracionPuntajesFidelidad.puntos.toString() === "" ||
    this.configuracionPuntajesFidelidad.minimoConsumido === null || 
    this.configuracionPuntajesFidelidad.minimoConsumido.toString() === "" ||
    this.operacion === '' ||
    this.modalidad === '' ||
    this.configuracionPuntajesFidelidad.tipoCliente === '';
  }

  modificar = (configuracionPuntajesFidelidad: ConfiguracionPuntajesFidelidad): void => {
    if(configuracionPuntajesFidelidad.operacion.fidelizacion && !configuracionPuntajesFidelidad.operacion.canje){
      this.operacion = 'fidelizacion';
    } else if(!configuracionPuntajesFidelidad.operacion.fidelizacion && configuracionPuntajesFidelidad.operacion.canje){
      this.operacion = 'canje';
    }

    if(configuracionPuntajesFidelidad.modalidad.porGalones && !configuracionPuntajesFidelidad.modalidad.porPrecio){
      this.modalidad = 'galones';
    } else if(!configuracionPuntajesFidelidad.modalidad.porGalones && configuracionPuntajesFidelidad.modalidad.porPrecio){
      this.modalidad = 'precio';
    }

    this.configuracionPuntajesFidelidad = JSON.parse(JSON.stringify(configuracionPuntajesFidelidad));
    this.crear = true;
  }

  eliminar = (id: number): void => {
    this.configuracionPuntajesFidelidadService.eliminar(id).then((response: GenericResponse<string>) => {
      if(response.Success){
        this.popupProviderService.SimpleMessage('Éxito', `Configuración de puntajes de fidelidad eliminada`, PopupType.SUCCESS); 
        this.cargar();
      } else {
        this.popupProviderService.SimpleMessage(`Advertencia`, `${response.PossibleError}`, PopupType.WARNING);
      }
    }).catch((response: GenericResponse<string>) => {
      this.popupProviderService.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
    });
  }

  confirmar = (configuracion: ConfiguracionPuntajesFidelidad): void => {
      this.popupProviderService.QuestionMessage('Eliminar', `Estás seguro de eliminar la configuración?`,
          PopupType.WARNING, 'SI!', 'NO!',
          () => {
              this.eliminar(configuracion.id);
          }, 
          () => {}
      );
  }

  getModalidad = (modalidad: { porGalones: boolean, porPrecio: boolean }): string => {
    if(modalidad.porGalones && !modalidad.porPrecio){
      return 'Por galones';
    } else if(!modalidad.porGalones && modalidad.porPrecio) {
      return 'Por monto';
    }
  }

  getUnidad = (modalidad: { porGalones: boolean, porPrecio: boolean }): string => {
    if(modalidad.porGalones && !modalidad.porPrecio){
      return 'galones';
    } else if(!modalidad.porGalones && modalidad.porPrecio) {
      return 'pesos';
    } else {
      return 'parametro modalidad';
    }
  }

  getOperacion = (operacion: { fidelizacion: boolean, canje: boolean }): string => {
    if(operacion.fidelizacion && !operacion.canje){
      return 'Fidelización';
    } else if(!operacion.fidelizacion && operacion.canje){
      return 'Canje';
    }
  }

  getEstado = (activa: boolean): string => {
    if(activa){
      return 'Si';
    } else {
      return 'No';
    }
  }

  selectTipo = (tipo: string): void => {
    if(tipo === 'incentivo'){//this.tiposCliente.incentivo){
      this.operacion = 'canje';
      this.configuracionPuntajesFidelidad.minimoConsumido = 0;
    }
  }
}