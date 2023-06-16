import { DataSerie } from './../../../models/consulta-ventas/DataSerie.model';
import { Serie } from './../../../models/consulta-ventas/Series.model';
import { Component, OnInit } from '@angular/core';
import { UsuarioAutenticado } from '../../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { GenericResponse } from '../../../models/GenericResponse.model';
import { ConsultaventasService } from '../../../services/consultaventas.service';
import { DataSerieLineal } from 'app/models/consulta-ventas/DataSerieLineal.mode';
import { BomberosService } from 'app/services/bomberos.service';
import { Turno } from 'app/models/consulta-ventas/Turno.model';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { VentaConsultaNueva } from '../../../models/consulta-ventas/VentaConsultaNueva.model';
import { HelperServiceService } from '../../../services/helper-service.service';
declare var require, Highcharts;

@Component({
  selector: 'app-consulta-ventas',
  templateUrl: './consulta-ventas.component.html'
})
export class ConsultaVentasComponent implements OnInit {

  es: any;
  esLocale = require('date-fns/locale/es');
  total = 0;
  p = 1;
  tipoFiltro = 'fecha';
  filtroCampo = 'monto';
  MontoVendido = 0;
  VolumenVendido = 0;
  CantidadDespachada = 0;
  loadingData = false;
  Pumps: Array<{}> = [];
  Products: Array<{}> = [];
  Ventas: Array<VentaConsultaNueva>;
  PumpsSelected: string[];
  ProductsSelected: Array<string>;
  fechaDesde = '';
  fechaHasta = '';
  turnoDesde = 0;
  campoDesde = 0;
  campoHasta = 0;
  turnoHasta = 0;
  turnos: Array<Turno>;

  listing = true;
  fechaLimitada: string;
  constructor(private HelperServiceService: HelperServiceService, private popupProviderService: PopupProviderService, private ConsultaventasService: ConsultaventasService,
    private bomberosService: BomberosService, private router: Router) {

  }
  formatTime(n) {  // always returns a string
    return (n < 10 ? '0' : '') + n;
  }

