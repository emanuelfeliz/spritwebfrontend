import { AperturaTurnoBombero } from 'app/models/apertura_turno/apertura_turno_bombero.model';
import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng6-bootstrap-modal";
import { Bombero } from 'app/models/bomberos/bomberos.model';
import { AperturaTurnosService } from 'app/services/apertura_turno.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
export interface IApertura{
    apertura_recibida:AperturaTurnoBombero;
}
declare var $;
@Component({
    selector: 'app-modals',
    templateUrl: './editar-bombero-apertura.component.html'
})
export class EditarBomberoAperturaModalComponent extends DialogComponent<null, string> implements IApertura,OnInit {
    apertura_recibida:AperturaTurnoBombero;    
    bomberoSelected:number;
    bomberos: Bombero[] = [];
    ngOnInit() {
        this.cargarBomberos();
        this.bomberoSelected=this.apertura_recibida.id_bombero;
    }
    editarApertura=():void=>{
        this.apertura_recibida.bombero =
        this.bomberos.find((b) => { return b.id == this.bomberoSelected }).name;
        this.apertura_recibida.id_bombero = this.bomberoSelected;
        this.AperturaTurnosService.EditarAperturaBombero(this.apertura_recibida)
        .then(result=>{
            if(result.Success){
                this.result = "apertura_editada";
            }else{
                this.result = result.PossibleError;
            }            
            this.close();
        })
        .catch(error=>{
            this.result = error;
        });
    }
    cargarBomberos = () => {
        this.AperturaTurnosService.cargarBomberos()
          .then(
          result => {
            if (result.PossibleError == "") {
              this.bomberos = result.List;
            }
          }
          ).catch(error => {
            this.popupProviderService.SimpleMessage('Apertura Turno', error, PopupType.ERROR);
          });
      }
    constructor(private popupProviderService: PopupProviderService, dialogService: DialogService,
            public AperturaTurnosService:AperturaTurnosService) {
        super(dialogService);
    }
    cerrar() {
        this.result = "cerrar";
        this.close();
    }
}
