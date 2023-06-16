import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ClientesFidelizadosService } from '../../../services/clientes-fidelizados.service';
import { TipoClienteFidelizado } from '../../../models/clientes-fidelizados/TipoClienteFidelizado.model';
import { PopupProviderService, PopupType } from '../../../services/popupProvider.service';
import { GenericResponse } from '../../../models/GenericResponse.model';
import { IframePrintService } from 'app/services/iframe-print.service';
import { ModelList } from 'app/models/ModelList.model';

@Component({
  selector: 'app-tipos-cliente-fidelizado',
  templateUrl: './tipos-cliente-fidelizado.component.html',
  styleUrls: ['./tipos-cliente-fidelizado.component.css']
})
export class TiposClienteFidelizadosComponent implements OnInit {

  ngOnInit(): void {
  }

	public tipoClienteFidelizado: TipoClienteFidelizado;
	public tipoClientesFidelizados: TipoClienteFidelizado[];
	public crear: boolean;
	public pagina: number;
	public limite: number;

	@ViewChild('iframe') iframe: ElementRef;

	constructor(
		private clientesFidelizadosService: ClientesFidelizadosService,
		private popupProvider: PopupProviderService,
		private iframePrintService: IframePrintService
	) {
		this.initEntidad();
		this.tipoClientesFidelizados = [];
        this.crear = false;
        this.pagina = 1;
		this.limite = 10;
		this.cargar();
	}

	initEntidad = (): void => {
		this.tipoClienteFidelizado = new TipoClienteFidelizado(0,'',true);
	}

	cargar = (pagina: number = 0): void => {
		this.pagina = pagina !== 0 ? pagina : this.pagina;
		this.clientesFidelizadosService.getTiposCliente(this.limite, this.pagina).then((response: ModelList<TipoClienteFidelizado>) => {
					this.tipoClientesFidelizados = response.List;
		}).catch((response: ModelList<TipoClienteFidelizado>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });;
	}

	guardar = (): void => {
		if (this.validar()) {
			this.popupProvider.SimpleMessage('Validación', 'Debe completar el formulario', PopupType.WARNING);
			return;
		}

		this.clientesFidelizadosService.saveTipoCliente(this.tipoClienteFidelizado).then((response: GenericResponse<TipoClienteFidelizado>) => {
			if(response.Success){
                this.popupProvider.SimpleMessage('Éxito', `Tipo de Cliente guardado con exito`, PopupType.SUCCESS);
                this.crear = false;
                this.initEntidad();
                this.cargar();
            } else {
                this.popupProvider.SimpleMessage(`Advertencia`, `${response.PossibleError}`, PopupType.WARNING);
            }
		}).catch((response: GenericResponse<TipoClienteFidelizado>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });
	}

	modificar = (tipoCliente: TipoClienteFidelizado): void => {
		this.tipoClienteFidelizado = JSON.parse(JSON.stringify(tipoCliente));
		this.crear = true;
	}

	eliminar = (tipoCliente: TipoClienteFidelizado) => {
		tipoCliente.IsActive =false;
		this.clientesFidelizadosService.saveTipoCliente(tipoCliente).then((response: GenericResponse<TipoClienteFidelizado>) => {
            if(response.Success){
				if(response.Response !== null && response.Response !== null){
					this.popupProvider.SimpleMessage('No se pudo eliminar el cliente', response.Response.Tipo_cliente, PopupType.WARNING);
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

	confirmar = (tipoCliente: TipoClienteFidelizado): void => {
        this.popupProvider.QuestionMessage('Eliminar', `Estás seguro de eliminar el tipo de cliente: ${tipoCliente.Tipo_cliente}?`,
            PopupType.WARNING, 'SI!', 'NO!',
            () => {
                this.eliminar(tipoCliente);
            },
            () => {}
        );
    }

	validar = (): boolean => {
		return this.tipoClienteFidelizado.Tipo_cliente === '';
	}



	// imprimirCliente = (cliente: TipoClienteFidelizado): void => {
	// 	const datosClienteTemplate: string = `
	// 	<div style="text-align:center;">
	// 		<h1>Código de cliente fidelizado</h1>
	// 		<h2>${cliente.id} ${cliente.apellidos}</h2>
	// 		<svg id="barcode"></svg>
	// 	</div>
	// 	<script src="app/../assets/js/JsBarcode.all.min.js"></script>
	// 	<script>
	// 		JsBarcode("#barcode", "${cliente.codigo}");
	// 	</script>
  //   `;
	// 	this.iframePrintService.imprimir(datosClienteTemplate, this.iframe);
	// }

	searchTiposClients = (filterText: string = '') => {
		this.pagina = 1;
		this.clientesFidelizadosService.getTipoClientesByCriteria(this.limite, this.pagina, filterText).then((response: ModelList<TipoClienteFidelizado>) => {
			this.tipoClientesFidelizados = response.List;
		}).catch((response: ModelList<TipoClienteFidelizado>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });;
	}

}
