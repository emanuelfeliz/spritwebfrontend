import { Component, ViewChild, ElementRef } from "@angular/core";
import { Incentivo } from 'app/models/incentivo/incentivo.model';
import { IncentivosService } from 'app/services/incentivos.service';
import { GenericResponse } from "app/models/GenericResponse.model";
import { PopupProviderService, PopupType } from "app/services/popupProvider.service";
import { ModelList } from "app/models/ModelList.model";
import { IframePrintService } from "app/services/iframe-print.service";
import { TiposIncentivo } from "app/models/incentivo/TiposIncentivo.enum";

@Component({
    selector: 'app-incentivos',
    templateUrl: './incentivos.component.html'
})
export class IncentivosComponent {
    public incentivo: Incentivo;
    public incentivos: Incentivo[];
    public crear: boolean;
    public pagina: number;
    public limite: number;
    public TiposIncentivoEnum;
    @ViewChild('iframe') iframe: ElementRef;

    constructor(private incentivosService: IncentivosService, private popupProvider: PopupProviderService, private iframePrintService: IframePrintService){
        this.TiposIncentivoEnum = TiposIncentivo;
        this.initEntidad();
        this.incentivos = [];
        this.crear = false;
        this.pagina = 1;
        this.limite = 10;
        this.cargar();
    }

    initEntidad = (): void => {
        this.incentivo = new Incentivo(0, '', '', null, false, '');
    }

    guardar = (): void => {
        if(!this.validar()){
            this.popupProvider.SimpleMessage(`Advertencia`, `Todos los campos son obligatorios`, PopupType.WARNING);
            return;
        }

        if(isNaN(Number(this.incentivo.puntos))){
            this.popupProvider.SimpleMessage(`Advertencia`, `El campo puntos de fidelización debe ser numérico`, PopupType.WARNING);
            return;
        }

        this.incentivosService.guardar(this.incentivo).then((response: GenericResponse<Incentivo>) => {
            if(response.Success){
                this.popupProvider.SimpleMessage('Éxito', `Incentivo guardado`, PopupType.SUCCESS);
                this.crear = false;
                this.initEntidad();
                this.imprimir(response.Response);
                this.cargar();
            } else {
                this.popupProvider.SimpleMessage(`Advertencia`, `${response.PossibleError}`, PopupType.WARNING);
            }
        }).catch((response: GenericResponse<Incentivo>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });
    }

    cargar = (pagina: number = 0): void => {
        this.pagina = pagina !== 0 ? pagina : this.pagina;
        this.incentivosService.cargar(this.limite, this.pagina).then((response: ModelList<Incentivo>) => {
            this.incentivos = response.List;
        }).catch((response: ModelList<Incentivo>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });
    }

    modificar = (incentivo: Incentivo): void => {
        this.incentivo = JSON.parse(JSON.stringify(incentivo));
        this.crear = true;
    }

    eliminar = (id: number): void => {
        this.incentivosService.eliminar(id).then((response: GenericResponse<string>) => {
            if(response.Success){
                this.popupProvider.SimpleMessage('Éxito', `Incentivo eliminado`, PopupType.SUCCESS); 
                this.cargar();
            } else {
                this.popupProvider.SimpleMessage(`Advertencia`, `${response.PossibleError}`, PopupType.WARNING);
            }
        }).catch((response: GenericResponse<string>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });
    }

    confirmar = (incentivo: Incentivo): void => {
        this.popupProvider.QuestionMessage('Eliminar', `Estás seguro de eliminar el incentivo: ${incentivo.nombre}?`,
            PopupType.WARNING, 'SI!', 'NO!',
            () => {
                this.eliminar(incentivo.id);
            }, 
            () => {}
        );
    }

    validar = (): boolean => {
        return this.incentivo.nombre !== '' && this.incentivo.tipo !== '' && this.incentivo.puntos !== null;
    }

    imprimir = (incentivo: Incentivo): void => {
        const incentivoGuardadoTemplate: string = `
            <div style="text-align:center;">
                <h1>Código de incentivo</h1>
                <h2>Nombre: ${incentivo.nombre}</h2>
                <h2>Tipo: ${incentivo.tipo}</h2>
                <h2>Puntos de fidelización: ${incentivo.puntos}<h2>
                <svg id="barcode"></svg>
            </div>
            <script src="app/../assets/js/JsBarcode.all.min.js"></script>
            <script>
                JsBarcode("#barcode", "${incentivo.codigo}");
            </script>
        `;
        this.iframePrintService.imprimir(incentivoGuardadoTemplate, this.iframe);
    }
}