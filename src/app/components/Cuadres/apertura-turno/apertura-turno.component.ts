import { AutenticadorFirmantesService } from 'app/services/autenticador-firmantes.service';
import { AperturaTurnoBombero } from 'app/models/apertura_turno/apertura_turno_bombero.model';
import { LadoSelected } from './../../../models/apertura_turno/ladoSelected.model';
import { Component, OnInit } from '@angular/core';
import { Bombero } from '../../../models/bomberos/bomberos.model';
import { AperturaTurnosService } from '../../../services/apertura_turno.service';
import { UsuarioAutenticado } from '../../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { GenericResponse } from './../../../models/GenericResponse.model';
import { DialogService } from 'ng6-bootstrap-modal';
import { RespuestaAutenticacionBombero } from 'app/modalsGenerales/RespuestaAutenticacionBombero.model';
import { PrintServiceService } from 'app/services/print-service.service';
import { ReporteRecibido } from 'app/models/ReportesGenerator/ReporteRecibido.model';
import { AutenticadorBomberosService } from 'app/services/autenticador-bomberos.service';
import { DetallePorLado } from 'app/models/apertura_turno/DetallePorLado.model';
import { Subscription } from 'rxjs';
import { TurnosCuadrarModalComponent } from 'app/components/Cuadres/apertura-turno/modals/seleccion-turnos-apertura-cuadrar.component';
import { EditarBomberoAperturaModalComponent } from 'app/components/Cuadres/apertura-turno/modals/editar-bombero-apertura.component';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { PumptabletService } from '../../../services/pumptablet.service';
@Component({
  selector: 'app-apertura-turno',
  templateUrl: './apertura-turno.component.html'
})

export class AperturaTurnoComponent implements OnInit {
  AperturaTurnoBombero: AperturaTurnoBombero;
  bomberoSelected: number = 0;
  MODAL_ESTADO_LADOS: any;
  bomberos: Bombero[] = [];
  AperturaTurnoBomberosActivos: AperturaTurnoBombero[] = [];
  AperturaTurnoBomberosInactivos: AperturaTurnoBombero[] = [];
  lados: LadoSelected[] = [];
  MODAL_AUTENTICACION_BOMBEROS: any;
  responseAuth: GenericResponse<UsuarioAutenticado>;
  MODAL_EDITAR_BOMBERO_APERTURA: Subscription;
  MODAL_SELECCION_TURNOS_APERTURA_CUADRAR: Subscription;
  p_1 = 1;
  p_2 = 1;
  loading = false;
  constructor(private popupProviderService: PopupProviderService, public AperturaTurnosService: AperturaTurnosService,
    private autenticadorBomberosService: AutenticadorBomberosService,
    private dialogService: DialogService, private router: Router, private pumptabletService: PumptabletService,
    private printer: PrintServiceService, private autenticadorBombero: AutenticadorBomberosService,
    private autenticadorFirmantesService: AutenticadorFirmantesService) {
    this.responseAuth = JSON.parse(localStorage.getItem('currentUser'));
    if (this.responseAuth.PossibleError == '') {
      if (this.responseAuth.Response.aperturar_turno == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        let d: Array<DetallePorLado> = [];
        this.AperturaTurnoBombero = new AperturaTurnoBombero(0, '', '', '', '', '', '', '', 'S', 0, '', 0, '', '', d);
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión',
        PopupType.ERROR);
    }
  }
  imprimir = (aperturaTurno: AperturaTurnoBombero) => {
    this.printer.generateReporte(new ReporteRecibido('Reporte de Apertura', '~/Reportes/AperturaTurnos/rptAperturaTurno.rpt',
      'apertura_turno', false, null, null, JSON.stringify(aperturaTurno)), false);
  }

  deleteApertura = (id: number): void => {
    this.AperturaTurnosService.EliminarAperturaBombero(id).then(response => {
      if (response.Success) {
        this.popupProviderService.SimpleMessage(
          'Éxito',
          'Apertura eliminada',
          PopupType.SUCCESS
        );
        this.cargarLados();
        this.getAperturaTurnosActivos();
        this.getAperturaTurnosInactivos();
      } else {
        this.popupProviderService.SimpleMessage(
          'Apertura no eliminada',
          'Algo salió mal!',
          PopupType.ERROR
        );
      }
    }).catch(error => {
      this.popupProviderService.SimpleMessage('Apertura Turno', error, PopupType.ERROR);
    });
  }
  eliminarConfirm = (apertura: AperturaTurnoBombero): void => {
    this.autenticadorFirmantesService.requestFirmanteAutentication(this.responseAuth.Response.eliminar_apertura,
      "No tiene permisos para eliminar una apertura", "Pumptablet", () => {
        this.popupProviderService.QuestionMessage('Eliminar apertura', `Estás seguro de eliminar la apertura de los lados ${apertura.lados}?`,
          PopupType.WARNING, 'SI!', 'NO', () => {
            this.deleteApertura(apertura.id);
          }, () => {

          });
      }, { permisoRecibido: "eliminar_apertura" });
  }

