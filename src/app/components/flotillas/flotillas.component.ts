import { Component } from "@angular/core";
import { Flotilla } from 'app/models/flotilla/flotilla.model';
import { FlotillasService } from 'app/services/flotillas.service';
import { GenericResponse } from "app/models/GenericResponse.model";
import { PopupProviderService, PopupType } from "app/services/popupProvider.service";
import { ModelList } from "app/models/ModelList.model";

@Component({
    selector: 'app-flotillas',
    templateUrl: './flotillas.component.html'
})
export class FlotillasComponent {
    public flotilla: Flotilla;
    public flotillas: Flotilla[];
    public crear: boolean;
    public pagina: number;
    public limite: number;

    constructor(private flotillasService: FlotillasService, private popupProvider: PopupProviderService){
        this.initEntidad();
        this.flotillas = [];
        this.crear = false;
        this.pagina = 1;
        this.limite = 10;
        this.cargar();
    }

    initEntidad = (): void => {
        this.flotilla = new Flotilla(0, '', '');
    }

    guardar = (): void => {
        if(!this.validar()){
            this.popupProvider.SimpleMessage(`Advertencia`, `Todos los campos son obligatorios`, PopupType.WARNING);
            return;
        }

        this.flotillasService.guardar(this.flotilla).then((response: GenericResponse<Flotilla>) => {
            if(response.Success){
                this.popupProvider.SimpleMessage('Éxito', `Flotilla guardada`, PopupType.SUCCESS);
                this.crear = false;
                this.initEntidad();
                this.cargar();
            } else {
                this.popupProvider.SimpleMessage(`Advertencia`, `${response.PossibleError}`, PopupType.WARNING);
            }
        }).catch((response: GenericResponse<Flotilla>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });
    }

    cargar = (pagina: number = 0): void => {
        this.pagina = pagina !== 0 ? pagina : this.pagina;
        this.flotillasService.cargar(this.limite, this.pagina).then((response: ModelList<Flotilla>) => {
            this.flotillas = response.List;
        }).catch((response: ModelList<Flotilla>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });
    }

    modificar = (flotilla: Flotilla): void => {
        this.flotilla = JSON.parse(JSON.stringify(flotilla));
        this.crear = true;
    }

    eliminar = (id: number): void => {
        this.flotillasService.eliminar(id).then((response: GenericResponse<string>) => {
            if(response.Success){
                this.popupProvider.SimpleMessage('Éxito', `Flotilla eliminada`, PopupType.SUCCESS); 
                this.cargar();
            } else {
                this.popupProvider.SimpleMessage(`Advertencia`, `${response.PossibleError}`, PopupType.WARNING);
            }
        }).catch((response: GenericResponse<string>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });
    }

    confirmar = (flotilla: Flotilla): void => {
        this.popupProvider.QuestionMessage('Eliminar', `Estás seguro de eliminar la flotilla: ${flotilla.nombre}?`,
            PopupType.WARNING, 'SI!', 'NO!',
            () => {
                this.eliminar(flotilla.id);
            }, 
            () => {}
        );
    }

    validar = (): boolean => {
        return this.flotilla.nombre !== '';
    }
}