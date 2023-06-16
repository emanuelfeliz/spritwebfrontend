import { VentaFabricada } from './../../../models/listado-ventas/VentaFabricada.model';
import { Component, OnInit } from '@angular/core';
import { VentasService } from 'app/services/ventas.service';
import { Pago } from 'app/models/pagos/Pago.model';
import { Router } from '@angular/router';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';
import { VentaModalComponent } from 'app/components/Ventas/listado-ventas/modals/Venta/venta_modal.component';
import { Venta } from 'app/models/listado-ventas/venta.model';
import { DialogService } from 'ng6-bootstrap-modal';
import { PrintServiceService } from 'app/services/print-service.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { AutenticadorFirmantesService } from 'app/services/autenticador-firmantes.service';
import { AperturaTurnosService } from '../../../services/apertura_turno.service';
import { Bombero } from '../../../models/bomberos/bomberos.model';
import { HelperServiceService } from '../../../services/helper-service.service';
@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html'
})
export class PagosComponent implements OnInit {
  responseAuth: GenericResponse<UsuarioAutenticado>;
  pagos: Array<Pago>;
  total = 0;
  p = 1;
  loadingData = false;
  fechaDesde = '';
  fechaHasta = '';
  bomberoSelected = '';
  bomberos: Bombero[] = [];
  campoDesde = 0;
  campoHasta = 0;
  placa = '';
  tarjeta = '';
  metodosPagos: string[] = [
    'Tarjeta',
    'Efectivo',
    'Prepagos',
    'Bono gas',
    'Cheques',
    'Creditos',
    'Vales de estacion Planta',
    'Vales de estacion Mensajeria',
    'Vales de estacion Consumo',
    'Vales de Credito',
    'Calibracion Mezcla',
    'Calibracion Mantenimiento',
    'Otros'
  ];
  metodoPagoSelected = '';
  MODAL_VENTA: any;
  es: any;
  esLocale = require('date-fns/locale/es');
  verVentaF = (venta: VentaFabricada) => {
    this.MODAL_VENTA = this.dialogService.addDialog(VentaModalComponent, {
      ventaRecibidaFabricada: venta,
      ventaRecibidaSistema: null
    })
      .subscribe(result => {
        this.MODAL_VENTA.unsubscribe();
      });
  }
  verVentaS = (venta: Venta) => {
    this.MODAL_VENTA = this.dialogService.addDialog(VentaModalComponent, {
      ventaRecibidaFabricada: null,
      ventaRecibidaSistema: venta
    })
      .subscribe(result => {
        this.MODAL_VENTA.unsubscribe();
      });
  }
  anularPago = (pago: Pago): void => {
    this.autenticadorFirmantesService
      .requestFirmanteAutentication(this.responseAuth.Response.anular_pago, "No tiene permisos para anular pagos",
        "Pagos", () => {
          this.popupProviderService.QuestionMessage("Eliminar pago",
            "Estás seguro de eliminar el pago?", PopupType.QUESTION, "Si", "No",
            () => {
              this.ventasService.anularPago(pago).then(
                result => {
                  if (result.Success) {
                    this.popupProviderService.SimpleMessage("Pagos", "Pago eliminado", PopupType.SUCCESS);
                    this.ConsultarPagos();
                  } else {
                    this.popupProviderService.SimpleMessage("Pagos", "El pago no fue eliminado: "+result.PossibleError, PopupType.WARNING);
                  }
                }
              ).catch(error => {
                this.popupProviderService.SimpleMessage('Pagos', error, PopupType.ERROR);
              });
            }, () => {

            });
        }, { permisoRecibido: "anular_pago" });
  }
  imprimir = (pago: Pago): void => {
    this.printer.openNewTab(`WebForms/ComprobanteVentaPagada.aspx?id_pago=${pago.id}&tipo_pago=${pago.tipo_otro}`, 'Comprobante de Venta');
  }

  printClientTicket(pago: Pago): void {
    if (pago.venta_fabricada) {
      this.popupProviderService.SimpleMessage("Pagos","Las venta fabricadas no tienen ticket de clientes.", PopupType.INFO);
      return;
    }
    this.printer.openNewTab(`WebForms/ImpresionVenta.aspx?json=${JSON.stringify(pago).replace('venta_sistema', 'venta')}`, 'Ticket cliente');
  }

  Limpiar = () => {
    this.pagos = new Array<Pago>();
  };
  constructor(private HelperServiceService: HelperServiceService,
    private autenticadorFirmantesService: AutenticadorFirmantesService,
    private popupProviderService: PopupProviderService, private ventasService: VentasService,
    private router: Router, private dialogService: DialogService,
    private printer: PrintServiceService, public AperturaTurnosService: AperturaTurnosService) {
    const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError === '') {
      if (responseAuth.Response.pagos === false) {
        this.router.navigate(['permisodenegado']);
      }
      this.es = this.HelperServiceService.getTimeConfiguration(this.esLocale);
    } else {
      this.popupProviderService.SimpleMessage("Sesion Fallida", "No se puedo obtener la sesión", PopupType.WARNING);
    }
  }
  ConsultarPagos = (page: number = 0) => {
    if (this.campoDesde > this.campoHasta) {
      this.popupProviderService.SimpleMessage('Pagos', 'El campo hasta debe ser mayor que el inicial', PopupType.WARNING);
      return;
    }

    this.p = page !== 0 ? page : this.p;
    this.loadingData = true;
    this.ventasService.getPagos(this.fechaDesde, this.fechaHasta, this.campoDesde, this.campoHasta,
      this.bomberoSelected, this.metodoPagoSelected, this.tarjeta, this.placa, 10, this.p).then(
        result => {
          if (result.PossibleError === '') {
            this.pagos = result.List;
            this.total = result.TotalRecords;
            this.loadingData = false;
          } else {
            this.popupProviderService.SimpleMessage("Error consultando pagos", result.PossibleError, PopupType.WARNING);
            return;
          }
        }
      ).catch(error => {
        this.popupProviderService.SimpleMessage('Pagos', error, PopupType.ERROR);
      });
  }

  exportPaymentsToExcel(page: number = 0): void {
    if (this.campoDesde > this.campoHasta) {
      this.popupProviderService.SimpleMessage('Pagos', 'El campo hasta debe ser mayor que el inicial', PopupType.WARNING);
      return;
    }

    this.p = page !== 0 ? page : this.p;
    this.loadingData = true;

    this.ventasService.exportPaymentsToExcel(this.fechaDesde, this.fechaHasta, this.campoDesde, this.campoHasta,
      this.bomberoSelected, this.metodoPagoSelected, this.tarjeta, this.placa, 10, this.p)
      .then((response) => {
        if (response === 'EXPORTADOS') {
          this.popupProviderService.SimpleMessage('Pagos', 'Pagos exportados', PopupType.SUCCESS);
          this.loadingData = false;
        } else {
          this.popupProviderService.SimpleMessage('Pagos', response, PopupType.ERROR);
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Pagos', error, PopupType.ERROR);
      });
  }

  inicializarComponent = () => {
    this.responseAuth = JSON.parse(localStorage.getItem("currentUser"));
    if (this.responseAuth.PossibleError == "") {
      if (this.responseAuth.Response.pagos == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.ConsultarPagos(1);
        this.cargarBomberos();
      }
    } else {
      this.popupProviderService.SimpleMessage("Sesion Fallida", "No se puedo obtener la sesión", PopupType.WARNING);
    }
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
    this.inicializarComponent();
  }

}