  EsDispensadorPar = (ladoA: number, ladoB: number): boolean => {
    if ((ladoA % 2 == 0 && ladoB % 2 == 0) || (ladoA % 2 != 0 && ladoB % 2 != 0)) {
      return false;
    } else if (ladoA % 2 == 0 && (ladoB == ladoA - 1)) {
      return true;
    } else if (ladoB % 2 == 0 && (ladoA == ladoB - 1)) {
      return true;
    }
    return false;
  }

  editar = (apertura: AperturaTurnoBombero) => {
    if (this.responseAuth.Response.editar_apertura_cerrada === true) {
      this.MODAL_EDITAR_BOMBERO_APERTURA = this.dialogService.addDialog(EditarBomberoAperturaModalComponent,
        { apertura_recibida: apertura }).subscribe(
          result => {
            if (result == 'cerrar') {
              this.MODAL_EDITAR_BOMBERO_APERTURA.unsubscribe();
            } else if (result == 'apertura_editada') {
              this.popupProviderService.SimpleMessage('Apertura turno', 'La apertura fue editada',
                PopupType.SUCCESS);
              this.MODAL_EDITAR_BOMBERO_APERTURA.unsubscribe();
            } else {
              this.popupProviderService.SimpleMessage('Apertura turno', result, PopupType.WARNING);
              this.MODAL_EDITAR_BOMBERO_APERTURA.unsubscribe();
            }
          }
        );
    } else {
      this.popupProviderService.SimpleMessage('Editando apertura', 'No tiene permisos de editar aperturas', PopupType.WARNING);
    }
  }

  cuadrar = (apertura: AperturaTurnoBombero): void => {
    this.autenticadorBomberosService.requestBomberoAutentication('Apertura de turno', (result: RespuestaAutenticacionBombero) => {

      if(result.bombero.id_bombero !== apertura.id_bombero) {
        this.popupProviderService.SimpleMessage('Cuadrar', 'No tiene permisos de cuadrar este cuadre', PopupType.ERROR);
        return;
      }

      if (apertura.turno_actual.split(',').length == 1) {
        this.router.navigate(['/cuadrar_turno', apertura.turno_actual, 0, apertura.bombero, apertura.lados]);
      } else {
        this.MODAL_SELECCION_TURNOS_APERTURA_CUADRAR = this.dialogService.addDialog(TurnosCuadrarModalComponent, {
          turnos_en_fecha_recibido: apertura.turno_actual
        }).subscribe(
          result => {
            if (result == 'cerrar') {
              this.MODAL_SELECCION_TURNOS_APERTURA_CUADRAR.unsubscribe();
            } else {
              this.router.navigate(['/cuadrar_turno', result, 0, apertura.bombero, apertura.lados]);
              this.MODAL_SELECCION_TURNOS_APERTURA_CUADRAR.unsubscribe();
            }
          }
        );
      }

  },
  () => {
    this.router.navigate(['/aperturar_turno']);
   }, { idBombero: 0 });
  }

  checkIfHaveOtherTurnOpen(id_bombero: number, bombero: string, success: () => void): void {
    if (!this.responseAuth.Response.bombero_open_more_than_one_turn) {
      this.pumptabletService.checkIfHaveAnotherTurnOpen(id_bombero, bombero)
        .then((response) => {
          if (response.Success) {
            success();
          } else {
            this.popupProviderService.SimpleMessage('Apertura turno', response.Response, PopupType.INFO);
          }
        })
        .catch((error) => {
          this.popupProviderService.SimpleMessage('Apertura turno', 'Error de parte del servidor', PopupType.ERROR);
        });
    } else {
      success();
    }
  }

