import { RespuestaAutenticacionUsuario } from './../modalsGenerales/RespuestaAutenticacionUsuario.model';
import { Injectable } from '@angular/core';
import { DialogService } from 'ng6-bootstrap-modal';
import { Subscription } from 'rxjs';
import { AutenticacionUsuarioModalComponent } from 'app/modalsGenerales/AutenticacionUsuario/modal_autenticacion_usuario.component';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
@Injectable()
export class AutenticadorFirmantesService {

  constructor(private dialogService: DialogService,private popupProvider:PopupProviderService) { 

  }
  requestFirmanteAutentication=(permisoConcedido:boolean,permisoDenegadoMensaje:string,moduleName:string,callBackSuccess: () => void,data:{}):Subscription=>{
    if(permisoConcedido){
        callBackSuccess();
        return;
    }
    data['permisoDenegadoMensaje']=permisoDenegadoMensaje;
    let subscriptionFirmante:Subscription=this.dialogService.addDialog(AutenticacionUsuarioModalComponent,data)
    .subscribe(result=>{
      let returnResult:RespuestaAutenticacionUsuario=JSON.parse(result);
      let Respuestas:{}={
        "cerrar":"Firmante no autenticado",
        "no_autenticado":"Autenticación incorrecta",
        "codigo_vacio":"Codigo vacío"
      };
      if(returnResult.respuesta!=="autenticado"){
        subscriptionFirmante.unsubscribe();
        this.popupProvider.SimpleMessage(moduleName,Respuestas[returnResult.respuesta]==undefined? `Error al autenticar firmante (${returnResult.respuesta})` : Respuestas[returnResult.respuesta],PopupType.WARNING);
        return;
      }
      subscriptionFirmante.unsubscribe();
      callBackSuccess();
    });
    return subscriptionFirmante;
  }
}
