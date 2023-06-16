import { Component, OnInit} from '@angular/core';
import { DialogComponent, DialogService } from "ng6-bootstrap-modal";
import { Deposito } from 'app/models/depositos/Deposito.model';
import { ReturnResultDepositos } from 'app/models/cuadres/returnResultDepositos.model';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { GenericResponse } from '../../../../../models/GenericResponse.model';
import { UsuarioAutenticado } from '../../../../../models/usuarios/UsuarioAutenticado.model';
import { AutenticadorFirmantesService } from 'app/services/autenticador-firmantes.service';
import { DepositosService } from 'app/services/depositos.service';
export interface IDepositosPorBombero {
  depositosRecibidos: Array<Deposito>;
  readOnly_recibido: boolean;
}
@Component({
  selector: 'app-modals',
  templateUrl: './depositos-por-bombero-cuadre.component.html'
})
export class DepositosPorBomberoCuadreModalComponent
extends DialogComponent<IDepositosPorBombero, ReturnResultDepositos> implements IDepositosPorBombero,OnInit  {
  depositosRecibidos: Array<Deposito>;
  readOnly_recibido: boolean;
  Deposito: Deposito;
  depositos:Array<Deposito>;
  p = 1;
  MODAL_VENTA:any;
  deposito_agregado: boolean = false;

  responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
  agregar= (): void => {
    const ExisteDeposito: Deposito  = this.depositos.find(e => {
      return e.codigo_deposito == this.Deposito.codigo_deposito;
    });
    if (ExisteDeposito != null && typeof ExisteDeposito !== 'undefined') {
      this.popupProviderService.SimpleMessage('Depósitos por bombero',
      'No puede registrar un depósito con el mismo código',
      PopupType.WARNING);
      return;
    }
    this.depositos.push(new Deposito('deposito_interno', '', 0, this.Deposito.monto, '', this.Deposito.codigo_deposito,'', this.Deposito.turno));
    this.Deposito.codigo_deposito = "";
    this.Deposito.monto = 0;
  }
  validate=():boolean=>{
    return this.Deposito.codigo_deposito.length === 4 && this.Deposito.monto>0;
  }
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  remover= (deposito: Deposito): void =>{
    this.autenticadorFirmantesService
    .requestFirmanteAutentication(this.responseAuth.Response.eliminar_deposito, "No tiene permisos para anular depositos",
      "Depositos", () => {
        this.popupProviderService.QuestionMessage("Eliminar deposito",
          "Estás seguro de eliminar el deposito?", PopupType.QUESTION, "Si", "No",
          () => {
            this.depositoService.deleteDeposito(deposito, true).then(
              result => {
                if (result.Success) {
                  this.depositos.splice(this.depositos.indexOf(deposito), 1);
                  this.popupProviderService.SimpleMessage("Depositos", "Deposito eliminado", PopupType.SUCCESS);
                } else {
                  this.popupProviderService.SimpleMessage("Depositos", "El deposito no fue eliminado", PopupType.WARNING);
                }
              }
            ).catch(error => {
              this.popupProviderService.SimpleMessage('Depositos', error, PopupType.ERROR);
            });
          }, () => {

          });
      }, { permisoRecibido: "eliminar_deposito" });
  }
  ngOnInit(){
    this.depositos=this.depositosRecibidos;
    this.Deposito.turno = this.depositosRecibidos[0].turno;
  }
  constructor(private popupProviderService: PopupProviderService, dialogService: DialogService, private autenticadorFirmantesService: AutenticadorFirmantesService, private depositoService: DepositosService) {
    super(dialogService);
    this.Deposito = new Deposito('', '', 0, 0, '', '', '');
  }
  cerrar(){
    this.result=new ReturnResultDepositos('cerrar',this.depositos);
    this.close();
  }
}
