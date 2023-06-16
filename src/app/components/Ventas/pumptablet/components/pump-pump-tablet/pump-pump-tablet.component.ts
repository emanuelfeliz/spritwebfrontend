import { LadoPT } from './../../../../../models/pump-tablet/lado-pt.model';
import { GenericResponse } from '../../../../../models/GenericResponse.model';
import { ResumenLado } from '../../../../../models/pump-tablet/resumen_lado.model';
import { UsuarioAutenticado } from '../../../../../models/usuarios/UsuarioAutenticado.model';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'pump-pump-tablet',
  templateUrl: './pump-pump-tablet.component.html'
})
export class PumpPumpTabletComponent implements OnInit {
  @Input() ResumenLado: ResumenLado;
  @Input() habilitarChecks: boolean;
  @Input() habilitarBoton: boolean;
  Selected: boolean;
  @Output() seleccionarCheckByPump = new EventEmitter();
  @Output() seleccionarPump = new EventEmitter();
  responseAuth: GenericResponse<UsuarioAutenticado>;

  pumps_color = {
    OFFLINE: 'alert-danger',
    ERROR: 'alert-secondary',
    CLOSED: 'alert-secondary',
    AUTHORIZED: 'alert-dark',
    IDLE: 'alert-success',
    STARTING: 'alert-info',
    CALLING: 'alert-primary',
    FUELLING: 'alert-warning',
  };
  @ViewChild('check') check: ElementRef;
  constructor(private renderer: Renderer2) {
    this.responseAuth = JSON.parse(localStorage.getItem('currentUser'));
  }
  public setCheckStatus = (checked: boolean): void => {
    this.check.nativeElement.checked = checked;
  }

  changeSelect = (lado: number, turno: number, aperturado: boolean) => {
    const ladoPT: LadoPT = new LadoPT(this.Selected, lado, turno, aperturado ? 'A' : 'C');
    this.seleccionarCheckByPump.emit(ladoPT);
  }
  ngOnInit() {
  }

}
