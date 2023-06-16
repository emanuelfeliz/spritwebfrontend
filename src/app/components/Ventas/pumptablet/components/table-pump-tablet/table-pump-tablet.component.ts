import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { ModelList } from '../../../../../models/ModelList.model';
import { PumpTabletDataPump } from '../../../../../models/pump-tablet/pump_tablet_data_pump.model';
@Component({
  selector: 'table-pump-tablet',
  templateUrl: './table-pump-tablet.component.html'
})
export class TablePumpTabletComponent implements OnInit {
  @Input() TurnoActual: number;
  @Input() Lado: number;
  @Input() FechaCierre:string;
  @Input() PumpTabletDataSelected:boolean;
  @Input() Lista:ModelList<PumpTabletDataPump>;
  @Input() tipo:string;
  @Output() CerrarLadoParent = new EventEmitter();
  constructor() { }

  CerrarLado= (lado: number, ignorarC: boolean) => {
    const type: string = this.tipo;
    this.CerrarLadoParent.emit({type, lado, ignorarC});
  }
  ngOnInit() {

  }

}
