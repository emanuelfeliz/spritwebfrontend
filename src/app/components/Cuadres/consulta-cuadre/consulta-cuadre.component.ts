import { Component, OnInit } from '@angular/core';
import { Turno } from 'app/models/consulta-ventas/Turno.model';
import { CuadresService } from 'app/services/cuadre.service';
import { BomberosService } from 'app/services/bomberos.service';
import { Router } from '@angular/router';
import { Cuadre } from 'app/models/cuadres/cuadre.model';
import { ConsultaventasService } from 'app/services/consultaventas.service';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';
import { PrintServiceService } from 'app/services/print-service.service';
import { DialogService } from 'ng6-bootstrap-modal';
import { PagosPorBomberoCuadreModalComponent } from 'app/components/Cuadres/cuadre/cuadre-turno/modals/pagos-por-bombero-cuadre.component';
import { VentasPorBomberoCuadreModalComponent } from 'app/components/Cuadres/cuadre/cuadre-turno/modals/ventas-por-bombero-cuadre.component';
import { Sale } from 'app/models/ventas/sale.model';
import { Pago } from 'app/models/pagos/Pago.model';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { AutenticadorFirmantesService } from '../../../services/autenticador-firmantes.service';
import { ResumenCuadres } from '../../../models/cuadres/ResumenCuadres.model';
import { ReporteRecibido } from '../../../models/ReportesGenerator/ReporteRecibido.model';
import { FiltroConsultaCuadre } from '../../../models/cuadres/FiltroConsultaCuadre.model';
import { HelperServiceService } from '../../../services/helper-service.service';
declare var require;
@Component({
  selector: 'app-consulta-cuadre',
  templateUrl: './consulta-cuadre.component.html',
  styleUrls:['./consulta-cuadre.component.css']
})

export class ConsultaCuadreComponent implements OnInit {
  p: number = 1;
  total: number = 0;
  tipoFiltro: string = 'turno';
  loadingData: boolean = false;
  Bomberos: Array<{}> = [];
  BomberosSelected: Array<string>;
  fechaDesde: string = '';
  fechaHasta: string = '';
  turnoInicial: number = 0;
  turnoFinal: number = 0;
  turnos: Array<Turno>;
  Cuadres: Array<Cuadre>;
  responseAuth: GenericResponse<UsuarioAutenticado>;
  ResumenCuadres: ResumenCuadres = new ResumenCuadres(0, 0, 0, 0, 0, 0, 0, 0, 0);

  es: any;
  esLocale = require('date-fns/locale/es');
  constructor(private HelperServiceService: HelperServiceService,
    private popupProviderService: PopupProviderService, private ConsultaventasService: ConsultaventasService,
    private cuadreService: CuadresService, private bomberosService: BomberosService,
    private router: Router, private dialogService: DialogService,
    private printer: PrintServiceService, private autenticadorFirmantesService: AutenticadorFirmantesService) {
  }

