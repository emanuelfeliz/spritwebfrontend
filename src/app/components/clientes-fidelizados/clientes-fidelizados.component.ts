import { Component, ViewChild, ElementRef } from '@angular/core';
import { ClientesFidelizadosService } from '../../services/clientes-fidelizados.service';
import { ClienteFidelizado } from '../../models/clientes-fidelizados/ClienteFidelizado.model';
import { PopupProviderService, PopupType } from '../../services/popupProvider.service';
import { GenericResponse } from '../../models/GenericResponse.model';
import { IframePrintService } from 'app/services/iframe-print.service';
import { ModelList } from 'app/models/ModelList.model';
import { TipoClienteFidelizado } from '../../models/clientes-fidelizados/TipoClienteFidelizado.model';

@Component({
	selector: 'app-clientes-fidelizados',
	templateUrl: './clientes-fidelizados.component.html',
	styleUrls: ['./clientes-fidelizados.component.css']
})
export class ClientesFidelizadosComponent {
	public clienteFidelizado: ClienteFidelizado;
	public clientesFidelizados: ClienteFidelizado[];
	public crear: boolean;
	public pagina: number;
	public limite: number;
	public tiposCliente;
	@ViewChild('iframe') iframe: ElementRef;

	constructor(
		private clientesFidelizadosService: ClientesFidelizadosService,
		private popupProvider: PopupProviderService,
		private iframePrintService: IframePrintService
	) {
		this.initEntidad();
		this.clientesFidelizados = [];
        this.crear = false;
        this.pagina = 1;
		this.limite = 10;
		this.cargar();
		this.loadTiposClientes();
		// this.TiposClienteEnum = TiposCliente;
	}

	loadTiposClientes()
	{
		this.clientesFidelizadosService.getTiposCliente(0,0).then(( response: ModelList<TipoClienteFidelizado>) => {
			this.tiposCliente = response.List;
		}).catch((response: ModelList<TipoClienteFidelizado>) => {
			this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
		});
	}

	initEntidad = (): void => {
		this.clienteFidelizado = new ClienteFidelizado(0, '', '', '', '', '', 0, false, '', 0, 0, '','','','');
	}

	cargar = (pagina: number = 0): void => {
		this.pagina = pagina !== 0 ? pagina : this.pagina;
		this.clientesFidelizadosService.getClientes(this.limite, this.pagina).then((response: ModelList<ClienteFidelizado>) => {
			this.clientesFidelizados = response.List;
		}).catch((response: ModelList<ClienteFidelizado>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });;
	}

	guardar = (): void => {
		if (this.validar()) {
			this.popupProvider.SimpleMessage('Validación', 'Debe completar el formulario', PopupType.WARNING);
			return;
		}
		
		let tipoClienteSplitted = this.clienteFidelizado.tipo_cliente.split('/');

		this.clienteFidelizado.tipo_cliente = tipoClienteSplitted[1];
		this.clienteFidelizado.id_tipo_cliente = parseInt(tipoClienteSplitted[0]);

		this.clientesFidelizadosService.guardar(this.clienteFidelizado).then((response: GenericResponse<ClienteFidelizado>) => {
			if(response.Success){
                this.popupProvider.SimpleMessage('Éxito', `Cliente fidelizado guardado`, PopupType.SUCCESS);
                this.crear = false;
                this.initEntidad();
                this.cargar();
            } else {
                this.popupProvider.SimpleMessage(`Advertencia`, `${response.PossibleError}`, PopupType.WARNING);
            }
		}).catch((response: GenericResponse<ClienteFidelizado>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });
	}

	modificar = (cliente: ClienteFidelizado): void => {
		this.clienteFidelizado = JSON.parse(JSON.stringify(cliente));
		this.crear = true;
	}

