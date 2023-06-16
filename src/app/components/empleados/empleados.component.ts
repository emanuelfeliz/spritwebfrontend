import { Component } from "@angular/core";
import { Empleado } from 'app/models/empleado/empleado.model';
import { EmpleadosService } from 'app/services/empleados.service';
import { GenericResponse } from "app/models/GenericResponse.model";
import { PopupProviderService, PopupType } from "app/services/popupProvider.service";
import { ModelList } from "app/models/ModelList.model";

@Component({
    selector: 'app-empleados',
    templateUrl: './empleados.component.html',
    styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent {
    public empleado: Empleado;
    public empleados: Empleado[];
    public crear: boolean;
    public pagina: number;
    public limite: number;

    constructor(private empleadosService: EmpleadosService, private popupProvider: PopupProviderService){
        this.initEntidad();
        this.empleados = [];
        this.crear = false;
        this.pagina = 1;
        this.limite = 10;
        this.cargar();
    }

    initEntidad = (): void => {
        this.empleado = new Empleado(0, '', '', '', '','','','');
    }

    guardar = (): void => {
        if(!this.validar()){
            this.popupProvider.SimpleMessage(`Advertencia`, `Todos los campos son obligatorios`, PopupType.WARNING);
            return;
        }

        this.empleadosService.guardar(this.empleado).then((response: GenericResponse<Empleado>) => {
            if(response.Success){
                this.popupProvider.SimpleMessage('Éxito', `Empleado guardado`, PopupType.SUCCESS);
                this.crear = false;
                this.initEntidad();
                this.cargar();
            } else {
                this.popupProvider.SimpleMessage(`Advertencia`, `${response.PossibleError}`, PopupType.WARNING);
            }
        }).catch((response: GenericResponse<Empleado>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });
    }

    cargar = (pagina: number = 0): void => {
        this.pagina = pagina !== 0 ? pagina : this.pagina;
        this.empleadosService.cargar(this.limite, this.pagina).then((response: ModelList<Empleado>) => {
            this.empleados = response.List;
        }).catch((response: ModelList<Empleado>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });
    }

    modificar = (empleado: Empleado): void => {
        this.empleado = JSON.parse(JSON.stringify(empleado));
        this.crear = true;
    }

    eliminar = (id: number): void => {
        this.empleadosService.eliminar(id).then((response: GenericResponse<string>) => {
            if(response.Success){
                this.popupProvider.SimpleMessage('Éxito', `Empleado eliminado`, PopupType.SUCCESS); 
                this.cargar();
            } else {
                this.popupProvider.SimpleMessage(`Advertencia`, `${response.PossibleError}`, PopupType.WARNING);
            }
        }).catch((response: GenericResponse<string>) => {
            this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
        });
    }

    confirmar = (empleado: Empleado): void => {
        this.popupProvider.QuestionMessage('Eliminar', `Estás seguro de eliminar el empleado: ${empleado.nombre}?`,
            PopupType.WARNING, 'SI!', 'NO!',
            () => {
                this.eliminar(empleado.id);
            }, 
            () => {}
        );
    }

    validar = (): boolean => {
        return this.empleado.nombre !== '' && this.empleado.cedula !== '' && this.empleado.departamento !== '';
    }

    validateCedulaInput = (e: any): void => {
        if(typeof e.key !== 'undefined' && !e.key.match(/^\d+$/) || e.target.value.length === 11){
            if(e.keyCode !== 8 && e.keyCode !== 13){
            e.preventDefault();
            }
        }
    }
}