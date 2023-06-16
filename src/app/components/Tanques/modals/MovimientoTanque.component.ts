import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng6-bootstrap-modal";
import { MovimientoTanque } from 'app/models/Tanques/MovimientoTanque.model';
import { EstadoTanquesService } from 'app/services/estado-tanques.service';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';

export interface IMovimientoTanque {
  dataRecibida: MovimientoTanque;
}
declare var $;
@Component({
  selector: 'app-modals',
  templateUrl: './MovimientoTanque.component.html'
})
export class MovimientoTanqueModalComponent extends DialogComponent<IMovimientoTanque, string> implements IMovimientoTanque, OnInit {
  dataRecibida: MovimientoTanque;
  movimiento: MovimientoTanque;

  ngOnInit() {
    this.movimiento = this.dataRecibida;
  }
  constructor(private popupProviderService: PopupProviderService, dialogService: DialogService,
    private estadoTanquesService: EstadoTanquesService) {
    super(dialogService);
  }
  cerrar() {
    this.close();
  }
  save = (): void => {
    this.popupProviderService.QuestionMessage(`${this.movimiento.aumentando ? "Aumentando" : "Disminuyendo"} Volumen del tanque de ${this.movimiento.producto}`,
      `Está seguro de ${this.movimiento.aumentando ? "Ingresar" : "Egresar"} ${this.movimiento.volumen_movimiento} Gals. al tanque de ${this.movimiento.producto}`,
      PopupType.WARNING, 'SI!', 'NO!',
      () => {
        this.estadoTanquesService.updateVolume(this.movimiento)
          .then(
          result => {
            if (result.Success) {
              this.result = "Exito";
              this.close();
            } else {
              this.result = "Fallo";
              this.close();
            }
          }).catch(error => {
            this.popupProviderService.SimpleMessage("Movimiento tanque", error, PopupType.ERROR);
          });
      },
      () => {
        this.popupProviderService.SimpleMessage("Aviso", "La operación fue cancelada", PopupType.WARNING);
      });

  }
  validateModel = (): boolean => {
    return this.movimiento.bombero != "" && this.movimiento.id_bombero != 0 &&
      this.movimiento.id_tanque != 0 && this.movimiento.tipo_factura != "0" && this.movimiento.volumen_movimiento != 0;
  }
}
