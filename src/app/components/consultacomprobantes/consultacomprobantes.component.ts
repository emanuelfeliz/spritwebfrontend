import { Component, OnInit } from '@angular/core';
import { FacturaComprobante } from '../../models/consulta-comprobantes/facturaComprobante.model';
import { ComprobantesService } from '../../services/comprobantes.service';
import { VentasService } from '../../services/ventas.service';
import { GenericResponse } from '../../models/GenericResponse.model';
import { DialogService } from "ng6-bootstrap-modal";
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { VentaModalComponent } from '../Ventas/listado-ventas/modals/Venta/venta_modal.component';
import { PrintServiceService } from 'app/services/print-service.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { HelperServiceService } from '../../services/helper-service.service';
import { TipoComprobante } from '../../models/listado-ventas/tipo_comprobante.model';
declare var $, require;
@Component({
  selector: 'app-consultacomprobantes',
  templateUrl: './consultacomprobantes.component.html'
})

export class ConsultacomprobantesComponent implements OnInit {
  fechaDesde: string;
  fechaHasta: string;
  clientName: string;
  clientRNC: string;
  monto: number;
  MODAL_VENTA: any;
  p = 1;
  total = 0;
  loading = false;
  Comprobantes: Array<FacturaComprobante>;
  es: any;
  esLocale = require('date-fns/locale/es');
  responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem("currentUser"));
  TIPOS_COMPROBANTES: Array<TipoComprobante>;
  voucher_type = '';
  totalComprobantes = 0;
  totalVolumen = 0;
  totalMonto = 0;

  constructor(private HelperServiceService: HelperServiceService,
    private popupProviderService: PopupProviderService, private ComprobantesService: ComprobantesService,
    private VentasService: VentasService,
    private dialogService: DialogService, private router: Router, private printer: PrintServiceService) {
    if (this.responseAuth.PossibleError === '') {
      if (this.responseAuth.Response.consulta_comprobantes === false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.fechaDesde = '';
        this.fechaHasta = '';
        this.monto = 0;
        this.clientName = '';
        this.clientRNC = '';
        this.Consultar();
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida',
        'No se puedo obtener la sesión',
        PopupType.ERROR);
    }
  }

  imprimir = (ncf: string) => {
    this.printer.openNewTab(`WebForms/ComprobanteVenta.aspx?ncf=${ncf}`, 'Comprobante');
  }
  suppressVoucherQuestion(ncf: string): void {
    this.popupProviderService.QuestionMessage('Anular comprobante', 'Esta seguro que desea anular este comprobante',
      PopupType.QUESTION, 'Si!', 'No!', () => this.suppressVoucher(ncf), () => {
        this.popupProviderService.SimpleMessage('Consulta de comprobantes', 'El comprobante no fue anulado', PopupType.QUESTION);
      });
  }

  suppressVoucher(ncf: string): void {
    this.ComprobantesService.suppressVoucher(ncf)
      .then((response) => {
        if (response.Success) {
          this.popupProviderService.SimpleMessage('Consulta de comprobantes', 'El comprobante fue anulado', PopupType.SUCCESS);
          this.Consultar();
        } else {
          this.popupProviderService.SimpleMessage('Consulta de comprobantes', 'Error anulando el comprobante', PopupType.ERROR);
        }
      })
      .catch((error) => {
        this.popupProviderService.SimpleMessage('Consulta de comprobantes', error, PopupType.ERROR);
      });
  }

  verVenta = (sale_id: number) => {
    if (sale_id == 0) {
      this.popupProviderService.SimpleMessage('Consulta de comprobantes',
        'Este comprobante no fue asociado a ninguna venta',
        PopupType.WARNING);
      return;
    }
    this.VentasService.getVentaById(sale_id).then(
      result => {
        if (result.PossibleError == "") {
          this.MODAL_VENTA = this.dialogService.addDialog(VentaModalComponent, {
            ventaRecibidaSistema: result.Response,
            ventaRecibidaFabricada: null
          })
            .subscribe(result => {
              this.MODAL_VENTA.unsubscribe();
            });
        }
      }
    ).catch(error => {
      this.popupProviderService.SimpleMessage('Consulta de comprobantes', 'Error al intentar visualizar el comprobante', PopupType.ERROR);
    });
  };
  ngOnInit() {
    this.es = this.HelperServiceService.getTimeConfiguration(this.esLocale);
    // Vouchers
    this.TIPOS_COMPROBANTES = [
      new TipoComprobante('1-Factura para crédito fiscal', '01'),
      new TipoComprobante('8-Regimenes Especiales de Tributacion', '14'),
      new TipoComprobante('9-Comprobantes Gurbernamentales', '15')
    ];
  }
  ExportarTodos = (page: number = 0) => {
    //this.loading = true;
    this.monto = (this.monto === null || this.monto === undefined) ? 0 : this.monto;
    this.ComprobantesService.ExportarTodos(this.fechaDesde, this.fechaHasta, this.clientName,
      this.clientRNC, this.monto, this.voucher_type).then(
      result => {
        if (result === 'EXPORTADOS') {
          this.popupProviderService.SimpleMessage('Exportación',
            'Comprobantes exportados',
            PopupType.SUCCESS);
        } else {
          this.popupProviderService.SimpleMessage('Fallo de exportacion',
            result,
            PopupType.WARNING);
        }
      }
    ).catch(error => {
      this.popupProviderService.SimpleMessage('Consulta comprobantes',
        error, PopupType.ERROR);
    });
  }
  Consultar = (page: number = 0) => {
    this.loading = true;
    this.p = page !== 0 ? page : this.p;
    this.monto = (this.monto === null || this.monto === undefined) ? 0 : this.monto;
    this.ComprobantesService.consultarComprobantes(this.fechaDesde, this.fechaHasta, this.clientName,
      this.clientRNC, this.monto, this.voucher_type, 10, this.p).then(
        result => {
          this.loading = false;
          if (result.PossibleError === '') {
            this.Comprobantes = result.List;
            this.total = result.TotalRecords;
            if (this.Comprobantes.length > 0)
            {
              this.totalComprobantes = this.Comprobantes[0].totalComprobantes;
              this.totalMonto = this.Comprobantes[0].totalMonto;
              this.totalVolumen = this.Comprobantes[0].totalVolumen;
            } else {
              this.totalComprobantes = 0;
              this.totalMonto = 0;
              this.totalVolumen = 0;
            }
          }
        }
      ).catch(error => {
        this.loading = false;
        this.popupProviderService.SimpleMessage('Consulta comprobantes',
          error,
          PopupType.ERROR);
      });
  };

  limpiar():void
  {
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.clientRNC = '';
    this.clientName = '';
    this.monto = 0;
    this.voucher_type = '';
    //this.p = 1;
  }

  modifyVoucher(comprobante: FacturaComprobante):void
  {
    this.ComprobantesService.isMultipleBills(comprobante.ncf)
    .then(reponse => {
      if (reponse.Success) {
          this.router.navigateByData({url: ['factura-multiple'], data: [JSON.stringify(comprobante)]});
      } else {
        this.popupProviderService.SimpleMessage('Comprobantes', 'Solo se pueden modificar los comprobantes que provienen de factura multiple', PopupType.INFO);
      }
    })
    .catch(error => {
      this.popupProviderService.SimpleMessage('Comprobantes', 'Error comprobando origen del comprobante', PopupType.ERROR);      
    });
  }
}