	eliminar = (codigo: string) => {
		this.clientesFidelizadosService.deleteClienteFidelizado(codigo).then((response: GenericResponse<string>) => {
            if(response.Success){
				if(response.Response !== null && response.Response !== ''){
					this.popupProvider.SimpleMessage('No se pudo eliminar el cliente', response.Response, PopupType.WARNING);
					return;
				}
                this.popupProvider.SimpleMessage('Éxito', `Cliente fidelizado eliminado`, PopupType.SUCCESS); 
                this.cargar();
            } else {
                this.popupProvider.SimpleMessage(`Advertencia`, `${response.PossibleError}`, PopupType.WARNING);
            }
        }).catch((response: GenericResponse<string>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });
	}

	confirmar = (cliente: ClienteFidelizado): void => {
        this.popupProvider.QuestionMessage('Eliminar', `Estás seguro de eliminar el cliente: ${cliente.nombres}?`,
            PopupType.WARNING, 'SI!', 'NO!',
            () => {
                this.eliminar(cliente.codigo);
            }, 
            () => {}
        );
    }

	validar = (): boolean => {
		return this.clienteFidelizado.nombres === '' || this.clienteFidelizado.apellidos === '' || (this.clienteFidelizado.cedula === '' && this.clienteFidelizado.pasaporte === '') || this.clienteFidelizado.tipo_cliente === '';
	}

	validateCedulaInput = (e: any): void => {
		if (typeof e.key !== 'undefined' && !e.key.match(/^\d+$/) || e.target.value.length === 11) {
			if (e.keyCode !== 8 && e.keyCode !== 13) {
				e.preventDefault();
			}
		}
	}

	verificarImpresion = (cliente: ClienteFidelizado): void => {
		this.clientesFidelizadosService.getDataClient(cliente.codigo).then((result: GenericResponse<ClienteFidelizado>) => {
			if (result.Success) {
				if (result.Response.codigo_impreso) {
					let permisos = JSON.parse(localStorage.getItem('currentUser'));
					if (permisos.Response.reimprimir_codigo_cliente_fidelizado) {
						this.imprimirCliente(cliente);
					} else {
						this.popupProvider.SimpleMessage('Advertencia', 'Este código ya fue impreso y no tienes permiso para imprimirlo de nuevo', PopupType.WARNING);
					}
				} else {
					cliente.codigo_impreso = true;
					this.clientesFidelizadosService.guardar(cliente).then((result: GenericResponse<ClienteFidelizado>) => {
						if (result.Success) {
							this.imprimirCliente(cliente);
						} else {
							this.popupProvider.SimpleMessage('Advertencia', 'No se pudo registrar que este código fue impreso', PopupType.WARNING);
						}
					}).catch(error => {
						this.popupProvider.SimpleMessage('Error', error, PopupType.ERROR);
					});
				}
			} else {
				this.popupProvider.SimpleMessage('Advertencia', 'Cliente no válido', PopupType.WARNING);
			}
		}).catch(error => {
			this.popupProvider.SimpleMessage('No se obtuvo info sobre el cliente', error, PopupType.ERROR);
		});
	}

	imprimirCliente = (cliente: ClienteFidelizado): void => {
		const datosClienteTemplate: string = `
		<div style="text-align:center;">
			<h1>Código de cliente fidelizado</h1>
			<h2>${cliente.nombres} ${cliente.apellidos}</h2>
			<svg id="barcode"></svg>
		</div>
		<script src="app/../assets/js/JsBarcode.all.min.js"></script>
		<script>
			JsBarcode("#barcode", "${cliente.codigo}");
		</script>
    `;
		this.iframePrintService.imprimir(datosClienteTemplate, this.iframe);
	}

	searchClients = (filterText: string = '') => {
		this.pagina = 1;
		this.clientesFidelizadosService.getClientesByCriteria(this.limite, this.pagina, filterText).then((response: ModelList<ClienteFidelizado>) => {
			this.clientesFidelizados = response.List;
		}).catch((response: ModelList<ClienteFidelizado>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });;
	}
}