  private separarPorComas = (options: Array<string>): string => {
    return (options != undefined && options != null) ? options.join() : '0';
  }
  reiniciarCampos = () => {
    this.campoDesde = 0;
    this.campoHasta = 0;
  }
  Limpiar = () => {
    this.VolumenVendido = 0;
    this.CantidadDespachada = 0;
    this.MontoVendido = 0;
    this.Ventas = new Array<VentaConsultaNueva>();
  };
  AsignarEstadisticas = (element: any) => {
    this.VolumenVendido = element.volumen_vendido;
    this.CantidadDespachada = element.cantidad_ventas;
    this.MontoVendido = element.monto_vendido;
  }
  Reporte = (tipo: string) => {

    if (this.tipoFiltro === 'turno') {
      if (this.turnoDesde === 0 || this.turnoHasta === 0) {
        this.popupProviderService.SimpleMessage('Consulta de ventas', 'Debe seleccionar los rangos de turnos', PopupType.WARNING);
        return;
      }
      if (this.turnoDesde > this.turnoHasta) {
        this.popupProviderService.SimpleMessage('Consulta de ventas', 'El turno hasta debe ser mayor que el inicial', PopupType.WARNING);
        return;
      }
    }
    const Pumps: string = this.separarPorComas(this.PumpsSelected);
    const Products: string = this.separarPorComas(this.ProductsSelected);
    this.loadingData = true;


    this.listing = false;
    this.VolumenVendido = 0;
    this.CantidadDespachada = 0;
    this.MontoVendido = 0;


    if (tipo === 'monto/producto' || tipo === 'volumen/producto') {
      this.ConsultaventasService.GraficosPieVentas(this.fechaDesde, this.fechaHasta, Pumps, Products,
        this.tipoFiltro, this.turnoDesde, this.turnoHasta, this.filtroCampo, this.campoDesde, this.campoHasta).then(
          result => {
            if (result.PossibleError == '') {
              const titulo: string = tipo === 'monto/producto' ? 'Monto vendido por Producto' : 'Volumen vendido por Producto';
              const prefijo: string = tipo === 'monto/producto' ? 'RD$' : '';
              const sufijo: string = tipo === 'monto/producto' ? '' : 'Gal.';
              const serie: Serie = new Serie('Producto', true);
              const dataSerie: DataSerie[] = [];
              serie.data = dataSerie.splice(0, dataSerie.length);

              result.List.forEach(element => {
                const valor: number = (tipo === 'monto/producto') ? element.money : element.volume;
                serie.data.push(new DataSerie(element.producto, valor));
                this.AsignarEstadisticas(element);
              });
              this.generarGraficoPie(titulo, serie, prefijo, sufijo);
              this.loadingData = false;
            } else {
              this.popupProviderService.SimpleMessage('Error consultando ventas', result.PossibleError, PopupType.ERROR);
              this.loadingData = false;
              return;
            }
          }).catch(error => {
            this.loadingData = false;
            this.popupProviderService.SimpleMessage('Consulta ventas', error, PopupType.ERROR);
          });
    } else if (tipo === 'hora/producto_volumen' || tipo === 'hora/producto_monto' ||
      tipo === 'hora/lado_volumen' || tipo === 'hora/lado_monto') {
      this.ConsultaventasService.GraficosLinealVentas(this.fechaDesde, this.fechaHasta, Pumps, Products,
        (tipo === 'hora/producto_volumen' || tipo === 'hora/lado_volumen') ? 'volumen' : 'monto',
        (tipo === 'hora/producto_volumen' || tipo === 'hora/producto_monto') ? 'producto' : 'lado',
        this.tipoFiltro, this.turnoDesde, this.turnoHasta, this.filtroCampo, this.campoDesde, this.campoHasta).then(
          result => {
            if (result.PossibleError === '') {
              let titulo = `${(tipo === 'hora/producto_volumen' || tipo === 'hora/lado_volumen') ? 'Volumen' : 'Monto'}`;
              titulo += ` vendido por `;
              titulo += `${(tipo === 'hora/producto_volumen' || tipo === 'hora/producto_monto') ? 'Producto' : 'Lado'} por Hora`;
              const prefijo: string = (tipo === 'hora/producto_volumen' || tipo === 'hora/lado_volumen') ? '' : 'RD$';
              const sufijo: string = (tipo === 'hora/producto_volumen' || tipo === 'hora/lado_volumen') ? 'Gal.' : '';
              const SerieGeneral: DataSerieLineal[] = [];
              result.List.forEach(element => {
                const serie: DataSerieLineal = new DataSerieLineal(element.name, element.data);
                SerieGeneral.push(serie);
                this.AsignarEstadisticas(element);
              });
              this.generarGraficoLineal(titulo, SerieGeneral,
                (tipo === 'hora/producto_volumen' || tipo === 'hora/lado_volumen') ? 'Volumenes' : 'Montos',
                `Reporte desde ${this.fechaDesde} hasta ${this.fechaHasta}`);
              this.loadingData = false;
            } else {
              this.popupProviderService.SimpleMessage('Error consultando ventas', result.PossibleError, PopupType.ERROR);
              return;
            }
          }).catch(error => {
            this.popupProviderService.SimpleMessage('Consulta ventas', error, PopupType.ERROR);
          });
    }
  }
  validateBeforeFiltering = (page: number = 0, callback: (Pumps: string, Products: string) => void) => {
    if (this.tipoFiltro === 'turno') {
      if (this.turnoDesde === 0 || this.turnoHasta === 0) {
        this.popupProviderService.SimpleMessage('Consulta de ventas', 'Debe seleccionar los rangos de turnos', PopupType.WARNING);
        return;
      }
      if (this.turnoDesde > this.turnoHasta) {
        this.popupProviderService.SimpleMessage('Consulta de ventas', 'El turno hasta debe ser mayor que el inicial', PopupType.WARNING);
        return;
      }
    }
    this.p = page !== 0 ? page : this.p;
    this.loadingData = true;
    const Pumps: string = this.separarPorComas(this.PumpsSelected);
    const Products: string = this.separarPorComas(this.ProductsSelected);
    callback(Pumps, Products);
  }
  exportToExcel(page: number = 0): void {
    this.validateBeforeFiltering(page, (Pumps: string, Products: string) => {
      this.ConsultaventasService.ExportSales(this.tipoFiltro, this.turnoDesde, this.turnoHasta, this.fechaDesde,
        this.fechaHasta, Pumps, Products, this.p, 10, this.filtroCampo, this.campoDesde, this.campoHasta).then(
          result => {
            if (result === 'EXPORTADOS') {
              this.popupProviderService.SimpleMessage('Exportacion de Ventas', 'Ventas exportadas', PopupType.SUCCESS);
            } else {
              this.popupProviderService.SimpleMessage('Error exportando ventas', 'Error exportando ventas', PopupType.ERROR);
            }
            this.loadingData = false;
          }).catch(error => {
            this.popupProviderService.SimpleMessage('Consulta ventas', error, PopupType.ERROR);
          });
    });
  }
  ConsultarVentas = (page: number = 0) => {
    this.validateBeforeFiltering(page, (Pumps: string, Products: string) => {
      this.listing = true;
      this.VolumenVendido = 0;
      this.CantidadDespachada = 0;
      this.MontoVendido = 0;

      this.ConsultaventasService.ConsultarVentas(this.tipoFiltro, this.turnoDesde, this.turnoHasta, this.fechaDesde,
        this.fechaHasta, Pumps, Products, this.p, 10, this.filtroCampo, this.campoDesde, this.campoHasta).then(
          result => {
            if (result.Success) {
              this.Ventas = result.Response.ventas;
              this.total = result.Response.cantidad;
              this.CantidadDespachada = result.Response.cantidad;
              this.VolumenVendido = result.Response.volumenVendido;
              this.MontoVendido = result.Response.montoVendido;
            } else {
              this.popupProviderService.SimpleMessage('Error consultando ventas', result.PossibleError, PopupType.ERROR);
              return;
            }
            this.loadingData = false;
          }).catch(error => {
            this.popupProviderService.SimpleMessage('Consulta ventas', error, PopupType.ERROR);
          });
    });
  }
  getTurnos = () => {
    this.ConsultaventasService.getTurnos().then(
      result => {
        if (result.PossibleError == '') {
          this.turnos = result.List;
        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Consulta venta', error, PopupType.ERROR);
      });
  }
  GetProducts = () => {
    this.ConsultaventasService.GetProducts().then(
      result => {
        if (result.PossibleError === '') {
          result.List.forEach(x => {
            this.Products = [...this.Products, x];
          });
        }
      }
    ).catch(error => {
      this.popupProviderService.SimpleMessage('Error interno', error, PopupType.ERROR);
    });;
  };
  GetPumps = () => {
    this.ConsultaventasService.GetPumps().then(
      result => {
        if (result.PossibleError === '') {
          result.List.forEach(x => {
            this.Pumps = [...this.Pumps, x];
          });
        }
      }
    )
      .catch(error => {
        this.popupProviderService.SimpleMessage('Error interno', error, PopupType.ERROR);
      });
  }

  inicializarComponent = () => {
    this.es = this.HelperServiceService.getTimeConfiguration(this.esLocale);
    const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError == '') {
      if (responseAuth.Response.consulta_ventas == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.GetPumps();
        this.GetProducts();
        this.getTurnos();
        const now = new Date();
        if (responseAuth.Response.consulta_ventas_limitado !== '0') {
          const fl = new Date(now.setDate(now.getDate() - parseInt(responseAuth.Response.consulta_ventas_limitado)));
          this.fechaLimitada = fl.getFullYear() +
            this.formatTime(fl.getMonth() + 1) +
            this.formatTime(fl.getDate()) + ' ' +
            this.formatTime(fl.getHours()) +
            this.formatTime(fl.getMinutes()) +
            this.formatTime(fl.getSeconds());
        }
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }
  }

  generarGraficoLineal = (titulo: string, S: any, campo: string, subtitulo) => {
    this.listing = false;
    setTimeout(() => {
      Highcharts.chart('container', {
        title: {
          text: titulo
        },
        subtitle: {
          text: subtitulo
        },
        yAxis: {
          title: {
            text: campo
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },
        xAxis: {
          title: {
            text: 'Horas'
          },
          categories: ['01', '02', '03', '04', '05',
            '06', '07', '08', '09', '10', '11',
            '12', '13', '14', '15', '16', '17',
            '18', '19', '20', '21', '22', '23', '00']
        },
        series: S,
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      });
    }, 40);
  }
  generarGraficoPie = (titulo: string, S: any, prefijo: string, sufijo: string) => {
    Highcharts.chart('container', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: titulo
      },
      tooltip: {
        pointFormat: '{series.name}: <b>' + prefijo + ' {point.y:,.2f} ' + sufijo + ' ({point.percentage:.1f} %)</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          }
        }
      },
      series: [S]
    });
  }
  ngOnInit() {
    this.inicializarComponent();
  }

  check_fields() {
    if ((this.fechaDesde === '' && this.fechaHasta === '') && (this.campoDesde === 0 && this.campoHasta === 0)) {
      this.popupProviderService.SimpleMessage('Consulta de ventas', 'Debes seleccionar por lo menos algun campo', PopupType.INFO);
    } else {
      this.ConsultarVentas();
    }
  }
}
