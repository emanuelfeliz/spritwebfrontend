import { isNullOrWhiteSpace, isNullOrEmpty } from './../../../../commons/utils/string.utils';
import { ICoinRate } from './../../../../models/coin/ICoinRate';
import { AutenticadorFirmantesService } from 'app/services/autenticador-firmantes.service';
import { BomberosService } from './../../../../services/bomberos.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bombero } from '../../../../models/bomberos/bomberos.model';
import { ModelList } from '../../../../models/ModelList.model';
import { UsuarioAutenticado } from '../../../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { GenericResponse } from './../../../../models/GenericResponse.model';
import { DialogService } from 'ng6-bootstrap-modal';
import { CuadresService } from 'app/services/cuadre.service';
import { Cuadre } from 'app/models/cuadres/cuadre.model';
import { Denominaciones } from 'app/models/cuadres/denominaciones.model';
import { Sale } from 'app/models/ventas/sale.model';
import { VentasPorBomberoCuadreModalComponent } from 'app/components/Cuadres/cuadre/cuadre-turno/modals/ventas-por-bombero-cuadre.component';
import { CampoDinamico } from 'app/models/cuadres/campo-dinamico.model';
import { CamposDinamicosModalComponent } from 'app/components/Cuadres/cuadre/cuadre-turno/modals/campos-dinamicos.component';
import { RespuestaVariablesdinamicas } from 'app/models/cuadres/RespuestaVariablesDinamicasModal.model';
import { PrintServiceService } from 'app/services/print-service.service';
import { Pago } from 'app/models/pagos/Pago.model';
import { PagosPorBomberoCuadreModalComponent } from 'app/components/Cuadres/cuadre/cuadre-turno/modals/pagos-por-bombero-cuadre.component';
import { CuadreValidacionModel } from 'app/models/cuadres/cuadreValidacionModel.model';
import { TurnosService } from 'app/services/turnos.service';
import { Deposito } from 'app/models/depositos/Deposito.model';
import { Subscription } from 'rxjs';
import { DepositosPorBomberoCuadreModalComponent } from 'app/components/Cuadres/cuadre/cuadre-turno/modals/depositos-por-bombero-cuadre.component';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { CuadreDataPost } from '../../../../models/cuadres/CuadreDataPost.model';
import { DescuentosPorTurnoBomberoComponent } from './modals/descuentos-por-turno-bombero/descuentos-por-turno-bombero.component';
declare var $;
@Component({
  selector: 'app-cuadre-turno',
  templateUrl: './cuadre-turno.component.html'
})
export class CuadreTurnoComponent implements OnInit {

  bomberoSelected: number = 0;
  bomberos: Bombero[] = [];
  turno: number;
  fecha_inicial_turno: string;
  fecha_final_turno: string;
  denominaciones: number[] = [2000, 1000, 500, 200, 100, 50, 25, 20, 10, 5, 1];
  MODAL_VENTAS_CUADRE_BOMBERO: Subscription;
  MODAL_CAMPOS_DINAMICOS: Subscription;
  MODAL_PAGOS: Subscription;
  MODAL_DEPOSITOS: Subscription;
  MODAL_DESCUENTOS: Subscription;
  cuadre: Cuadre;
  CuadreDataPost: CuadreDataPost;
  fechaActual: string;
  readOnly = false;
  cuadreValidado = false;
  loadingData = false;
  responseAuth: GenericResponse<UsuarioAutenticado>;
  tipoCalculoSelected = 'BASED';
  basedNotAvailable = true;
  calculatedNotAvailable = true;
  editingCuadre = false;
  textoEdit = 'Editar';
  dopAmountEuro = 0;
  dopAmountDollar = 0;
  rates: ICoinRate[] = [];

  creando = false;
  get totalMontoDeposito(): number {
    let totalDepositos = 0;
    if (this.cuadre.depositos != null && this.cuadre.depositos.length > 0) {
      this.cuadre.depositos.forEach(deposito => {
        totalDepositos += deposito.monto;
      });
    }
    return totalDepositos;
  }
  constructor(private bomberoService: BomberosService, private route: ActivatedRoute,
    private dialogService: DialogService, private router: Router, private cuadresService: CuadresService,
    private printer: PrintServiceService, private turnosService: TurnosService, private popupProviderService: PopupProviderService,
    private autenticadorFirmantesService: AutenticadorFirmantesService) {

    this.responseAuth = JSON.parse(localStorage.getItem('currentUser'));
    if (this.responseAuth.PossibleError == '') {
      // if (this.responseAuth.Response.insertar_cuadre == false) {
      //   this.router.navigate(['permisodenegado']);
      // }
      this.limpiar();
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }
  }