  imprimir = (cuadre: Cuadre) => {
    this.printer.openNewTab(`WebForms/CuadreBombero.aspx?id=${cuadre.id}`, 'Cuadre');
  }
  verCuadre = (cuadre: Cuadre) => {
    this.router.navigate(['/cuadrar_turno', `${cuadre.turno}`, cuadre.id, '',`${cuadre.Lados}`]);
  }
  cambioTipo = () => {
    if (this.tipoFiltro == 'turno') {
      this.fechaDesde = '';
      this.fechaHasta = '';
    } else {
      this.turnoFinal = 0;
      this.turnoInicial = 0;
    }
  }
  private separarPorComas = (options: Array<string>): string => {
    return (options != undefined && options != null) ? options.join() : '0';
  }
  Limpiar = () => {
    this.Cuadres = new Array<Cuadre>();
  };
  getTurnos = () => {
    this.ConsultaventasService.getTurnos().then(
      result => {
        if (result.PossibleError == '') {
          this.turnos = result.List;
        }
      }
    );
  }
  imprimirCuadres = (): void => {
    if (!this.loadingData && this.Cuadres.length > 0) {

      this.printer.generateReporte(new ReporteRecibido('Reporte de Consulta de Cuadre', '~/Reportes/ConsultaCuadres/rptConsultaCuadre.rpt',
        'consulta_cuadre', false, null, null, JSON.stringify(
          new FiltroConsultaCuadre(this.fechaDesde, this.fechaHasta,
            this.turnoInicial, this.turnoFinal, this.separarPorComas(this.BomberosSelected)))), false);
    }
  }
  ConsultarCuadres = (page: number = 0) => {
    this.p = page !== 0 ? page : this.p;
    const Bomberos: string = this.separarPorComas(this.BomberosSelected);
    this.loadingData = true;

    this.cuadreService.getCuadre(this.fechaDesde, this.fechaHasta,
      this.turnoInicial, this.turnoFinal, Bomberos, 5, this.p, this.responseAuth.Response.id_usuario).then(
        result => {
          if (result.cuadres.PossibleError == '') {
            this.Cuadres = result.cuadres.List;
            this.ResumenCuadres = result.resumenCuadres;
            this.loadingData = false;
            this.total = result.cuadres.TotalRecords;
            console.log(result.cuadres.List);
          } else {
            this.popupProviderService.SimpleMessage('Error consultando cuadres', result.cuadres.PossibleError, PopupType.ERROR);
            return;
          }
        }).catch(error => {
          this.popupProviderService.SimpleMessage('Consulta cuadre', error, PopupType.ERROR);
        });
  }
  deleteCuadre = (cuadreid: string) => {
    this.cuadreService.deleteCuadre(cuadreid).then(response => {
      if (response.Success) {
        this.popupProviderService.SimpleMessage(
          'Éxito',
          'Cuadre eliminado',
          PopupType.SUCCESS
        );
        this.ConsultarCuadres();
      } else {
        this.popupProviderService.SimpleMessage(
          'Cuadre no eliminado',
          response.PossibleError,
          PopupType.ERROR
        );
      }
    }).catch(error => {
      this.popupProviderService.SimpleMessage('Consulta cuadre', error, PopupType.ERROR)
    });
  }
  anular_cuadre = (cuadre: Cuadre): void => {
    this.autenticadorFirmantesService.requestFirmanteAutentication(this.responseAuth.Response.anular_cuadre,
      "No tiene permisos para anular cuadre", "Consulta de Cuadres", () => {
        this.popupProviderService.QuestionMessage('Eliminar cuadre', 'Estás seguro de eliminar el cuadre?', PopupType.WARNING,
          'SI!', 'NO!',
          () => {
            this.deleteCuadre(cuadre.id);
          }, () => { });
      }, { permisoRecibido: "anular_cuadre" });
  }


  private MODAL_PAGOS: any;
  private MODAL_VENTAS_CUADRE_BOMBERO: any;
  verPagos = (pagos: Array<Pago>): void => {
    if (pagos == null || pagos == undefined || pagos.length == 0) {
      this.popupProviderService.SimpleMessage('Consulta de cuadre', 'Este cuadre no contiene pagos',
        PopupType.WARNING);
      return;
    }
    this.MODAL_PAGOS = this.dialogService.addDialog(PagosPorBomberoCuadreModalComponent, {
      pagosRecibidos: pagos,
      readOnly_recibido: true
    }).subscribe(
      result => {
        if (result == 'close') {
          this.MODAL_PAGOS.unsubscribe();
        }
      }
    );
  }
  verVentas = (ventas: Array<Sale>): void => {
    if (ventas == null || ventas == undefined || ventas.length == 0) {
      this.popupProviderService.SimpleMessage('Consulta de cuadre', 'Este cuadre no contiene ventas', PopupType.WARNING);
      return;
    }
    this.MODAL_VENTAS_CUADRE_BOMBERO = this.dialogService.addDialog(VentasPorBomberoCuadreModalComponent, {
      ventasRecibidas: ventas
    }).subscribe(
      result => {
        if (result == 'close') {
          this.MODAL_VENTAS_CUADRE_BOMBERO.unsubscribe();
        }
      }
    );
  }
  inicializarComponent = () => {
    this.es = this.HelperServiceService.getTimeConfiguration(this.esLocale);
    this.responseAuth = JSON.parse(localStorage.getItem('currentUser'));
    if (this.responseAuth.PossibleError == '') {
      if (this.responseAuth.Response.consultar_cuadres == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.GetBomberos();
        this.getTurnos();
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }
  }
  GetBomberos = () => {
    this.bomberosService.getBomberos('AND activo = true').then(
      result => {
        if (result.PossibleError === '') {
          result.List.forEach(x=>{
            this.Bomberos = [...this.Bomberos, {id : x.id, name: x.name}];
          });
        }
      }
    ).catch(error => {
      console.log(error);
    });
  }
  ngOnInit() {
    this.inicializarComponent();
    this.ConsultarCuadres();
  }

  exportCuadresToExcel(): void{
    this.cuadreService.exportCuadresToExcel()
    .then((response) => {
      if (response === 'EXPORTADOS') {
        this.popupProviderService.SimpleMessage('Consulta de cuadres', 'Cuadres exportados', PopupType.SUCCESS);
      }
      else{
        this.popupProviderService.SimpleMessage('Consulta de cuadres', response, PopupType.ERROR);
      }
    }).catch(error => {
      this.popupProviderService.SimpleMessage('Consulta de cuadres', error, PopupType.ERROR);
    });
  }
}
