import { Component, OnInit } from '@angular/core';
import { Deposito } from 'app/models/depositos/Deposito.model';
import { DialogService } from 'ng6-bootstrap-modal';
import { PrintServiceService } from 'app/services/print-service.service';
import { Router } from '@angular/router';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';
import { DepositosService } from 'app/services/depositos.service';
import { RespuestaAutenticacionBombero } from 'app/modalsGenerales/RespuestaAutenticacionBombero.model';
import { AutenticadorBomberosService } from 'app/services/autenticador-bomberos.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
@Component({
  selector: 'app-depositos',
  templateUrl: './depositos.component.html'
})
export class DepositosComponent implements OnInit {
  loading = false;
  creando = false;
  mostrando = false;
  depositos: Array<Deposito>;
  Deposito: Deposito;
  total = 0;
  p = 1;
  canSave = false;
  responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
  constructor(private popupProviderService: PopupProviderService,
    private autenticadorBomberosService: AutenticadorBomberosService,
    private depositoService: DepositosService, private dialogService: DialogService, private router: Router,
    private printer: PrintServiceService) {
    if (this.responseAuth.PossibleError === '') {
      if (this.responseAuth.Response.depositos == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.Deposito = new Deposito('', '', 0, 0, '', '', '', 0);
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }
  }
  getDepositos = (page: number = 0) => {
    this.loading = true;
    this.p = page !== 0 ? page : this.p;

    this.depositoService.getDepositos(this.p, 10)
      .then(result => {
        if (result.PossibleError === '') {
          this.depositos = result.List;
          this.total = result.TotalRecords;
        }
        this.loading = false;
      })
      .catch(error => {
        this.popupProviderService.SimpleMessage('Depósitos', error, PopupType.ERROR);
        this.loading = false;
      });
  }
  onSubmit = () => {
    console.log("onSubmit CAN SAVE: "+ this.canSave)
    if (this.canSave) {



      this.autenticadorBomberosService.requestBomberoAutentication('Depósitos', (result: RespuestaAutenticacionBombero) => {
        if (this.creando) {
          this.Deposito.bombero = result.bombero.bombero;
          this.Deposito.bombero_id = result.bombero.id_bombero;
          this.depositoService.saveDeposito(this.Deposito)
            .then(reponse => {
              if (reponse.Success) {
                this.popupProviderService.SimpleMessage(
                  'Éxito',
                  'Depósito registrado',
                  PopupType.SUCCESS
                );
                this.printer.openNewTab
                  (`WebForms/TicketDeposito.aspx?codigo=${reponse.Response}`, 'Ticket de Depósito');
                this.getDepositos();
              } else {
                this.popupProviderService.SimpleMessage(
                  'Depósito no fue registrado',
                  'Cuidado: ' + reponse.PossibleError,
                  PopupType.WARNING
                );
              }
            })
            .catch(error => {
              this.popupProviderService.SimpleMessage('Depósitos', error, PopupType.ERROR);
            });
          this.creando = false;
          this.Deposito = new Deposito('', '', 0, 0, '', '', '');
        }
      }, () => {

      }, { idBombero: 0 });

    } else {
      let mensaje = "";

      if (!this.responseAuth.Response.allow_create_deposit_without_manual_code && this.Deposito.monto <= 0
        && this.Deposito.codigo_deposito.length != 4) { mensaje = "debe registrar un codigo de deposito y debe registrar un monto mayor a 0." }

      else if (this.responseAuth.Response.allow_create_deposit_without_manual_code && this.Deposito.monto <= 0) { mensaje = "debe registrar un monto mayor a 0." }
      else if (this.Deposito.monto <= 0) { mensaje = "debe registrar un monto mayor a 0." }
      else if (this.Deposito.codigo_deposito.length != 4) { mensaje = "debe registrar un codigo de deposito." }
      else if (!this.responseAuth.Response.allow_create_deposit_without_manual_code && this.Deposito.codigo_deposito.length != 4) { mensaje = "debe registrar un codigo de deposito"; }

      this.popupProviderService.SimpleMessage(
        'Advertencia',
        mensaje,
        PopupType.WARNING
      );
    }
  };



  cancelDepositoConfirm = (deposito: Deposito) => {
    this.popupProviderService.QuestionMessage('Anulando depósito', 'Estás seguro de anular el depósito?',
      PopupType.WARNING, 'SI!', 'NO!',
      () => {
        this.cancelDeposito(deposito);
      }, () => {
      });
  };
  cancelar = () => {
    this.mostrando = false;
    this.creando = false;
    this.Deposito = new Deposito('', '', 0, 0, '', '', '');
  };
  validate = (deposito: Deposito) => {
    this.canSave = true;
    if(this.responseAuth.Response.allow_create_deposit_without_manual_code == false && (this.Deposito.monto <= 0
      ||  this.Deposito.codigo_deposito.length != 4 )) {this.canSave =false}

    else if(this.responseAuth.Response.allow_create_deposit_without_manual_code == true && this.Deposito.monto <= 0 ){this.canSave=false;}
    else {this.canSave = true}
      console.log("CAN SAVE: "+ this.canSave)

    return this.canSave;

  };
  validateDepositCode = (deposito: Deposito) =>
  {
    this.canSave = true;
    return deposito.codigo_deposito.length == 4 || this.responseAuth.Response.allow_create_deposit_without_manual_code;
  };
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  nuevo = () => {
    this.creando = true;
    this.Deposito = new Deposito('', '', 0, 0, '', '', '');
  }
  cancelDeposito = (deposito: Deposito) => {
    this.depositoService.deleteDeposito(deposito)
      .then(result => {
        if (result.Success) {
          this.popupProviderService.SimpleMessage('Depósitos', 'Depósito anulado', PopupType.SUCCESS);
          this.getDepositos();
        } else {
          this.popupProviderService.SimpleMessage('Depósitos', result.PossibleError, PopupType.WARNING);
        }
      })
      .catch(error => {
        this.popupProviderService.SimpleMessage('Depósitos', error, PopupType.ERROR);
      });
  };

  exportDepositsToExcel(): void {
    this.depositoService.exportDepositsToExcel()
      .then((response) => {
        if (response === 'EXPORTADOS') {
          this.popupProviderService.SimpleMessage('Depositos', 'Depositos exportados', PopupType.SUCCESS);
        } else {
          this.popupProviderService.SimpleMessage('Depositos', response, PopupType.ERROR);
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Depositos', error, PopupType.ERROR);
      });
  }

  ngOnInit() {
    this.getDepositos(1);
  }
  activeCodigoDeposito() {
    console.log("this.responseAuth.Response.allow_user_insert_volume_and_price_in_multiple_bills");
    console.log(this.responseAuth.Response.allow_create_deposit_without_manual_code);
    return this.responseAuth.Response.allow_user_insert_volume_and_price_in_multiple_bills;
  }
}
