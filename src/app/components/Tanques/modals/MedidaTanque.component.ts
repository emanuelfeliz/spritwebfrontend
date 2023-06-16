import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng6-bootstrap-modal';
import { EstadoTanquesService } from 'app/services/estado-tanques.service';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { MedidaTanque } from 'app/models/Tanques/MedidaTanque.model';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { Turno } from 'app/models/consulta-ventas/Turno.model';
import { ConsultaventasService } from 'app/services/consultaventas.service';

export interface IMedidaTanque {
  dataRecibida: MedidaTanque;
}
declare var $;
@Component({
  selector: 'app-modals',
  templateUrl: './MedidaTanque.component.html'
})
export class MedidaTanqueModalComponent extends DialogComponent<IMedidaTanque, GenericResponse<MedidaTanque>> implements IMedidaTanque, OnInit {
  dataRecibida: MedidaTanque;
  medida: MedidaTanque;
  turnos: Array<Turno>;

  volumen_manual_int: number = 0;
  volumen_manual_eighths: number = 0;
  turno: number = 0;

  ngOnInit() {
    this.medida = this.dataRecibida;
    this.getTurnos();
  }
  constructor(private popupProviderService: PopupProviderService, dialogService: DialogService,
    private ConsultaventasService: ConsultaventasService, private estadoTanquesService: EstadoTanquesService) {
    super(dialogService);
  }
  cerrar() {
    this.close();
  }
  getTurnos = () => {
    this.ConsultaventasService.getTurnos().then(
      result => {
        if (result.PossibleError == '') {
          this.turnos = result.List;
        }
      }
    );
  }

  save = (): void => {

    if (this.turno <= 0) {
      this.popupProviderService.SimpleMessage('Medida tanque', 'Debes seleccionar un turno', PopupType.ERROR);
      return;
    }

    this.popupProviderService.QuestionMessage('Registrar medida Manual',
      `Desea registrar esta medida manual(${this.volumen_manual_int},${this.volumen_manual_eighths} /8), al turno ${this.turno}?`,
      PopupType.WARNING, 'SI!', 'NO!',
      () => {
        this.medida.turno = this.turno;
        this.medida.volumen_manual = parseFloat(this.volumen_manual_int + '.' + this.volumen_manual_eighths);

        this.estadoTanquesService.SetMedidaTanque(this.medida)
          .then(
            result => {
              if (result.Success) {
                this.result = result;
                this.close();
              } else {
                this.result = result;
                this.close();
              }
            }).catch(
              error => {
                this.popupProviderService.SimpleMessage('Medida tanque', error, PopupType.ERROR);
              });

        console.log(this.medida);
      }, () => {
        this.popupProviderService.SimpleMessage('Aviso', 'La operación fue cancelada', PopupType.WARNING);
      });
  }
}

