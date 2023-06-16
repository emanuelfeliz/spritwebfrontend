import { IPresetConfig } from 'app/models/smart_console_models/IPresetConfig';
import { IResponse } from './../../../models/GenericResponse.model';
import { PopupProviderService, PopupType } from './../../../services/popupProvider.service';
import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import { PumpTabletData } from '../../../models/pump-tablet/pump_tablet_data.model';
import { PumptabletService } from '../../../services/pumptablet.service';
import { UsuarioAutenticado } from '../../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { ResumenLado } from '../../../models/pump-tablet/resumen_lado.model';
import { GenericResponse, IResponseWithList } from '../../../models/GenericResponse.model';
import { PrintServiceService } from 'app/services/print-service.service';
import { AutenticadorFirmantesService } from 'app/services/autenticador-firmantes.service';
import { Lado } from '../../../models/pump-tablet/lado.model';
import { AutenticadorBomberosService } from '../../../services/autenticador-bomberos.service';
import { AperturaTurnoBombero } from '../../../models/apertura_turno/apertura_turno_bombero.model';
import { DetallePorLado } from '../../../models/apertura_turno/DetallePorLado.model';
import { AperturaTurnosService } from '../../../services/apertura_turno.service';
import { ReporteRecibido } from '../../../models/ReportesGenerator/ReporteRecibido.model';
import { LadoPT } from '../../../models/pump-tablet/lado-pt.model';
import { HelperServiceService } from '../../../services/helper-service.service';
import { PumpPumpTabletComponent } from '../pumptablet/components/pump-pump-tablet/pump-pump-tablet.component';
import { HttpService } from 'app/services/communication_services/http.service';
import { IPumpAction, IPump, IHose, IGrade } from 'app/models/smart_console_models/IPump';
import { SignalRService } from 'app/services/communication_services/signal-r.service';
import { ISale } from 'app/models/smart_console_models/ISale';

declare var $;
@Component({
  selector: 'app-new-pumptablet',
  templateUrl: './new_pumptablet.component.html',
  styleUrls: ['./new_pumptablet.component.css']
})

export class NewPumpTabletComponent implements OnInit, AfterViewInit, OnDestroy {
  DispensadoresInfo: {
    list: Array<number>,
    showLoading: boolean,
    total: number
  };
  authData: {
    responseAuth: GenericResponse<UsuarioAutenticado>
  };

  dispenserSelected = 1;
  PumpTabletDataSelected: PumpTabletData;
  LA: number;
  LB: number;
  FCA: string;
  FCB: string;
  TAA: number;
  TAB: number;
  loading: boolean;
  connectedToHub = false;
  ResumenesLados: Array<ResumenLado> = [];
  aperturaTurnoBomberosActivos: AperturaTurnoBombero[] = [];
  @ViewChildren(PumpPumpTabletComponent) components: QueryList<PumpPumpTabletComponent>;
  ladosSeleccionados: Array<LadoPT> = [{ lado: 1, status: '', selected: false, turno: 0 }];
  _ladosSeleccionados: Array<LadoPT> = [];
  bombero: AperturaTurnoBombero;
  pumpSales: Array<ISale> = [];
  presetToSend: string = '0';
  sendConfigPrice: boolean = false;
  saleType: number = 1;
  private checkAll: boolean = false;
  pumpNo: number = 1;
  pump: IPump = { priceLevel: 0, hoses: [], isAuthored: false, pumpNo: 0, salePrice: 0, saleProgress: 0, status: '', volume: 0, grade: { id: 0, green: 0, blue: 0, description: '', rbg: '', red: 0, prices: [] } };
  selectedPump: LadoPT;

  public pumps: Array<IPump> = [
    { priceLevel: 0, pumpNo: 1, saleProgress: 0, status: 'OFFLINE', salePrice: 0, volume: 0, grade: { id: 0, blue: 0, green: 0, red: 0, rbg: '', description: '', prices: [] }, isAuthored: false, hoses: [] },
    { priceLevel: 0, pumpNo: 2, saleProgress: 0, status: 'OFFLINE', salePrice: 0, volume: 0, grade: { id: 0, blue: 0, green: 0, red: 0, rbg: '', description: '', prices: [] }, isAuthored: false, hoses: [] }
  ];

  //TODO: Create btn interface...
  public btnActionAndText = [
    { action: 'OPEN', text: 'Abrir', privilege: 'open_close_pump' },
    { action: 'CLOSE', text: 'Cerrar', privilege: 'open_close_pump' },
    { action: 'AUTH', text: 'Autorizar', privilege: 'auth_deauth_pump' },
    { action: 'DEAUTH', text: 'Desatorizar', privilege: 'auth_deauth_pump' },
  ];

  public btns = [
    { action: 'OPEN', text: 'Abrir', privilege: 'open_close_pump' },
    { action: 'DEAUTH', text: 'Desautorizar', privilege: 'auth_deauth_pump' },
  ];

