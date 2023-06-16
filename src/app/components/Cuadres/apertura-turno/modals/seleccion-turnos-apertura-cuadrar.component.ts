import { Component, OnInit} from '@angular/core';
import { DialogComponent, DialogService } from "ng6-bootstrap-modal";
export interface ITurnosCuadrar {
  turnos_en_fecha_recibido:string;
}
@Component({
  selector: 'app-modals',
  templateUrl: './seleccion-turnos-apertura-cuadrar.component.html'
})
export class TurnosCuadrarModalComponent extends DialogComponent<ITurnosCuadrar, string> implements ITurnosCuadrar,OnInit  {
  turnos_en_fecha_recibido:string;
  turnos_en_fecha:Array<string>;
  
  seleccionarTurno=(turno:string):void=>{
    this.result=turno;
    this.close();
  }
  ngOnInit(){
    this.turnos_en_fecha=this.turnos_en_fecha_recibido.split(",");
  }
  constructor(dialogService: DialogService) {
    super(dialogService);
  }
  cerrar(){
    this.result="cerrar";
    this.close();
  }
}
