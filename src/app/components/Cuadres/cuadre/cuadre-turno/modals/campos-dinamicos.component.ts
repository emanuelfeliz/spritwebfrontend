import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng6-bootstrap-modal";
import { CampoDinamico } from 'app/models/cuadres/campo-dinamico.model';
import { RespuestaVariablesdinamicas } from 'app/models/cuadres/RespuestaVariablesDinamicasModal.model';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
export interface ICamposDinamicos {
  campos_dinamicos_recibidos: Array<CampoDinamico>;
  readOnly_recibido: boolean;
}
@Component({
  selector: 'app-modals',
  templateUrl: './campos-dinamicos.component.html'
})
export class CamposDinamicosModalComponent extends DialogComponent<ICamposDinamicos, string> implements ICamposDinamicos, OnInit {
  campos_dinamicos_recibidos: Array<CampoDinamico>;
  readOnly_recibido: boolean;
  campos_dinamicos: Array<CampoDinamico>;
  readyOnly: boolean;
  valor = 0;
  opcion = 'Sumando';
  descripcion = "";
  tipo_descripcion: string;
  tipo_campo = "Monto";
  p = 1;
  toggleOperation() {
    if (this.opcion == "Restando") {
      this.opcion = "Sumando";
    } else {
      this.opcion = "Restando";
    }
  }
  ngOnInit() {
    this.campos_dinamicos = this.campos_dinamicos_recibidos;
    this.readyOnly = this.readOnly_recibido;
    this.tipo_descripcion = "Prepagos";
  }
  constructor(private popupProviderService: PopupProviderService, dialogService: DialogService) {
    super(dialogService);
  }
  eliminar(campoDinamico: CampoDinamico) {
    this.campos_dinamicos.splice(this.campos_dinamicos.indexOf(campoDinamico), 1);
  }
  addCampo() {
    if (this.valor > 0 && this.tipo_campo != "") {
      if (this.tipo_descripcion == "dinamica") {
        this.campos_dinamicos.push(new CampoDinamico(this.valor, this.descripcion, this.opcion, this.tipo_campo));
      } else {
        this.campos_dinamicos.push(new CampoDinamico(this.valor, this.tipo_descripcion, this.opcion, this.tipo_campo));
      }
    } else {
      this.popupProviderService.SimpleMessage("Campos dinámicos", "Debe completar los campos", PopupType.WARNING);
    }
  }
  cerrar() {
    this.result = JSON.stringify(new RespuestaVariablesdinamicas("cerrar", this.campos_dinamicos));
    this.close();
  }
}
