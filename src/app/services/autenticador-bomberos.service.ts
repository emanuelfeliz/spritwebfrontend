import { Injectable } from '@angular/core';
import { DialogService } from 'ng6-bootstrap-modal';
import { Subscription } from 'rxjs';
import { AutenticacionBomberoModalComponent } from 'app/modalsGenerales/AutenticacionBombero/modal_autenticacion_bombero.component';
import { RespuestaAutenticacionBombero } from 'app/modalsGenerales/RespuestaAutenticacionBombero.model';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
@Injectable()
export class AutenticadorBomberosService {
  constructor(private dialogService: DialogService, private popupProvider: PopupProviderService) {

  }
  requestBomberoAutentication = (moduleName: string, callBackSuccess: (result: RespuestaAutenticacionBombero) => void,
    callBackFailure: () => void, data: {}): Subscription => {
    const subscriptionBombero: Subscription =
      this.dialogService.addDialog(AutenticacionBomberoModalComponent, data)
        .subscribe(result => {
          const returnResult: RespuestaAutenticacionBombero = JSON.parse(result);
          const Respuestas: {} = {
            'cerrar': 'Bombero no autenticado',
            'no_autenticado': 'Autenticación incorrecta',
            'codigo_vacio': 'Codigo vacío'
          };
          if (returnResult.respuesta !== 'autenticado') {
            subscriptionBombero.unsubscribe();
            this.popupProvider
              .SimpleMessage(moduleName, Respuestas[returnResult.respuesta] === undefined ?
                `Error al autenticar bombero ${returnResult.respuesta}` : Respuestas[returnResult.respuesta], PopupType.WARNING);
            callBackFailure();
            return;
          }
          subscriptionBombero.unsubscribe();
          callBackSuccess(returnResult);
        });
    return subscriptionBombero;
  }
}