  calculateDollarDOPAmount() {
    if (this.rates == null || this.rates == undefined || this.rates.length == 0) {

      this.popupProviderService.SimpleMessage('Cuadres', 'Error en la tabla CoinRate', PopupType.ERROR);
    } else {
      const rate = this.cuadre.DollarRate || this.rates.find(x => x.CoinName.toLowerCase() == "dollar").Rate;

      this.dopAmountDollar = this.cuadre.DollarAmount * rate;
      this.cuadre.DollarRate = rate;
    }
  }

  calculateEuroDOPAmount() {
    if (this.rates == null || this.rates == undefined || this.rates.length == 0) {

      this.popupProviderService.SimpleMessage('Cuadres', 'Error en la tabla CoinRate', PopupType.ERROR);
    } else {
      const rate = this.cuadre.EuroRate || this.rates.find(x => x.CoinName.toLowerCase() == "euro").Rate;

      this.dopAmountEuro = this.cuadre.EuroAmount * rate;
      this.cuadre.EuroRate = rate;
    }
  }

  RecalcularCuadre = (): Promise<any> => {
    return new Promise((resolve) => {

      if (this.tipoCalculoSelected === '0') {
        this.popupProviderService.SimpleMessage('Cuadres', 'Debe seleccionar un tipo de cálculo', PopupType.WARNING);
        return;
      }
      this.cuadre.denominaciones.forEach(element => {
        if (element.cantidad == null) {
          element.cantidad = 0;
        }
      });
      if (this.bomberoSelected !== 0 && this.bomberoSelected !== undefined) {
        this.loadingData = true;

        const bombero_data = this.bomberos.find((b) => { return b.id == this.bomberoSelected; });
        this.cuadre.bombero = bombero_data.name;
        if (this.cuadre.Lados === '') {
          this.cuadre.Lados = bombero_data.lados;
        }
        this.cuadre.id_bombero = this.bomberoSelected;
        this.cuadre.total_efectivo_registrado = this.calcularEfectivoRegistrado();
        this.cuadre.total_efectivo_registrado_admin = this.calcularEfectivoRegistradoAdmin();
        this.cuadresService.LoadDataByCuadre(this.cuadre, this.tipoCalculoSelected).then(
          result => {
            if (result.Success) {
              this.cuadre = result.Response;
              this.cargarHorasByTurnoYLado(this.cuadre.turno, this.cuadre.Lados);
            } else {
              this.popupProviderService.SimpleMessage('Cuadre', result.PossibleError, PopupType.WARNING);
              this.router.navigate(['/aperturar_turno']);
            }
            this.loadingData = false;
            resolve();
          }).catch(error => {
            this.popupProviderService.SimpleMessage('Cuadre turno', error, PopupType.ERROR);
          });
      } else {
        this.popupProviderService.SimpleMessage('Cuadre', 'Debe seleccionar el bombero', PopupType.WARNING);
      }

    });
  }

  getCoinRates() {
    this.cuadresService.getCoinRates()
      .then(result => {
        if (!isNullOrWhiteSpace(result.PossibleError) || !isNullOrEmpty(result.PossibleError)) {
          this.rates = result.List;
        } else {
          console.log('posible error: ', result.PossibleError);
          this.popupProviderService.SimpleMessage('Cuadre', result.PossibleError, PopupType.ERROR);
        }
      });
  }

  calcularEfectivoRegistrado = (): number => {
    let total_efectivo_registrado = 0;
    this.cuadre.denominaciones.forEach(element => {
      total_efectivo_registrado += element.cantidad * element.denominacion;
    });
    return total_efectivo_registrado;
  }
  calcularEfectivoRegistradoAdmin = (): number => {
    let total_efectivo_registrado_admin = 0;
    this.cuadre.denominaciones_admin.forEach(element => {
      total_efectivo_registrado_admin += element.cantidad * element.denominacion;
    });
    return total_efectivo_registrado_admin;
  }

  focusInput = (id: string) => $(id).focus();