  private preset_grades: IGrade[] = [];

  constructor(private helperServiceService: HelperServiceService, private pumptabletService: PumptabletService,
    private router: Router, private printer: PrintServiceService, private autenticadorFirmantesService: AutenticadorFirmantesService,
    private popupProviderService: PopupProviderService, private AutenticadorBomberosService: AutenticadorBomberosService,
    private AperturaTurnosService: AperturaTurnosService, public signalRService: SignalRService, private _ngZone: NgZone, private httpService: HttpService) {

    this.authData = {
      responseAuth: null
    };
    this.helperServiceService.loadAuthInfo(this.authData, 'pumptablet', () => {
      this.DispensadoresInfo = {
        list: [],
        showLoading: false,
        total: 0
      };
    });
    this.ladosSeleccionados = [];
  }

  ngAfterViewInit(): void {
  }

  getLados = (origin: LadoPT[]): string => {
    let result: string = '';
    const result_sorted = origin.sort((a, b) => a.lado - b.lado);
    result_sorted.forEach(element => {
      result += (result !== '' ? ',' : '') + element['lado'];
    });
    return result;
  }

  GenerarDetallesPorLado = (LadosString: string): Array<DetallePorLado> => {
    let Detalles: Array<DetallePorLado> = [];
    this.ladosSeleccionados.forEach(element => {
      Detalles.push(new DetallePorLado(element['lado'], element['turno']));
    });
    return Detalles;
  }
  imprimirApertura = (aperturaTurno: AperturaTurnoBombero) => {
    this.printer.generateReporte(new ReporteRecibido('Reporte de Apertura', '~/Reportes/AperturaTurnos/rptAperturaTurno.rpt',
      'apertura_turno', false, null, null, JSON.stringify(aperturaTurno)), false);
  }

  imprimirCierreLados = (cierreDispensador: AperturaTurnoBombero) => {
    this.printer.generateReporte(new ReporteRecibido('Reporte de Cierre de lados', '~/Reportes/CierreLados/rptCierreLados.rpt',
      'cierre_lados', false, null, null, JSON.stringify(cierreDispensador)), false);
  }

  aperturarLadosSeleccionados = () => {
    let canOpen = true;
    this.ladosSeleccionados.forEach((x: LadoPT) => {
      if (x.status === 'A') {
        canOpen = false;
      }
    });
    if (!canOpen) {
      this.popupProviderService.SimpleMessage('No se puede aperturar', `Ha seleccionado lados que ya estan aperturados`, PopupType.WARNING);
      return;
    }
    const ladosPorComa: string = this.getLados(this.ladosSeleccionados);
    this.popupProviderService.QuestionMessage('Aperturar lados seleccionados',
      `Esta seguro de aperturar los lados (${ladosPorComa})?`, PopupType.QUESTION, 'Si', 'No', () => {
        this.AutenticadorBomberosService.requestBomberoAutentication('Aperturar lados seleccionados', (result) => {
          this.popupProviderService.QuestionMessage(`Bombero identificado ${result.bombero.bombero}`,
            'Desea continuar con la apertura?', PopupType.QUESTION, 'Si', 'No', () => {
              this.loading = true;
              const details: Array<DetallePorLado> = [];
              const apertura: AperturaTurnoBombero =
                new AperturaTurnoBombero(0, '', '', '', '', '', '', '', 'S', 0, '', 0, '', '', details);
              apertura.lados = ladosPorComa;
              apertura.lados_activos = ladosPorComa;
              apertura.detalles_por_lado = this.GenerarDetallesPorLado(apertura.lados);
              apertura.bombero = result.bombero.bombero;
              apertura.id_bombero = result.bombero.id_bombero;

              this.checkIfHaveOtherTurnOpen(apertura.id_bombero, apertura.bombero, () => {
                this.AperturaTurnosService.RegistrarApertura(apertura)
                  .then(resultRegistroApertura => {
                    if (resultRegistroApertura.Success) {
                      this.imprimirApertura(resultRegistroApertura.Response);
                      this.popupProviderService.SimpleMessage
                        ('Aperturando lados seleccionados', 'Lados seleccionados aperturados exitosamente', PopupType.SUCCESS);
                    } else {
                      this.popupProviderService.SimpleMessage
                        ('Aperturando lados seleccionados', resultRegistroApertura.PossibleError, PopupType.WARNING);
                    }
                    this.loading = false;

                    this.changeDispenser();
                    this.cargarResumenesLados();
                    this.ladosSeleccionados = [];
                  })
                  .catch(error => {
                    this.loading = false;
                    this.popupProviderService.SimpleMessage
                      ('Aperturando lados seleccionados', `No se pudieron aperturar los lados seleccionados (${error})`, PopupType.ERROR);
                    this.ladosSeleccionados = [];

                  });
              });
            }, () => {

            });
        }, () => { }, { idBombero: 0 });
      }, () => { });

    this.getAperturaTurnosActivos();
  }
  cerrarLadosSeleccionados = () => {
    const ladosPorComa: string = this.getLados(this.ladosSeleccionados);
    this.popupProviderService.QuestionMessage('Cerrar lados seleccionados',
      `Esta seguro de cerrar los lados (${ladosPorComa})?`, PopupType.QUESTION, 'Si', 'No', () => {
        this.loading = true;
        const lados: Array<Lado> = [];
        this.ladosSeleccionados.forEach(element => {
          lados.push(new Lado(element['lado'], element['turno']));
        });
        this.pumptabletService.CerrarConjuntoLados(lados)
          .then(result => {
            this.loading = false;
            this.ladosSeleccionados = [];
            if (result.Success) {
              this.popupProviderService.SimpleMessage('Cerrando lados seleccionados',
                'Lados seleccionados cerrados exitosamente', PopupType.SUCCESS);
              this.OnCerrarLadoSuccess(0, 0).then(() => {
                const pumpsToClose: Array<Lado> = [];
                lados.forEach(element => {
                  pumpsToClose.push(new Lado(element.lado, element.turno + 1));
                });
                this.imprimirCierreLados(this.bombero);

                this.abrirAperturasAutomaticas(pumpsToClose);
              });


            } else {
              this.popupProviderService.SimpleMessage('Cerrando lados seleccionados',
                `No se pudieron los lados seleccionados <br>${result.PossibleError}`, PopupType.ERROR);
            }
          })
          .catch(error => {
            this.loading = false;
            this.popupProviderService.SimpleMessage('Cerrando lados seleccionados',
              'No se pudieron cerrar los lados seleccionados', PopupType.ERROR);
            this.ladosSeleccionados = [];
          });
      }, () => { });
  }

