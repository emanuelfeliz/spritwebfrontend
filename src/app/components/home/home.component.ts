import { environment } from "./../../../environments/environment";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import {
  PopupProviderService,
  PopupType,
} from "app/services/popupProvider.service";
import { Serie } from "app/models/consulta-ventas/Series.model";
import { DataSerie } from "app/models/consulta-ventas/DataSerie.model";
import { DataSerieLineal } from "app/models/consulta-ventas/DataSerieLineal.mode";
import { ConsultaventasService } from "app/services/consultaventas.service";
import { VentasService } from "app/services/ventas.service";
import { DashboardModel } from "app/models/listado-ventas/dashboardInfo";
import { Product } from "app/models/multiple_bills/product.model";
import { ProductosService } from "app/services/productos.service";
import { EstadoTanquesService } from "app/services/estado-tanques.service";
import { EstadoTanque } from "app/models/Tanques/EstadoTanque.model";
import { TankDesign } from "app/models/Tanques/TankDesign.model";
import { GenericResponse } from "app/models/GenericResponse.model";
import { UsuarioAutenticado } from "app/models/usuarios/UsuarioAutenticado.model";
import { Router } from "@angular/router";
import { interval, Subscription } from "rxjs";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Label, MultiDataSet } from "ng2-charts";
import { HomeService } from "./home.service";
import { startWith, switchMap } from "rxjs/operators";
import { Barchart } from "./barchart.model";
import { HeaderTypeEnum } from "app/commons/base-response.model";
import { FeatureFlag } from "app/commons/utils/feature-flags.enum";
import { LineChart } from "./linechart.model";
import { TankStatusComponent } from "./tank-status/tank-status.component";
declare var Highcharts, liquidFillGaugeDefaultSettings, loadLiquidFillGauge, $;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  listing = true;
  fechaDesde = "HOY";
  fechaHasta = "HOY";
  turnoDesde = 0;
  campoDesde = 0;
  campoHasta = 0;
  turnoHasta = 0;
  loadingData = false;
  MontoVendido = 0;
  VolumenVendido = 0;
  CantidadDespachada = 0;
  dashboard_info_state = {};
  products_fuel: Array<Product>;
  product_selected = "TODOS";
  period_selected = "DIA";
  chart: any;

  public appDetails = environment;
  public EstadoTanques: EstadoTanque[];
  private animacion0: any = liquidFillGaugeDefaultSettings(0.38);
  private animacion1: any = liquidFillGaugeDefaultSettings(0.38);
  private animacion2: any = liquidFillGaugeDefaultSettings(0.38);
  private animacion3: any = liquidFillGaugeDefaultSettings(0.38);
  private animacion4: any = liquidFillGaugeDefaultSettings(0.38);
  private animacion5: any = liquidFillGaugeDefaultSettings(0.38);

  public dashboardInfo: any;

  selected_product_id: string = "";
  subscriptionBarchart: Subscription = new Subscription();
  subscriptionDashboard: Subscription = new Subscription();
  subscriptionLineChart: Subscription = new Subscription();
  updateDashboardTimer = 3;


  barchartData:Barchart = new Barchart();
  lineChartData:LineChart;
 

  dashboardFeature:boolean = false;
  @ViewChild(TankStatusComponent) tankStatusComponent!: TankStatusComponent;
  constructor(
    private popupProviderService: PopupProviderService,
    private consultaventasService: ConsultaventasService,
    private productService: ProductosService,
    private router: Router,
    private estadoTanquesService: EstadoTanquesService,
    private readonly homeService: HomeService,
    private readonly ventasService: VentasService,
  ) {
    this.dashboardFeature = environment.FeatureFlags.Dashboard;

    if (!this.dashboardFeature) {
      this.dashboardInfo = {
        Product: "",
        SalesInfo: { BetterRate: 0, Percentage: 0, TotalSales: 0 },
        MoneyInfo: { BetterRate: 0, Percentage: 0, MoneyTotal: 0 },
        VolumeInfo: {
          BetterRate: 0,
          Percentage: 0,
          VolumeTotal: 0,
          TodayVolumeTotal: 0,
          YesterdayVolumeTotal: 0,
        },
      }
    }else{
      this.dashboardInfo = {
        product: "",
        salesInfo: { betterRate: 0, percentage: 0, totalSales: 0 },
        moneyInfo: { betterRate: 0, percentage: 0, moneyTotal: 0 },
        volumeInfo: {
          betterRate: 0,
          percentage: 0,
          volumeTotal: 0,
          todayVolumeTotal: 0,
          yesterdayVolumeTotal: 0,
        },
      }
    }

    
  }

  ngOnDestroy(): void {
    this.subscriptionDashboard.unsubscribe();
    this.subscriptionBarchart.unsubscribe();
    this.subscriptionLineChart.unsubscribe();
    this.tankStatusComponent.subscription.unsubscribe();
  }
  ngOnInit() {
    const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(
      localStorage.getItem("currentUser")
    );
    if (responseAuth.PossibleError === "") {
      if (responseAuth.Response.dashboard === false) {
        this.router.navigate(["listadoVentas"]);
      } else {
        this.loadTanksProducts();

        this.setGaugeConfigs();
        this.getTanques();

         if(this.dashboardFeature){
          this.getDashboardPolling();
          this.getBarChartPolling();
          this.getLineChartPolling();
        }else{
          this.getDashboardInfo(undefined,undefined)
        }
      }
    }
  }

  onChangePeriod(value: string) {
    this.subscriptionDashboard.unsubscribe();
    this.subscriptionBarchart.unsubscribe();
    this.period_selected = value;
    if(this.dashboardFeature){
      this.getDashboardPolling();
      this.getBarChartPolling();
      this.getLineChartPolling();
    }else{
      this.getDashboardInfo(undefined,undefined)
    }
  }

  onChangeProduct(product){
    this.subscriptionDashboard.unsubscribe();
    this.subscriptionBarchart.unsubscribe();
    this.product_selected=product;
    this.getDashboardPolling();
    this.getBarChartPolling();
    this.getLineChartPolling();
  }

  getDashboardPolling(){
    this.subscriptionDashboard.unsubscribe();
    this.subscriptionDashboard = interval(environment.Settings.DashboardSecondsTimer * 1000).pipe(
      startWith(0),
      switchMap(()=> this.homeService.GetDashBoardData(this.product_selected,this.period_selected))
    ).subscribe((res)=>{
      if(res.header.type == HeaderTypeEnum.Success){
        this.dashboardInfo = res.data;
      }else  if(res.header.type == HeaderTypeEnum.Info){
        // this.popupProviderService.SimpleMessage(
        //   "Information",
        //   "Error al cargar los totales "+res.header.message,
        //   PopupType.INFO
        // );
        this.dashboardInfo = {
          product: "",
          salesInfo: { betterRate: 0, percentage: 0, totalSales: 0 },
          moneyInfo: { betterRate: 0, percentage: 0, moneyTotal: 0 },
          volumeInfo: {
            betterRate: 0,
            percentage: 0,
            volumeTotal: 0,
            todayVolumeTotal: 0,
            yesterdayVolumeTotal: 0,
          },
        };
      }else  if(res.header.type == HeaderTypeEnum.Technical){
        // this.popupProviderService.SimpleMessage(
        //   "Technical Error",
        //   "Error al cargar los totales "+res.header.message,
        //   PopupType.ERROR
        // );
      }
    },
    (_err)=>{
      console.error("getDashboardPolling error: ",_err);
      this.dashboardInfo = {
        product: "",
        salesInfo: { betterRate: 0, percentage: 0, totalSales: 0 },
        moneyInfo: { betterRate: 0, percentage: 0, moneyTotal: 0 },
        volumeInfo: {
          betterRate: 0,
          percentage: 0,
          volumeTotal: 0,
          todayVolumeTotal: 0,
          yesterdayVolumeTotal: 0,
        },
      };
      this.dashboardFeature = false; 
      this.dashboardInfo = {
        Product: "",
        SalesInfo: { BetterRate: 0, Percentage: 0, TotalSales: 0 },
        MoneyInfo: { BetterRate: 0, Percentage: 0, MoneyTotal: 0 },
        VolumeInfo: {
          BetterRate: 0,
          Percentage: 0,
          VolumeTotal: 0,
          TodayVolumeTotal: 0,
          YesterdayVolumeTotal: 0,
        },
      }
      this.getDashboardInfo(undefined,undefined)
      // this.subscriptionDashboard.unsubscribe();
    });
  }

  getBarChartPolling(){
    this.subscriptionBarchart.unsubscribe();
    this.subscriptionBarchart = interval(environment.Settings.DashboardSecondsTimer * 1000).pipe(
      startWith(0),
      switchMap(()=> this.homeService.GetBarchartData())
    ).subscribe((res)=>{
      if(res.header.type == HeaderTypeEnum.Success){
        this.barchartData = res.data;
      }else  if(res.header.type == HeaderTypeEnum.Info){
        this.barchartData =  new Barchart();
      }else  if(res.header.type == HeaderTypeEnum.Technical){
        this.barchartData =  new Barchart();
      }
    },
    (_err)=>{
      console.error("getBarChartPolling error: ",_err);
      this.dashboardFeature = false; 
      this.dashboardInfo = {
        Product: "",
        SalesInfo: { BetterRate: 0, Percentage: 0, TotalSales: 0 },
        MoneyInfo: { BetterRate: 0, Percentage: 0, MoneyTotal: 0 },
        VolumeInfo: {
          BetterRate: 0,
          Percentage: 0,
          VolumeTotal: 0,
          TodayVolumeTotal: 0,
          YesterdayVolumeTotal: 0,
        },
      }
      this.getDashboardInfo(undefined,undefined)
      // this.subscriptionBarchart.unsubscribe();
    });
  }
  getLineChartPolling(){
    this.subscriptionLineChart.unsubscribe();
    this.subscriptionLineChart = interval(environment.Settings.DashboardSecondsTimer * 1000).pipe(
      startWith(0),
      switchMap(()=> this.homeService.GetSalesByHour())
    ).subscribe((res)=>{
      if(res.header.type == HeaderTypeEnum.Success){
        this.lineChartData = res.data;
      }else  if(res.header.type == HeaderTypeEnum.Info){
        this.lineChartData =  null
      }else  if(res.header.type == HeaderTypeEnum.Technical){
        this.barchartData =  null
      }
    },
    (_err)=>{
      console.error("getLineChartPolling error: ",_err);
      this.dashboardFeature = false; 
      this.dashboardInfo = {
        Product: "",
        SalesInfo: { BetterRate: 0, Percentage: 0, TotalSales: 0 },
        MoneyInfo: { BetterRate: 0, Percentage: 0, MoneyTotal: 0 },
        VolumeInfo: {
          BetterRate: 0,
          Percentage: 0,
          VolumeTotal: 0,
          TodayVolumeTotal: 0,
          YesterdayVolumeTotal: 0,
        },
      }
      this.getDashboardInfo(undefined,undefined)
      // this.subscriptionBarchart.unsubscribe();
    });
  }

  loadTanksProducts() {
    this.productService
      .getTanksProducts()
      .then((result) => {
        if (result.PossibleError === "") {
          this.products_fuel = result.List;
        }
      })
      .catch((error) => {
        this.popupProviderService.SimpleMessage(
          "Facturación Multiple",
          "Error cargando los gasolinas",
          PopupType.ERROR
        );
      });
  }

  getTanques = () => {
    this.estadoTanquesService
      .getEstadoTanques()
      .then((result) => {
        if (result.PossibleError == "") {
          this.EstadoTanques = result.List;
        }

        setTimeout(() => {
          this.RenderizarTanques();
        }, 500);
      })
      .catch((error) => {
        this.popupProviderService.SimpleMessage(
          "Estado Tanques",
          error,
          PopupType.ERROR
        );
      });
  };

  RenderizarTanques = () => {
    if (this.EstadoTanques != null) {
      for (let i = 0; i < this.EstadoTanques.length; i++) {
        let AnimacionTanque: any = this.animacion0;
        if (this.EstadoTanques[i]["tankDesign"]) {
          let tankDesign: TankDesign = this.EstadoTanques[i]["tankDesign"];
          if (
            tankDesign.circleColor != "" &&
            tankDesign.textColor != "" &&
            tankDesign.waveColor != "" &&
            tankDesign.waveTextColor != "" &&
            (tankDesign.silhouette != undefined ||
              tankDesign.silhouette != null)
          ) {
            switch (tankDesign.silhouette) {
              case 1:
                AnimacionTanque = this.buildAnimation(
                  this.animacion1,
                  tankDesign.circleColor,
                  tankDesign.textColor,
                  tankDesign.waveTextColor,
                  tankDesign.waveColor
                );
                break;
              case 2:
                AnimacionTanque = this.buildAnimation(
                  this.animacion2,
                  tankDesign.circleColor,
                  tankDesign.textColor,
                  tankDesign.waveTextColor,
                  tankDesign.waveColor
                );
                break;
              case 3:
                AnimacionTanque = this.buildAnimation(
                  this.animacion3,
                  tankDesign.circleColor,
                  tankDesign.textColor,
                  tankDesign.waveTextColor,
                  tankDesign.waveColor
                );
                break;
              case 4:
                AnimacionTanque = this.buildAnimation(
                  this.animacion4,
                  tankDesign.circleColor,
                  tankDesign.textColor,
                  tankDesign.waveTextColor,
                  tankDesign.waveColor
                );
                break;
              case 5:
                AnimacionTanque = this.buildAnimation(
                  this.animacion5,
                  tankDesign.circleColor,
                  tankDesign.textColor,
                  tankDesign.waveTextColor,
                  tankDesign.waveColor
                );
                break;
              case 0:
              default:
                AnimacionTanque = this.animacion0;
                break;
            }
          }
        }
        this.EstadoTanques[i].tanque3D.gauge = loadLiquidFillGauge(
          this.EstadoTanques[i].tanque3D.id,
          this.EstadoTanques[i].lleno,
          AnimacionTanque
        );
      }
    }
  };

  buildAnimation = (
    animacion: any,
    circleColor: string,
    textColor: string,
    waveTextColor: string,
    waveColor: string
  ): any => {
    animacion.circleColor = circleColor.includes("#")
      ? circleColor
      : `#${circleColor}`;
    animacion.textColor = textColor.includes("#") ? textColor : `#${textColor}`;
    animacion.waveTextColor = waveTextColor.includes("#")
      ? waveTextColor
      : `#${waveTextColor}`;
    animacion.waveColor = waveColor.includes("#") ? waveColor : `#${waveColor}`;
    return animacion;
  };

  setGaugeConfigs = () => {
    this.animacion1.circleThickness = 0.2;
    this.animacion1.textVertPosition = 0.2;
    this.animacion1.waveAnimateTime = 1000;

    this.animacion2.circleThickness = 0.1;
    this.animacion2.circleFillGap = 0.2;
    this.animacion2.textVertPosition = 0.8;
    this.animacion2.waveAnimateTime = 2000;
    this.animacion2.waveHeight = 0.3;
    this.animacion2.waveCount = 1;

    this.animacion3.textVertPosition = 0.8;
    this.animacion3.waveAnimateTime = 5000;
    this.animacion3.waveHeight = 0.15;
    this.animacion3.waveAnimate = false;
    this.animacion3.waveOffset = 0.25;
    this.animacion3.valueCountUp = false;
    this.animacion3.displayPercent = false;

    this.animacion4.circleThickness = 0.15;
    this.animacion4.textVertPosition = 0.8;
    this.animacion4.waveAnimateTime = 1000;
    this.animacion4.waveHeight = 0.05;
    this.animacion4.waveAnimate = true;
    this.animacion4.waveRise = false;
    this.animacion4.waveHeightScaling = false;
    this.animacion4.waveOffset = 0.25;
    this.animacion4.textSize = 0.75;
    this.animacion4.waveCount = 3;

    this.animacion5.circleThickness = 0.4;
    this.animacion5.textVertPosition = 0.52;
    this.animacion5.waveAnimateTime = 5000;
    this.animacion5.waveHeight = 0;
    this.animacion5.waveAnimate = false;
    this.animacion5.waveCount = 2;
    this.animacion5.waveOffset = 0.25;
    this.animacion5.textSize = 1.2;
    this.animacion5.minValue = 30;
    this.animacion5.maxValue = 150;
    this.animacion5.displayPercent = false;
  };


  getDashboardInfo(product: Product, period_time: string) {
    if (product !== undefined) {
      this.product_selected = product.name;
      // this.period_selected = period_time;
      this.selected_product_id = product.product_id.toString();
    } else {
      this.product_selected = "TODOS";
      this.selected_product_id = "";
      // this.period_selected = period_time;
    }

    this.ventasService
      .getDashboardInfo(this.product_selected, this.period_selected)
      .then((success) => {
        if (success.PossibleError === "") {
          this.dashboardInfo = success.Response;
        } else {
          this.popupProviderService.SimpleMessage(
            "Dashboard",
            success.PossibleError,
            PopupType.ERROR
          );
        }
      })
      .catch((error) => {
        this.popupProviderService.SimpleMessage(
          "Dashboard",
          error,
          PopupType.ERROR
        );
      });
    this.Reporte("hora/producto_volumen");
  }

  Reporte = (tipo: string, _updateChart: boolean = false) => {
    this.loadingData = true;

    this.listing = false;
    this.VolumenVendido = 0;
    this.CantidadDespachada = 0;
    this.MontoVendido = 0;
    // const selected_product_id = this.products_fuel.find(x => x.name === this.product_selected);
    if (
      tipo === "hora/producto_volumen" ||
      tipo === "hora/producto_monto" ||
      tipo === "hora/lado_volumen" ||
      tipo === "hora/lado_monto"
    ) {
      this.consultaventasService
        .GraficosLinealVentas(
          this.fechaDesde,
          this.fechaHasta,
          "0",
          this.selected_product_id,
          tipo === "hora/producto_volumen" || tipo === "hora/lado_volumen"
            ? "volumen"
            : "monto",
          tipo === "hora/producto_volumen" || tipo === "hora/producto_monto"
            ? "producto"
            : "lado",
          "hora/producto_volumen",
          this.turnoDesde,
          this.turnoHasta,
          "",
          this.campoDesde,
          this.campoHasta
        )
        .then((result) => {
          if (result.PossibleError === "") {
            let titulo = `${
              tipo === "hora/producto_volumen" || tipo === "hora/lado_volumen"
                ? "Volumen"
                : "Monto"
            }`;
            titulo += ` vendido por `;
            titulo += `${
              tipo === "hora/producto_volumen" || tipo === "hora/producto_monto"
                ? "Producto"
                : "Lado"
            } por Hora`;
            const prefijo: string =
              tipo === "hora/producto_volumen" || tipo === "hora/lado_volumen"
                ? ""
                : "RD$";
            const sufijo: string =
              tipo === "hora/producto_volumen" || tipo === "hora/lado_volumen"
                ? "Gal."
                : "";
            const SerieGeneral: DataSerieLineal[] = [];
            result.List.forEach((element) => {
              const serie: DataSerieLineal = new DataSerieLineal(
                element.name,
                element.data
              );
              SerieGeneral.push(serie);
              this.AsignarEstadisticas(element);
            });

            if (_updateChart) {
              this.updateChart(SerieGeneral);
            }
            if (!_updateChart && typeof this.chart === "undefined") {
              this.generarGraficoLineal(
                titulo,
                SerieGeneral,
                tipo === "hora/producto_volumen" || tipo === "hora/lado_volumen"
                  ? "Volumenes"
                  : "Montos",
                `Reporte desde ${this.fechaDesde} hasta ${this.fechaHasta}`
              );
              this.loadingData = false;
            }
          } else {
            this.popupProviderService.SimpleMessage(
              "Error consultando ventas",
              result.PossibleError,
              PopupType.ERROR
            );
            return;
          }
        })
        .catch((error) => {
          // this.popupProviderService.SimpleMessage('Consulta ventas', error, PopupType.ERROR);
          console.log(error);
          // this.ngOnInit();
        });
    }
  };

  AsignarEstadisticas = (element: any) => {
    // this.VolumenVendido = element.volumen_vendido;
    // this.CantidadDespachada = element.cantidad_ventas;
    // this.MontoVendido = element.monto_vendido;
  };

  updateChart(series: DataSerieLineal[]) {
    this.chart.series.forEach(function (serie) {
      const chartSerie = series.find((x) => x.name === serie.name);
      serie.setData(chartSerie.data, false);
    });

    this.chart.redraw();
  }

  generarGraficoLineal = (titulo: string, S: any, campo: string, subtitulo) => {
    this.listing = false;
    this.chart = Highcharts.chart("container", {
      title: {
        text: titulo,
      },
      subtitle: {
        text: subtitulo,
      },
      yAxis: {
        title: {
          text: campo,
        },
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
      },
      xAxis: {
        title: {
          text: "Horas",
        },
        categories: [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "00",
        ],
      },
      series: S,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
      },
    });
    this.updateChart(S);
  };




}