  Registrar = () => {
    this.AperturaTurnoBombero.lados = this.getLados();
    if (this.AperturaTurnoBombero.lados == '') {
      this.popupProviderService.SimpleMessage('Apertura de Turnos', 'Debe seleccionar por lo menos un lado',
        PopupType.WARNING);
      return;
    }
    this.AperturaTurnoBombero.lados_activos = this.getLados();
    this.AperturaTurnoBombero.detalles_por_lado = this.GenerarDetallesPorLado(this.AperturaTurnoBombero.lados);
    if (this.getLados().split(',').length == 1 &&
      !this.responseAuth.Response.aperturar_por_lado) {
      this.popupProviderService.SimpleMessage('Apertura de Turnos', 'No tiene permisos de aperturar por lado',
        PopupType.WARNING);
      return;
    } else if (this.getLados().split(',').length == 2) {
      if (this.EsDispensadorPar(Number(this.getLados().split(',')[0]), Number(this.getLados().split(',')[1]))) {
        if (!this.responseAuth.Response.aperturar_por_dispensador) {
          this.popupProviderService.SimpleMessage('Apertura de Turnos', 'No tiene permisos de aperturar por dispensador',
            PopupType.WARNING);
          return;
        }
        if ((this.AperturaTurnoBombero.detalles_por_lado[0].turno != this.AperturaTurnoBombero.detalles_por_lado[1].turno)
          && !this.responseAuth.Response.aperturar_por_dispensador_sin_importar_turno) {
          this.popupProviderService.SimpleMessage('Apertura de Turnos',
            'No tiene permisos de aperturar por dispensador sin importar el turno',
            PopupType.WARNING);
          return;
        }
      } else {
        this.popupProviderService.SimpleMessage('Apertura de Turnos',
          `Los lados (${this.getLados().split(',')[0]} y ${this.getLados().split(',')[1]}) no pertenecen al mismo dispensador`,
          PopupType.WARNING);
        return;
      }

    }
    if (this.bomberoSelected == 0 || this.bomberoSelected == undefined || this.bomberoSelected == null) {
      this.popupProviderService.SimpleMessage('Apertura de Turnos', 'Debe seleccionar el bombero',
        PopupType.WARNING);
      return;
    }
    this.AperturaTurnoBombero.bombero = this.bomberos.find((b) => { return b.id == this.bomberoSelected }).name;
    this.AperturaTurnoBombero.id_bombero = this.bomberoSelected;

    this.checkIfHaveOtherTurnOpen(this.AperturaTurnoBombero.id_bombero, this.AperturaTurnoBombero.bombero, () => {
      this.MODAL_AUTENTICACION_BOMBEROS = this.autenticadorBombero
        .requestBomberoAutentication('Apertura Turno', (result: RespuestaAutenticacionBombero): void => {
          this.AperturaTurnosService.RegistrarApertura(this.AperturaTurnoBombero)
            .then(
              (resultRegister: GenericResponse<AperturaTurnoBombero>) => {
                if (resultRegister.Success) {
                  this.getAperturaTurnosActivos();
                  this.getAperturaTurnosInactivos();
                  this.imprimir(resultRegister.Response);
                  this.cargarLados();
                  let d: Array<DetallePorLado> = [];
                  this.AperturaTurnoBombero = new AperturaTurnoBombero(0, '', '', '', '', '', '', '', 'S', 0, '', 0, '', '', d);
                  this.bomberoSelected = 0;
                  this.popupProviderService.SimpleMessage('Aperturar Turno', 'Turno aperturado correctamente', PopupType.SUCCESS);
                } else {
                  this.popupProviderService.SimpleMessage('Aperturar Turno', resultRegister.PossibleError,
                    PopupType.WARNING);
                }
              }).catch(error => {
                this.popupProviderService.SimpleMessage('Apertura Turno', error, PopupType.ERROR
                );
              });

          this.popupProviderService.SimpleMessage('Aperturar Turno', 'Turno aperturado correctamente',
            PopupType.SUCCESS);
        }, () => {

        }, { idBombero: this.bomberoSelected });
    });
  }

  getAperturaTurnosActivos = () => {
    this.loading = true;
    this.AperturaTurnosService.getAperturaTurnos('S')
      .then(
        result => {
          if (result.PossibleError == '') {
            this.AperturaTurnoBomberosActivos = result.List;
            this.loading = false;
          }
        }).catch(error => {
          this.popupProviderService.SimpleMessage('Apertura Turno', error, PopupType.ERROR);
          this.loading = false;
        });
  }
  getAperturaTurnosInactivos = () => {
    this.loading = true;
    this.AperturaTurnosService.getAperturaTurnos('N')
      .then(
        result => {
          if (result.PossibleError == '') {
            this.AperturaTurnoBomberosInactivos = result.List;
            this.loading = false;
          }
        }).catch(error => {
          this.popupProviderService.SimpleMessage('Apertura Turno', error, PopupType.ERROR);
          this.loading = false;
        });
  }
  cargarLados = () => {
    this.loading = true;
    this.AperturaTurnosService.cargarLados()
      .then(
        result => {
          if (result.PossibleError == '') {
            this.lados = result.List;
            this.loading = false;
          }
        }).catch(error => {
          this.popupProviderService.SimpleMessage('Apertura Turno', error, PopupType.ERROR);
          this.loading = false;
        });
  }
  GenerarDetallesPorLado = (LadosString: string): Array<DetallePorLado> => {
    let lados: Array<string> = LadosString.split(',');
    let Detalles: Array<DetallePorLado> = [];
    lados.forEach(element => {
      Detalles.push(new DetallePorLado(Number(element), this.lados.find((b) => { return b.Lado == Number(element) }).turnoActual));
    });
    return Detalles;
  }
  getLados = (): string => {
    let result: string = '';
    for (let index = 0; index < this.lados.length; index++) {
      if (this.lados[index]['Selected'] === true) {
        result += (result !== '' ? ',' : '') + this.lados[index]['Lado'];
      }
    }
    return result;
  }

  cargarBomberos = () => {
    this.AperturaTurnosService.cargarBomberos()
      .then(
        result => {
          if (result.PossibleError == '') {
            this.bomberos = result.List;
          }
        }
      ).catch(error => {
        this.popupProviderService.SimpleMessage('Apertura Turno', error, PopupType.ERROR);
      });
  }
  ngOnInit() {
    this.cargarBomberos();
    this.cargarLados();
    this.getAperturaTurnosActivos();
    this.getAperturaTurnosInactivos();
  }

}