  toggleSeleccionTodos = (): void => {
    this.checkAll = !this.checkAll;
    this.checkboxsToggle(this.checkAll);
  }

  checkboxsToggle(checked: boolean) {
    console.log(this.components);
    this.components.forEach((child) => {
      setTimeout(() => child.setCheckStatus(checked), 100);
    });
  }

  checkPumpBoxToggle(pumpNo: number, checked: boolean) {
    this.components.forEach((child) => {
      if (child.ResumenLado.Lado === pumpNo) {
        child.setCheckStatus(checked);
      }
    });
  }

  selectCheckByPump = (data: LadoPT) => {
    if (data['selected'] == true) {
      this.selectedPump = data;
      this.setPumpBtns(data.lado);
      this.getPumpSales(data.lado);
      this.pump = this.pumps.find(pump => pump.pumpNo === data.lado);
      this.ladosSeleccionados.push(data);
    } else {
      this.pump = { priceLevel: 0, hoses: [], isAuthored: false, pumpNo: 0, salePrice: 0, saleProgress: 0, status: '', volume: 0, grade: { id: 0, green: 0, blue: 0, description: '', rbg: '', red: 0, prices: [] } };
      this.pumpSales = [];
      this.removeSelectedPump(data['lado']);
    }
  }

  removeSelectedPump(pumpNo: number): void {
    this.checkPumpBoxToggle(pumpNo, false);
    this.selectedPump['selected'] = false;
    this.ladosSeleccionados.splice(this.ladosSeleccionados.findIndex(x => x.lado == pumpNo), 1);

  }