  verCamposDinamicos = (): void => {
    this.MODAL_CAMPOS_DINAMICOS = this.dialogService.addDialog(CamposDinamicosModalComponent, {
      campos_dinamicos_recibidos: this.cuadre.campos_dinamicos,
      readOnly_recibido: false
    }).subscribe(
      result => {

        let response: RespuestaVariablesdinamicas = JSON.parse(result);
        if (response.respuesta == 'cerrar') {
          this.cuadre.campos_dinamicos = response.campos_dinamicos;
          this.MODAL_CAMPOS_DINAMICOS.unsubscribe();
        }
      }
    );
  }

  verDescuentos(): void {
    let bomberSelect = this.bomberoSelected;
    let bomberoSelectedName = this.bomberos.find(function (bombero) {
      return bombero.id == bomberSelect;
    });

    this.MODAL_DESCUENTOS = this.dialogService.addDialog(DescuentosPorTurnoBomberoComponent,
      { turno: this.turno, bombero: bomberoSelectedName.name }).subscribe(
        result => {
          if (result == 'close') {
            this.MODAL_DESCUENTOS.unsubscribe();
          }
        }
      );
  }

  verDepositos = (): void => {
    if (this.cuadre.bombero == '' && this.cuadre.id_bombero == 0) {
      this.popupProviderService.SimpleMessage('Cuadres', 'Debe seleccionar el bombero y recalcular', PopupType.WARNING);
      return;
    }
    this.MODAL_DEPOSITOS = this.dialogService.addDialog(DepositosPorBomberoCuadreModalComponent, {
      depositosRecibidos: this.cuadre.depositos,
      readOnly_recibido: false
    }).subscribe(
      result => {
        if (result.response == 'close') {
          this.cuadre.depositos = result.depositos;
          this.MODAL_DEPOSITOS.unsubscribe();
        }
      }
    );
  }
  verPagos = (): void => {
    if (this.cuadre.bombero == '' && this.cuadre.id_bombero == 0) {
      this.popupProviderService.SimpleMessage('Cuadres', 'Debe seleccionar el bombero y recalcular', PopupType.WARNING);
      return;
    }
    this.MODAL_PAGOS = this.dialogService.addDialog(PagosPorBomberoCuadreModalComponent, {
      pagosRecibidos: this.cuadre.pagos, bomberoRecibido: this.cuadre.bombero,
      readOnly_recibido: false,
      startDateRecibido: this.fecha_final_turno.substring(0, 4)
        + this.fecha_final_turno.substring(5, 7) +
        this.fecha_final_turno.substring(8, 10),
      startTimeRecibido: this.fecha_final_turno.substring(11, 13)
        + this.fecha_final_turno.substring(14, 16) + this.fecha_final_turno.substring(17, 19),
      cuadre: this.cuadre
    }).subscribe(
      result => {
        if (result == 'close') {
          this.MODAL_PAGOS.unsubscribe();
        }
      }
    );
  }
  verVentas = (): void => {

    this.MODAL_VENTAS_CUADRE_BOMBERO = this.dialogService.addDialog(VentasPorBomberoCuadreModalComponent, {
      ventasRecibidas: this.cuadre.ventas,
      cuadreRecibido: this.cuadre
    }).subscribe(
      result => {
        if (result == 'close') {
          this.MODAL_VENTAS_CUADRE_BOMBERO.unsubscribe();
        }
      }
    );
  }

  validateModel = (): boolean => {
    return this.cuadre.bombero != '' && this.cuadre.id_bombero != 0
      && this.cuadre.Lados != '' && this.cuadre.turno != 0;
  }
  imprimir = (): void => {
    this.printer.openNewTab(`WebForms/CuadreBombero.aspx?id=${this.cuadre.id}`, 'Cuadre');
  }
  validarCuadre = (): void => {
    this.autenticadorFirmantesService.requestFirmanteAutentication(this.responseAuth.Response.validar_cuadre,
      'No tiene permisos para validar Cuadre', 'Cuadres', () => {
        this.popupProviderService.QuestionMessage('Validando cuadre',
          'Está seguro que desea guardar la validación del cuadre (sobreescribirá cualquier validación existente)?',
          PopupType.WARNING, 'SI!', 'NO!',
          () => {
            this.cuadre.total_efectivo_registrado_admin = this.calcularEfectivoRegistradoAdmin();
            const cuadreValidationModel: CuadreValidacionModel =
              new CuadreValidacionModel(Number(this.responseAuth.Response.usuarios), this.cuadre);

            this.cuadresService.saveCuadreValidacion(cuadreValidationModel).then(
              result => {
                if (result.Success) {
                  this.popupProviderService.SimpleMessage('Cuadre de bomberos', 'Cuadre validado', PopupType.SUCCESS);
                  this.limpiar();
                  this.router.navigate(['consultar_cuadres']);
                } else {
                  if (result.PossibleError !== '') {
                    this.popupProviderService.SimpleMessage('Cuadre de bomberos', 'Cuidado:' + result.Response,
                      PopupType.WARNING);
                  } else {
                    this.popupProviderService.SimpleMessage('Cuadre de bomberos', `Fallo al validar el cuadre (${result.Response})`,
                      PopupType.ERROR);
                  }
                }
              }).catch(
                error => {
                  this.popupProviderService.SimpleMessage('Cuadre turno', error, PopupType.ERROR);
                });
          },
          () => { });
      }, { permisoRecibido: "validar_cuadre" });

  }
  onBomberoChanged = (): void => {
    if (this.creando) {
      this.validateCuadre();
    }
  }

