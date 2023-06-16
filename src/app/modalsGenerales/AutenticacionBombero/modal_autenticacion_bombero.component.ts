import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng6-bootstrap-modal';
import { BomberoAutenticado } from 'app/models/bomberos/BomberoAutenticado.model';
import { RespuestaAutenticacionBombero } from 'app/modalsGenerales/RespuestaAutenticacionBombero.model';
export interface IBombero {
  idBombero: number;
}
declare var $;
@Component({
  selector: 'app-modals',
  templateUrl: './modal_autenticacion_bombero.component.html'
})
export class AutenticacionBomberoModalComponent extends DialogComponent<IBombero, string> implements IBombero, OnInit {
  idBombero: number;
  codigo: string;
  keyboard = true;
  returnResult: RespuestaAutenticacionBombero;
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent = (event: KeyboardEvent) => {
    if ((event.key === '-') && this.keyboard) {
      this.cerrar();
    }
  }

  ngOnInit() {
    this.focusInput('#txtCodigoBombero');
    setTimeout(() => {
      $('#txtCodigoBombero').val('');
    }, 50);
  }
  toggleKeyboardInput = (value: boolean) => {
    this.keyboard = value;
  }
  focusInput = (id: string): void => $(id).focus();
  constructor(dialogService: DialogService, private AuthenticationService: AuthenticationService,
    private PopupProviderService: PopupProviderService) {
    super(dialogService);
    this.returnResult = new RespuestaAutenticacionBombero(null, '');
  }

  Autenticar = () => {
    if (this.codigo !== '') {
      this.AuthenticationService.autenticarBombero(this.idBombero, this.codigo)
        .then(data => {
          if (data.Success) {
            this.returnResult.bombero = new BomberoAutenticado(data.Response.id_bombero, data.Response.bombero);
            this.returnResult.respuesta = 'autenticado';
            this.result = JSON.stringify(this.returnResult);
            this.close();
          } else {
            this.returnResult.respuesta = 'no_autenticado';
            this.result = JSON.stringify(this.returnResult);
            this.close();
          }
        })
        .catch(error => {
          this.PopupProviderService.SimpleMessage('Error interno', error, PopupType.ERROR);
        });
    } else {
      this.returnResult.respuesta = 'codigo_vacio';
      this.result = JSON.stringify(this.returnResult);
      this.close();
    }
  }
  cerrar() {
    this.returnResult.respuesta = 'cerrar';
    this.result = JSON.stringify(this.returnResult);
    this.close();
  }
}