  cargarResumenesLados = () => {
    this.loading = true;
    this.pumptabletService.getResumenesLados().
      then(result => {
        this.ResumenesLados = result.List;
        this.UpdatePumpResumenLados();
        this.loading = false;
      }).catch(error => {
        this.popupProviderService.SimpleMessage("Cerrando Dìa",
          "Error obteniendo los resumenes de lados " + error,
          PopupType.ERROR);
        this.loading = false;
      })
  }
  CerrarDia = () => {
    this.autenticadorFirmantesService.requestFirmanteAutentication(this.authData.responseAuth.Response.cerrar_dia,
      "No tiene permisos para cerrar día", "Pumptablet", () => {
        this.popupProviderService.QuestionMessage("Cerrando Día", "Está seguro de cerrar el día", PopupType.QUESTION,
          "Si", "NO", () => {
            this.pumptabletService.CerrarDia()
              .then(
                result => {
                  if (result.Success) {
                    this.popupProviderService.SimpleMessage("Cerrando Día",
                      "El día fue cerrado",
                      PopupType.SUCCESS);
                  } else {
                    this.popupProviderService.SimpleMessage("Cerrando Día",
                      `Ocurrió un error al cerrar el día (${result.Response})`,
                      PopupType.WARNING);
                  }
                }
              );
          }, () => {
            this.popupProviderService.SimpleMessage("Aviso", "La operación fue cancelada", PopupType.WARNING);
          });
      }, { permisoRecibido: "cerrar_dia" });
  }
  CerrarDispensador = () => {
    this.autenticadorFirmantesService.requestFirmanteAutentication(this.authData.responseAuth.Response.cerrar_por_dispensador,
      "No tiene permisos de cerrar por dispensador", "Pumptablet", () => {
        this.popupProviderService.QuestionMessage("Cerrando Dispensador", "Está seguro de cerrar el dispensador", PopupType.QUESTION,
          "Si", "NO", () => {
            this.pumptabletService.closeDispenser(this.LA, this.TAA, this.LB, this.TAB)
              .then(
                result => {
                  if (result.Success) {
                    this.changeDispenser();
                    this.printer.openNewTab(`WebForms/CierreDispensador.aspx?turno=${this.TAA}&turno2=${this.TAB}&lado=${this.LA}&lado2=${this.LB}&dispensador=${this.dispenserSelected}`, 'Cierre Dispensador');
                    this.pumptabletService.InactiveAperturaTurno()
                      .then(response => {

                      })
                      .catch(error => {
                        this.popupProviderService.SimpleMessage('Desactivando apertura', 'Ocurrio un error desactivando apertura', PopupType.ERROR);
                      });
                    this.cargarResumenesLados();
                    let lados: Array<Lado> = [];
                    lados.push(new Lado(this.LA, this.TAA + 1));
                    lados.push(new Lado(this.LB, this.TAB + 1));
                    this.abrirAperturasAutomaticas(lados);
                    this.popupProviderService.SimpleMessage("Cerrando Dispensador", `Dispensador ${this.dispenserSelected} cerrado`, PopupType.SUCCESS);
                  } else {
                    this.popupProviderService.SimpleMessage("Cerrando Dispensador", `No se pudo cerrar el dispensador <br>${result.Response}`, PopupType.ERROR);
                  }
                }
              );
          }, () => {
            this.popupProviderService.SimpleMessage("Aviso", "La operación fue candelada", PopupType.WARNING);
          });
      }, { permisoRecibido: "cerrar_por_dispensador" });
  }
  OnCerrarLadoSuccess = (turnoACerrar: number, ladoACerrar: number, print: boolean = false): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (print) {
        this.printer.openNewTab(`WebForms/TicketPumpTablet.aspx?turno=${turnoACerrar}&lado=${ladoACerrar}`, 'Cierre de Lado');
      }