  public validateCuadre(): boolean {
    this.cuadresService.validarCuadre(this.turno, this.bomberoSelected)
      .then((data) => {
        if (data === true) {
          this.popupProviderService.SimpleMessage('Validacion cuadre', 'Ya ese bombero cuadro ese turno',
            PopupType.WARNING);
          this.bomberoSelected = 0;
          return true;
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Validacion cuadre', error, PopupType.ERROR);
        return true;
      });

    return false;
  }

  proccessResultSuccess = (imprimir: string, result: GenericResponse<Cuadre>, saving: boolean): void => {
    if (result.Success) {
      this.popupProviderService.SimpleMessage('Cuadre de bomberos', `Cuadre ${saving ? 'registrad' : 'editado'}`, PopupType.SUCCESS);
      if (imprimir === 'SI') {
        if (this.responseAuth.Response.is_bombero) {
          this.printer.openNewTab(`WebForms/CuadreBomberoByBombero.aspx?id=${result.Response.id}`, 'Cuadre por un bombero');
        }
        else {
          this.printer.openNewTab(`WebForms/CuadreBombero.aspx?id=${result.Response.id}`, 'Cuadre');
        }

      }
      this.limpiar();
      this.router.navigate(['consultar_cuadres']);
    } else {
      if (result.PossibleError !== '') {
        this.popupProviderService.SimpleMessage('Cuadre de bomberos', result.PossibleError, PopupType.WARNING);
      } else {
        this.popupProviderService.SimpleMessage
          ('Cuadre de bomberos', `Fallo al ${saving ? 'guardar' : 'editar'} el cuadre (${result.PossibleError})`,
            PopupType.ERROR);
      }
    }
  }
  guardar = (imprimir: string): void => {
    this.RecalcularCuadre()
      .then(() => {
        this.CuadreDataPost = new CuadreDataPost(this.cuadre);
        if (!this.editingCuadre) {
          this.cuadresService.saveCuadre(this.CuadreDataPost, this.responseAuth.Response.id_usuario).then(
            result => {
              this.proccessResultSuccess(imprimir, result, true);
            }).catch(
              error => {
                this.popupProviderService.SimpleMessage('Cuadre turno', error, PopupType.ERROR);
              }
            );
        } else {
          this.cuadresService.editCuadre(this.cuadre, this.responseAuth.Response.id_usuario).then(
            result => {
              this.proccessResultSuccess(imprimir, result, false);
            }).catch(
              error => {
                this.popupProviderService.SimpleMessage('Cuadre turno', error, PopupType.ERROR);
              }
            );
        }
      });
  }
  limpiar = () => {
    const denos: Denominaciones[] = [];
    this.denominaciones.forEach(element => {
      denos.push(new Denominaciones(element, 0));
    });
    const i: Array<string> = [];
    const c: Array<CampoDinamico> = [];
    const v: Array<Sale> = [];
    const p: Array<Pago> = [];
    const d: Array<Deposito> = [];
    this.cuadre = new Cuadre(false, '', ['', '', '', '', '', '', '', '', '', '', '', '', '', ''], '', this.turno, 0, 0, 0,
      denos, 0, 0, 0, 0, '', 0, '', i, c, '', denos, 0, v, p, 0, 0, 0, 0, 0, d, 0, 0);
    this.CuadreDataPost = new CuadreDataPost(this.cuadre);
  }
  cargarBomberosByTurno = (turno: number): Promise<ModelList<Bombero>> => {
    return this.bomberoService.getBomberosByTurno(turno);
  }
  cargarBomberosTodos = (): Promise<ModelList<Bombero>> => {
    return this.bomberoService.getBomberos('AND activo = true');
  }
  cancelarCuadre = () => {
    this.router.navigate(['/cuadre']);
  }
  cargarHorasByTurnoYLado = (turno: number, lados: string): void => {
    this.turnosService.getInfoTurno(turno, lados).then(
      result => {
        if (result.Success) {
          this.fecha_inicial_turno = result.Response[0] + ' ' + result.Response[1];
          this.fecha_final_turno = result.Response[2] + ' ' + result.Response[3];
        } else {
          this.popupProviderService.SimpleMessage('Ocurrió un error al cargar la informacion del turno, Puede seguir el cuadre normalmente',
            result.PossibleError, PopupType.WARNING);
        }
      }
    );
  }

  vistaEdicion = () => {
    if (this.editingCuadre) {
      this.readOnly = true;
      this.editingCuadre = false;
      this.textoEdit = 'Editar';
    } else {
      this.readOnly = false;
      this.editingCuadre = true;
      this.textoEdit = 'Cancelar Edición';
    }
  }
  checkDataAvaibility = (): void => {
    this.cuadresService.checkDataAvailability(this.turno, this.cuadre.LadosByBombero[0])
      .then(result => {
        if (result.Success) {
          this.basedNotAvailable = result.Response.basedNotAvailable;
          this.calculatedNotAvailable = result.Response.calculatedNotAvailable;
        } else {
          let minutes = 5;
          this.popupProviderService.SimpleMessage('Cuadrar turno',
            result.PossibleError,
            PopupType.INFO, () => {
              this.router.navigate(['cuadre']);
            });
        }
      })
      .catch(error => {
        this.popupProviderService.SimpleMessage('Cuadres', `Error obteniendo el tipo de calculo del cuadre(${error})`,
          PopupType.ERROR);
      });
  }
  cargarBomberosGeneral = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.cargarBomberosByTurno(this.turno).then(
        result => {
          if (result.PossibleError === '') {
            if (result.List.length === 0) {
              this.cargarBomberosTodos().then(anotherResult => {
                if (anotherResult.PossibleError === '') {
                  this.bomberos = anotherResult.List;
                  resolve();
                }
              }).then(error => {
                reject(error);
              });
            } else {
              this.bomberos = result.List;
              resolve();
            }
          } else {
            reject(result.PossibleError);
          }
        }).catch(error => {
          reject(error);
        });
    });
  }

  ngOnInit() {
    this.getCoinRates();

    this.route.params.subscribe(params => {
      this.turno = +params['turno'];
      this.cargarBomberosGeneral().then(() => {
        if (params['id_cuadre'] && params['id_cuadre'] != null && params['id_cuadre'] != '' && params['id_cuadre'] != '0' && params['lados'] != '') {
          this.readOnly = true;
          this.creando = false;
          this.cuadresService.getSingleCuadre(params['id_cuadre']).then(
            result => {
              if (result.Success) {
                this.cargarHorasByTurnoYLado(result.Response.turno, result.Response.Lados);
                this.fechaActual = result.Response.fecha;
                this.turno = result.Response.turno;
                this.cuadre = result.Response;

                this.calculateDollarDOPAmount();
                this.calculateEuroDOPAmount();

                //this.cuadre.Lados = result.Response.Lados;
                this.CuadreDataPost.cuadre_initially_loaded = { ...this.cuadre };
                this.CuadreDataPost.cuadre = this.cuadre;

                this.bomberoSelected = this.cuadre.id_bombero;

                if (this.cuadre.cuadre_validado) {
                  this.cuadreValidado = true;
                }
                this.checkDataAvaibility();
              } else {
                this.popupProviderService.SimpleMessage('Cuadre', `Ocurrió un error al obtener el cuadre (${result.PossibleError})`,
                  PopupType.WARNING);
              }
            }
          ).catch(error => {
            this.popupProviderService.SimpleMessage('Cuadre turno', error, PopupType.ERROR);
          });
        } else {
          this.creando = true;
          this.checkDataAvaibility();
          this.cuadre.turno = this.turno;
          if (params['bombero'] && params['bombero'] != null && params['bombero'] != '') {
            this.cuadre.bombero = params['bombero'];
            const bombero = this.bomberos.find((x) => {
              return x.name === params['bombero'];
            });
            this.cuadre.id_bombero = bombero.id;
            this.bomberoSelected = bombero.id;
            this.cuadre.Lados = params['lados'];

            this.validateCuadre();

            this.RecalcularCuadre();
          }
        }
      }, error => console.log(error));
    });
  }
}



