import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { UsuarioAutenticado } from './../../models/usuarios/UsuarioAutenticado.model';
import { RespuestaAutenticacionUsuario } from 'app/modalsGenerales/RespuestaAutenticacionUsuario.model';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng6-bootstrap-modal";
import { GenericResponse } from '../../models/GenericResponse.model';

export interface IPermiso {
  permisoRecibido: string;
  permisoDenegadoMensaje: string;
}
declare var $;
@Component({
  selector: 'app-modals',
  templateUrl: './modal_autenticacion_usuario.component.html'
})
export class AutenticacionUsuarioModalComponent extends DialogComponent<IPermiso, string> implements IPermiso, OnInit {
  permisoRecibido: string;
  permisoDenegadoMensaje: string;

  Mensaje: string;
  permiso: string;
  codigo: string;
  keyboard: boolean = true;
  returnResult: RespuestaAutenticacionUsuario;
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent = (event: KeyboardEvent) => {
    if ((event.key == "-") && this.keyboard) {
      this.cerrar();
    }
  }

  ngOnInit() {
    this.permiso = this.permisoRecibido;
    this.Mensaje = this.permisoDenegadoMensaje;
    this.focusInput('#txtCodigo');
    setTimeout(() => {
      $('#txtCodigo').val('');
    }, 50);
  }
  toggleKeyboardInput = (value: boolean) => {
    this.keyboard = value;
  }
  focusInput = (id: string): void => $(id).focus();
  constructor(dialogService: DialogService, private AuthenticationService: AuthenticationService,private PopupProviderService:PopupProviderService) {
    super(dialogService);
    this.returnResult = new RespuestaAutenticacionUsuario(null, "");
  }

  Autenticar = () => {
    if (this.codigo !== "") {
      this.AuthenticationService.AutenticarUsuarioConModulo(this.codigo, this.permiso)
        .then(data => {
          if (data.Success) {
            this.returnResult.usuario = data.Response;
            this.returnResult.respuesta = "autenticado";
            this.result = JSON.stringify(this.returnResult);
            this.close();
          } else if (!data.Success && data.PossibleError == "no_autenticado") {
            this.returnResult.respuesta = "no_autenticado";
            this.result = JSON.stringify(this.returnResult);
            this.close();
          } else {
            this.returnResult.respuesta = data.PossibleError;
            this.result = JSON.stringify(this.returnResult);
            this.close();
          }
        })
        .catch(error => {
          this.PopupProviderService.SimpleMessage('Error interno',error,PopupType.ERROR);
        });
    } else {
      this.returnResult.respuesta = "codigo_vacio";
      this.result = JSON.stringify(this.returnResult);
      this.close();
    }
  }
  cerrar() {
    this.returnResult.respuesta = "cerrar";
    this.result = JSON.stringify(this.returnResult);
    this.close();
  }
}