      this.changeDispenser();
      this.cargarResumenesLados();
      this.pumptabletService.InactiveAperturaTurno()
        .then(response => {
          resolve();
          this.getAperturaTurnosActivos();
        })
        .catch(error => {
          this.popupProviderService.SimpleMessage('Desactivando apertura', 'Ocurrio un error desactivando apertura', PopupType.ERROR);
          resolve();
        });
    });
  }

  abrirAperturasAutomaticas = (lados: Array<Lado>): void => {
    if (this.authData.responseAuth.Response.func_abrir_cerrar_seleccionados) {
      this.pumptabletService.abrirAperturaBomberoMaestro(lados)
        .then(response => {
          if (response.Success) {
            if (response.PossibleError !== '') {
              this.popupProviderService.SimpleMessage('Pumptablet',
                response.PossibleError, PopupType.SUCCESS);
            } else {
              this.popupProviderService.SimpleMessage('Pumptablet',
                'Lados cerrados y Aperturas realizadas automáticamente', PopupType.SUCCESS);
            }
            this.changeDispenser();
            this.cargarResumenesLados();
          } else {
            this.popupProviderService.SimpleMessage('Pumptablet', response.PossibleError, PopupType.WARNING);
          }
        })
        .catch(error => {
          this.popupProviderService.SimpleMessage('Pumptablet', error, PopupType.ERROR);
        });
    }

    this.getAperturaTurnosActivos();
  }
  CerrarLado = (ladoStructure) => {
    this.autenticadorFirmantesService.requestFirmanteAutentication(this.authData.responseAuth.Response.cerrar_por_lado,
      "No tiene permisos de cerrar por lado", "Pumptablet", () => {

        this.popupProviderService.QuestionMessage('Cerrando Lado',
          `Está seguro de cerrar el lado ${ladoStructure.lado} del dispensador ${this.dispenserSelected}`, PopupType.QUESTION,
          "Si", "NO", () => {
            let ladoACerrar: number;
            let turnoACerrar: number;
            if (ladoStructure.type == "A") {
              ladoACerrar = this.LA;
              turnoACerrar = this.TAA;
            } else if (ladoStructure.type == "B") {
              ladoACerrar = this.LB;
              turnoACerrar = this.TAB;
            }
            this.pumptabletService.closePump(ladoACerrar, turnoACerrar, ladoStructure.ignorarC)
              .then(
                result => {
                  if (result.Success) {
                    this.popupProviderService.SimpleMessage("Cerrando Lado",
                      `El Lado ${ladoACerrar} fue cerrado`,
                      PopupType.SUCCESS);

                    this.OnCerrarLadoSuccess(turnoACerrar, ladoACerrar, true)
                      .then(() => {
                        const lados: Array<Lado> = [];
                        lados.push(new Lado(ladoACerrar, turnoACerrar + 1));
                        this.abrirAperturasAutomaticas(lados);
                      });
                  } else {
                    if (result.Response == "No_ventas") {
                      this.popupProviderService.QuestionMessage('Cerrando Lado',
                        `El Lado ${ladoACerrar} no tiene ventas, desea cerrarlo de todas formas?`, PopupType.WARNING,
                        'SI!', 'NO!',
                        () => {
                          this.pumptabletService.closePump(ladoACerrar, turnoACerrar, true)
                            .then(
                              result => {
                                if (result.Success) {
                                  this.popupProviderService.SimpleMessage("Cerrando Lado",
                                    `El Lado ${ladoACerrar} fue cerrado SIN VENTAS`,
                                    PopupType.SUCCESS);
                                  this.OnCerrarLadoSuccess(turnoACerrar, ladoACerrar, true).then(() => {
                                    const lados: Array<Lado> = [];
                                    lados.push(new Lado(ladoACerrar, turnoACerrar + 1));
                                    this.abrirAperturasAutomaticas(lados);
                                  });
                                } else {
                                  this.popupProviderService.SimpleMessage("Cerrando Lado",
                                    result.Response,
                                    PopupType.ERROR);
                                }
                              }
                            );
                        },
                        () => {
                          this.popupProviderService.SimpleMessage("Aviso",
                            "La operación fue candelada",
                            PopupType.WARNING);
                        });

                    } else {
                      this.popupProviderService.SimpleMessage("Cerrando Lado",
                        result.Response,
                        PopupType.ERROR);
                    }
                  }
                }
              );

          }, () => {
            this.popupProviderService.SimpleMessage("Aviso", "La operación fue candelada", PopupType.WARNING);
          });
      }, { permisoRecibido: "cerrar_por_lado" });
  }
  changeDispenser = () => {
    this.loading = true;

    // this.LA = Number(this.dispenserSelected * 2) - 1;
    // this.LB = Number(this.dispenserSelected * 2);
    // this.pumptabletService.getPumpTabletData(this.LA, this.LB)

    this.pumptabletService.getPumpTabletDataByDispenser(this.dispenserSelected)
      .then(
        result => {

          this.LA = Number(result.Lado1.List[0]["pump"]);
          this.LB = Number(result.Lado2.List[0]["pump"]);
          this.loading = false;
          this.PumpTabletDataSelected = result;
          if (this.PumpTabletDataSelected.Lado1.List.length > 0) {
            this.FCA = `${this.PumpTabletDataSelected.Lado1.List[0]["endDate"]} ${this.PumpTabletDataSelected.Lado1.List[0]["endTime"]}`;
            this.TAA = this.PumpTabletDataSelected.Lado1.List[0]["turno_actual"];
          }
          if (this.PumpTabletDataSelected.Lado2.List.length > 0) {
            this.FCB = `${this.PumpTabletDataSelected.Lado2.List[0]["endDate"]} ${this.PumpTabletDataSelected.Lado2.List[0]["endTime"]}`;
            this.TAB = this.PumpTabletDataSelected.Lado2.List[0]["turno_actual"];
          }
        }
      )
      .catch(error => {
        this.popupProviderService.SimpleMessage('Cambio dispensador',
          'Ocurrio un error obteniendo data de un dispensador', PopupType.ERROR);
        this.loading = false;
      });
  }
  getDispensers = () => {
    this.helperServiceService.loadModelList(this.DispensadoresInfo, this.pumptabletService.getDispensers())
      .catch(err => this.popupProviderService.SimpleMessage("Error", `Error obteniendo los dispensadores ${err}`, PopupType.ERROR));
  }
  ngOnInit() {
    this.signalRService.init();

    this.signalRService.pumps.subscribe((_pumps: Array<IPump>) => {
      this._ngZone.run(() => {
        this.pumps = _pumps;
        this.UpdatePumpResumenLados();
        console.log(_pumps);
        console.log('Updated pumps');
      });
    }, error => {
      console.log(error);
    });

    this.signalRService.pumpsSales.subscribe((_sales: Array<Array<ISale>>) => {
      this._ngZone.run(() => {
        this.pumpSales = _sales[this.pump.pumpNo];
      });
    }, error => {
      console.log(error);
    });

    this.getAperturaTurnosActivos();
    this.getDispensers();
    this.changeDispenser();
    this.cargarResumenesLados();
  }

  closePump(ladoStructure): void {

    this.authBombero(() => {
      this.validateCloseHour(() => {
        this.CerrarLado(ladoStructure)
      }, () => {

        console.log(this.authData.responseAuth.Response.is_bombero);
        this.popupProviderService.SimpleMessage('PumpTablet', 'La hora de cerrar no ha llegado, Autentiquese con permiso firmante', PopupType.ERROR);
        console.log(this.authData.responseAuth.Response.is_bombero);
        if (this.authData.responseAuth.Response.is_bombero) { this.CerrarLado(ladoStructure); return; }

        this.autenticadorFirmantesService.requestFirmanteAutentication(this.authData.responseAuth.Response.permiso_firmante,
          "No tiene permisos de cerrar por lado", "Pumptablet", () => {
            this.CerrarLado(ladoStructure);

          }, { permisoRecibido: "cerrar_por_lado" });
      });
    }, () => { });
  }

  closeDay(): void {
    this.validateCloseHour(() => {
      this.CerrarDia();
    }, () => {
      this.popupProviderService.SimpleMessage('PumpTablet', 'La hora de cerrar no ha llegado, Autentiquese con permiso firmante', PopupType.ERROR);
      console.log(this.authData.responseAuth.Response.is_bombero);
      if (!this.authData.responseAuth.Response.is_bombero) { this.CerrarDia(); return; }
      this.autenticadorFirmantesService.requestFirmanteAutentication(this.authData.responseAuth.Response.permiso_firmante,
        "No tiene permisos de cerrar por lado", "Pumptablet", () => {
          this.CerrarDia();
        }, { permisoRecibido: "cerrar_por_lado" });
    });
  }

  authBombero(success: () => void, errorCallback: () => void): void {
    //TODO: Refactor this...
    this.getAperturaTurnosActivos();
    const ladosPorComa: string = this.getLados(this.ladosSeleccionados);

    if (this.authData.responseAuth.Response.close_any_pump === true) {
      const bombero = this.aperturaTurnoBomberosActivos[0];
      bombero.detalles_por_lado = [];

      this.ladosSeleccionados.forEach(dt => {
        bombero.detalles_por_lado.push(new DetallePorLado(dt.lado, dt.turno));
      });

      bombero.lados = ladosPorComa;
      this.bombero = bombero;
      success();
      return;
    }

    if (this.authData.responseAuth.Response.autenticar_cierre_turno === false) {

      const bombero = this.aperturaTurnoBomberosActivos.find(x => {
        const havePumps = x.lados_activos.search(ladosPorComa)
        if (havePumps > -1) {
          return true;
        }
      });

      if (bombero === undefined || bombero === null) {
        this.popupProviderService.SimpleMessage('PumpTablet', 'No eres el bombero que aperturo el turno', PopupType.ERROR);
        return;
      }
      bombero.detalles_por_lado = [];

      this.ladosSeleccionados.forEach(dt => {
        bombero.detalles_por_lado.push(new DetallePorLado(dt.lado, dt.turno));
      });

      this.bombero = bombero;
      success();
      return;
    }

    this.popupProviderService.QuestionMessage('Cerrar lados seleccionados',
      `Estas seguro de cerrar los lados (${ladosPorComa})?`, PopupType.QUESTION, 'Si', 'No', () => {

        this.AutenticadorBomberosService.requestBomberoAutentication('Cerrar lados seleccionados', (result) => {

          let bombero: AperturaTurnoBombero = null;
          let pumpsToClose = "";

          this.aperturaTurnoBomberosActivos.forEach(x => {
            if (x.bombero.toLowerCase() === result.bombero.bombero.toLowerCase()) {
              pumpsToClose = `${pumpsToClose},${x.lados_activos}`;
              bombero = x;
            }
          });

          let pumps_validated = [];

          if (!this.authData.responseAuth.Response.debe_cerrar_todos_lados) {
            this.ladosSeleccionados.forEach(x => {
              const result = pumpsToClose.search(x.lado.toString());
              if (result > -1) {
                pumps_validated.push(true);
              } else {
                pumps_validated.push(false);
              }
            })
          }

          else {
            const result = ladosPorComa.search(bombero.lados_activos);
            if (result > -1) {
              pumps_validated.push(true);
            } else {
              pumps_validated.push(false);
            }
          }

          const validation = pumps_validated.every(x => x === true);
          if (validation === true) {
            bombero.detalles_por_lado = [];

            this.ladosSeleccionados.forEach(dt => {
              bombero.detalles_por_lado.push(new DetallePorLado(dt.lado, dt.turno));
            });
          }

          if (validation === false) {
            this.popupProviderService.SimpleMessage('PumpTablet', 'No eres el bombero que aperturo el turno', PopupType.ERROR);
            return;
          }

          this.popupProviderService.QuestionMessage(`Bombero identificado ${result.bombero.bombero}`,
            'Desea cerrar los lados?', PopupType.QUESTION, 'Si', 'No', () => {
              this.bombero = bombero;
              success();
            }, () => {
              errorCallback();
            });
        }, () => { }, { idBombero: 0 });
      }, () => { });
  }

  closeDispenser(): void {
    this.validateCloseHour(() => {
      this.CerrarDispensador();
    }, () => {
      this.popupProviderService.SimpleMessage('PumpTablet', 'La hora de cerrar no ha llegado, Autentiquese con permiso firmante', PopupType.ERROR);
      console.log(this.authData.responseAuth.Response.is_bombero);
      if (!this.authData.responseAuth.Response.autenticar_cierre_turno) { this.CerrarDispensador(); return; }
      this.autenticadorFirmantesService.requestFirmanteAutentication(this.authData.responseAuth.Response.permiso_firmante,
        "No tiene permisos de cerrar por lado", "Pumptablet", () => {
          this.CerrarDispensador();

        }, { permisoRecibido: "cerrar_por_lado" });
    });

  }

  closeSelectedPump() {
    this.authBombero(() => {
      this.validateCloseHour(() => {
        this.cerrarLadosSeleccionados();
      }, () => {
        this.popupProviderService.SimpleMessage('PumpTablet', 'La hora de cerrar no ha llegado, Autentiquese con permiso firmante', PopupType.ERROR);
        console.log(this.authData.responseAuth.Response.is_bombero);
        this.autenticadorFirmantesService.requestFirmanteAutentication(this.authData.responseAuth.Response.permiso_firmante,
          "No tiene permisos de cerrar por lado", "Pumptablet", () => {
            this.getAperturaTurnosActivos();
            this.ladosSeleccionados = this._ladosSeleccionados;
            this.cerrarLadosSeleccionados();
          }, { permisoRecibido: "cerrar_por_lado" });
      });
    }, () => {
    });

  }

  getAperturaTurnosActivos = () => {
    this.loading = true;
    this.AperturaTurnosService.getAperturaTurnos('S')
      .then(
        result => {
          if (result.PossibleError == '') {
            this.aperturaTurnoBomberosActivos = result.List;
            this.loading = false;
          }
        }).catch(error => {
          this.popupProviderService.SimpleMessage('Apertura Turno', error, PopupType.ERROR);
          this.loading = false;
        });
  }

  validateCloseHour(successCallback: () => void, errorCallback: () => void): void {
    this._ladosSeleccionados = this.ladosSeleccionados;
    let pumps = [];
    this.pumptabletService.validateCloseHour()
      .then((response) => {
        if (response.Success) {
          response.Response.forEach((x) =>
            this.ladosSeleccionados.forEach(p => {
              if (x[0] === p.turno && x[1] === p.lado) {
                pumps.push(p);
              }
            })
          );
          successCallback();
        } else {
          errorCallback();
        }
      }).catch((error) => {
        this.popupProviderService.SimpleMessage('Validacion de la hora', 'Error de parte del servidor', PopupType.ERROR);
        errorCallback();
      });
  }

  checkIfHaveOtherTurnOpen(id_bombero: number, bombero: string, success: () => void): void {
    if (!this.authData.responseAuth.Response.bombero_open_more_than_one_turn) {
      this.pumptabletService.checkIfHaveAnotherTurnOpen(id_bombero, bombero)
        .then((response) => {
          if (response.Success) {
            success();
          } else {
            this.popupProviderService.SimpleMessage('Pump Tablet', response.Response, PopupType.INFO);
          }
        })
        .catch((error) => {
          this.popupProviderService.SimpleMessage('Pump Tablet', 'Error de parte del servidor', PopupType.ERROR);
        });
    } else {
      success();
    }

    this.loading = false;
    this.ladosSeleccionados = [];
  }

  getPumpSales(pumpNo: number) {
    this.pumpNo = pumpNo;
    this.httpService.Get<IResponseWithList<ISale>>(undefined, `pumps/${pumpNo}/Sales`).subscribe(
      result => {
        if (result.success) {
          this.pumpSales = result.list;
        }
        else {
          this.popupProviderService.SimpleMessage('PumpTablet', result.message, PopupType.ERROR);
          this.removeSelectedPump(pumpNo);
        }
      }, error => {
        this.popupProviderService.SimpleMessage('PumpTablet', `Error response from the server: ${error.statusText} ${error.status}`, PopupType.ERROR);
        this.removeSelectedPump(pumpNo);
      }
    );
  }

  //HACK: Remove unecessary if else statement...
  addElementToPreset(element: string, isConfigPrice: boolean = false) {
    if (this.sendConfigPrice) {
      this.popupProviderService.SimpleMessage('PumpTablet',
        'Uno de las cantidades configuradas ha sido seleccionada, Debes limpiar la pantalla para poder seleccionar otra cantidad.', PopupType.ERROR);
      return;
    }
    let r = -1;
    if (element === '.') {
      r = this.presetToSend.indexOf('.');
      if (r >= 0) {
        this.popupProviderService.SimpleMessage('PumpTablet', 'Ya hiciste un punto en la cantidad', PopupType.ERROR);
        return;
      } else {
        this.presetToSend += element;
        return;
      }
    }
    if (isConfigPrice) {
      this.presetToSend = element;
      this.sendConfigPrice = true;
    } else if (this.presetToSend === '0') {
      this.presetToSend = element;
    } else {
      this.presetToSend += element;
    }
  }

  resetPreset() {
    this.sendConfigPrice = false;
    this.presetToSend = '0';
  }

  //TODO: Refactor check pump number logic (abstract logic)...
  sendPreset() {
    // TODO: Create logic for select more than a product and set price...
    if (this.ladosSeleccionados.length > 1) {
      this.popupProviderService.SimpleMessage('PumpTablet', 'Debes seleccionar un solo lado para poder ejecutar la accion', PopupType.WARNING);
      return;
    }

    this.httpService.Post<IResponse, IPresetConfig>(undefined, 'pumps/Send/Preset', {
      amount: parseInt(this.presetToSend),
      pumpNo: this.ladosSeleccionados[0].lado,
      type: this.saleType,
      tankFull: false,
      grades: this.preset_grades
    }).subscribe(result => {
      if (result.success) {
        this.popupProviderService.SimpleMessage('PumpTablet', result.message, PopupType.SUCCESS);
      }
      else {
        this.popupProviderService.SimpleMessage('PumpTablet', result.message, PopupType.ERROR);
        console.log(result.error);
      }
    }, error => {
      this.popupProviderService.SimpleMessage('PumpTablet', error, PopupType.ERROR);
    });
  }

  sendActionToPumps(action: string) {
    if (this.ladosSeleccionados.length > 1) {
      this.popupProviderService.SimpleMessage('PumpTablet', 'Debes seleccionar un solo lado para poder ejecutar la accion', PopupType.WARNING);
      return;
    }
    this.httpService.Post<IResponse, IPumpAction>(undefined, 'Pumps/Action', { action: action, pump: this.ladosSeleccionados[0].lado })
      .subscribe(result => {
        if (result.success) {
          this.popupProviderService.SimpleMessage('PumpTablet', result.message, PopupType.SUCCESS);
          this.ladosSeleccionados.splice(0, 1);
          this.checkboxsToggle(false);
        }
        else {
          this.popupProviderService.SimpleMessage('PumpTablet', result.message, PopupType.ERROR);
          console.log(result.error);
        }
      }, error => {
        this.popupProviderService.SimpleMessage('PumpTablet', error, PopupType.ERROR);
      });
  }

  UpdatePumpResumenLados() {
    for (let index = 0; index < this.ResumenesLados.length; index++) {
      this.ResumenesLados[index].pump = this.pumps[index] || { priceLevel: 0, pumpNo: 0, saleProgress: 0, status: 'OFFLINE', salePrice: 0, volume: 0, grade: { id: 0, blue: 0, green: 0, red: 0, rbg: '', description: '', prices: [] }, isAuthored: false, hoses: [] };
    }
  }

  setSaleType(saleType: number) {
    this.saleType = saleType;
  }

  ngOnDestroy(): void {
    this.signalRService.stopConnection();
  }

  setPumpBtns(pumpNo: number) {
    let pump = this.ResumenesLados[pumpNo - 1].pump;
    let btnOpenClose = pump.status === 'CLOSED' ? this.btnActionAndText.find(a => a.action === 'OPEN') : this.btnActionAndText.find(a => a.action === 'CLOSE');
    let btnAuthDeauth = (pump.status === 'CALLING' || pump.status === 'IDLE') ? this.btnActionAndText.find(a => a.action === 'AUTH') : this.btnActionAndText.find(a => a.action === 'DEAUTH');

    this.btns = [btnOpenClose, btnAuthDeauth];
  }

  // TODO: Change input status when input is selected o deselected
  unCheckPumps() {
    let checkboxs = document.querySelectorAll("input[value=Selected]");
  }

  getPrice(hose: IHose) {
    return hose.grades[0].prices.find(price => price.priceLevel === this.pump.priceLevel).price;
  }

  getDescription(hose: IHose) {
    return hose.grades[0].description;
  }

  getGradeId(hose: IHose) {
    return hose.grades[0].id;
  }

  addGradeToPreset(grade: IGrade) {
    if (this.preset_grades.includes(grade)) {
      this.preset_grades = this.preset_grades.filter(x => x !== grade);
    } else {
      this.preset_grades.push(grade);
    }

    console.log(this.preset_grades);
  }
}
