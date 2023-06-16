import { HttpService } from './services/communication_services/http.service';
import { NewPumpTabletComponent } from './components/Ventas/new_pumptablet/new_pumptablet.component';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BootstrapModalModule } from 'ng6-bootstrap-modal';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import "angular2-navigate-with-data";
import "angular2-navigate-with-data";

//Servicios
import { SalesService } from './services/sales.service';
import { CuadresService } from './services/cuadre.service';
import { CategoriesService } from './services/categories.service';
import { ProductosService } from './services/productos.service';
import { VentasService } from './services/ventas.service';
import { AuthenticationService } from './services/authentication.service';
import { PumptabletService } from './services/pumptablet.service';
import { ComprobantesService } from './services/comprobantes.service';
import { EstadoTanquesService } from './services/estado-tanques.service';
import { TurnosService } from './services/turnos.service';
import { ConfigurationService } from './services/configuration.service';
import { ConsultaventasService } from './services/consultaventas.service';
import { EntryService } from './services/entry.service';
import { AperturaTurnosService } from './services/apertura_turno.service';
import { BomberosService } from './services/bomberos.service';
import { IncentivosService } from './services/incentivos.service';
import { EmpleadosService } from './services/empleados.service';
import { FlotillasService } from './services/flotillas.service';
import { IframePrintService } from 'app/services/iframe-print.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoinRatesService } from './services/coinRates.service';
import { APP_ROUTES } from './app.routes';
import { ConfiguracionTanqueService } from './services/configuracion-tanque.service';

//Components
import { EntryComponent } from './components/entry/entry.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AutenticacionBomberoModalComponent } from './modalsGenerales/AutenticacionBombero/modal_autenticacion_bombero.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { VentaModalComponent } from './components/Ventas/listado-ventas/modals/Venta/venta_modal.component';
import { PumptabletComponent } from './components/Ventas/pumptablet/pumptablet.component';
import { ConfiguracioncomprobantesComponent } from './components/configuracioncomprobantes/configuracioncomprobantes.component';
import { EstadotanquesComponent } from './components/Tanques/estado-tanques/estado-tanques.component';
import { TurnosComponent } from './components/turnos/turnos.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { ConsultaVentasComponent } from './components/Ventas/consulta-ventas/consulta-ventas.component';
import { ConsultacomprobantesComponent } from './components/consultacomprobantes/consultacomprobantes.component';
import { DateTimePickerModule } from 'ng-pick-datetime';

import { AuthGuard } from './guards/index';
import { ProductosComponent } from './components/productos/productos.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { RolesComponent } from './components/roles/roles.component';
import { PermisodenegadoComponent } from './components/permisodenegado/permisodenegado.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { SalesComponent } from './components/Ventas/sales/sales.component';
import { BomberosComponent } from './components/bomberos/bomberos.component';
import { ReporteperiodoComponent } from './components/reporteperiodo/reporteperiodo.component';
import { AperturaTurnoComponent } from './components/Cuadres/apertura-turno/apertura-turno.component';
import { InsertarCuadreComponent } from './components/Cuadres/cuadre/insertar-cuadre.component';
import { CuadreTurnoComponent } from './components/Cuadres/cuadre/cuadre-turno/cuadre-turno.component';
import { GlobalEventsManager } from 'app/services/GlobalEventsManager.service';
import { ConfiguraciontanquesComponent } from 'app/components/Tanques/configuracion-tanques/configuracion-tanques.component';
import { VentasPorBomberoCuadreModalComponent } from 'app/components/Cuadres/cuadre/cuadre-turno/modals/ventas-por-bombero-cuadre.component';
import { HistorialTanquesComponent } from './components/Tanques/historial-tanques/historial-tanques.component';
import { SaleDetailModalComponent } from 'app/components/Ventas/listado-ventas/modals/DetalleVenta/SaleDetail.component';
import { ListadoVentasComponent } from 'app/components/Ventas/listado-ventas/listado-ventas.component';
import { CamposDinamicosModalComponent } from 'app/components/Cuadres/cuadre/cuadre-turno/modals/campos-dinamicos.component';
import { ConsultaCuadreComponent } from './components/Cuadres/consulta-cuadre/consulta-cuadre.component';
import { MovimientoTanqueModalComponent } from 'app/components/Tanques/modals/MovimientoTanque.component';
import { MovimientosTanquesComponent } from './components/Tanques/movimientos-tanques/movimientos-tanques.component';
import { MedidaTanqueModalComponent } from 'app/components/Tanques/modals/MedidaTanque.component';
import { ConfiguracionHorariosTurnosComponent } from './components/configuracion-horarios-turnos/configuracion-horarios-turnos.component';
import { ConfiguracionTurnosHorariosService } from 'app/services/configuracion-turnos-horarios.service';
import { ReporteDiaMesComponent } from './components/reporte-dia-mes/reporte-dia-mes.component';
import { PagosComponent } from './components/Ventas/pagos/pagos.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { PrintServiceService } from 'app/services/print-service.service';
import { PagosPorBomberoCuadreModalComponent } from 'app/components/Cuadres/cuadre/cuadre-turno/modals/pagos-por-bombero-cuadre.component';
import { InvocationService } from 'app/services/invocationService.service';
import { DepositosComponent } from './components/Ventas/depositos/depositos.component';
import { DepositosService } from 'app/services/depositos.service';
import { AutenticadorBomberosService } from 'app/services/autenticador-bomberos.service';
import { DepositosPorBomberoCuadreModalComponent } from 'app/components/Cuadres/cuadre/cuadre-turno/modals/depositos-por-bombero-cuadre.component';
import { TurnosCuadrarModalComponent } from 'app/components/Cuadres/apertura-turno/modals/seleccion-turnos-apertura-cuadrar.component';
import { EditarBomberoAperturaModalComponent } from 'app/components/Cuadres/apertura-turno/modals/editar-bombero-apertura.component';
import { PopupProviderService } from 'app/services/popupProvider.service';
import { AutenticacionUsuarioModalComponent } from 'app/modalsGenerales/AutenticacionUsuario/modal_autenticacion_usuario.component';
import { AutenticadorFirmantesService } from 'app/services/autenticador-firmantes.service';
import { TablePumpTabletComponent } from './components/Ventas/pumptablet/components/table-pump-tablet/table-pump-tablet.component';
import { PumpPumpTabletComponent } from './components/Ventas/pumptablet/components/pump-pump-tablet/pump-pump-tablet.component';
import { TurnosDiasComponent } from './components/turnos-dias/turnos-dias.component';
import { ServicioComponent } from './components/servicio/servicio.component';
import { ConsolaServicioService } from './services/consolaServicio.service';
import { CierresAutomaticosComponent } from './components/cierres-automaticos/cierres-automaticos.component';
import { CierresAutomaticosService } from './services/cierres-automaticos.service';
import { ConfigurePumpComponent } from './components/cierres-automaticos/components/configure-pump.component';
import { MultipleBills } from './components/Ventas/multiple_bills/multiple_bills.component';
import { HelperServiceService } from './services/helper-service.service';
import { ReporteperiodoagendadosComponent } from './components/reporteperiodoagendados/reporteperiodoagendados.component';
import { ScheduledPeriodsReportServiceService } from './services/scheduled-periods-report-service.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColorPickerModule } from 'ngx-color-picker';
import { PriceschangesComponent } from './components/priceschanges/priceschanges.component';
import { PriceschangeserviceService } from './services/priceschangeservice.service';
import { SaleManipulationComponent } from './components/sale-manipulation/sale-manipulation.component';
import { PumpsSelectionResolverService } from './components/sale-manipulation/resolvers/pumps-selection-resolver.service';
import { SaleManipulationProviderService } from './components/sale-manipulation/services/sale-manipulation-provider.service';
import { SaleComponent } from './components/sale-manipulation/components/sale-component/sale.component';
import { ClientesFidelizadosComponent } from './components/clientes-fidelizados/clientes-fidelizados.component';
import { ConfiguracionPuntajesFidelidadComponent } from './components/configuracion-puntajes-fidelidad/configuracion-puntajes-fidelidad.component';
import { PumpsSelectionComponent } from './components/sale-manipulation/components/1-pumps-selection/pumps-selection.component';
import { SalesSelectionComponent } from './components/sale-manipulation/components/2-sales-selection/sales-selection.component';
import { SaleDetailComponent } from './components/sale-manipulation/components/5-sale-detail/sale-detail.component';
import { PaymentsMethodSelectionComponent } from './components/sale-manipulation/components/6-payments-method-selection/payments-method-selection.component';
import { ComodinesSelectionComponent } from './components/sale-manipulation/components/3-comodines-selection/comodines-selection.component';
import { FidelizacionInfoComponent } from './components/sale-manipulation/components/4.5-fidelizacion-info/fidelizacion-info.component';
import { PaymentsMethodSelectedComponent } from './components/sale-manipulation/components/7-payments-method-selected/payments-method-selected.component';
import { RncSelectionComponent } from './components/sale-manipulation/components/8-rnc-selection/rnc-selection.component';
import { InvoicesTypesComponent } from './components/sale-manipulation/components/9-invoices-types/invoices-types.component';
import { NewRncComponent } from './components/new-rnc/new-rnc.component';
import { VentaTipoPagoComponent } from './components/Ventas/tipo-de-pago/venta-tipo-pago.component';
import { ConfigurationScheduleDaysComponent } from './components/configuration-schedule-day/configuration-scedule-day.component';
import { CreditUserComponent } from './components/credit_user/credit_user.component';
import { CreditUserService } from './services/credit_user.service';
import { NewCreditUserModalComponent } from './components/credit_user/modals/add_new_credit_user_modal.component';
import { IncentivosComponent } from './components/incentivos/incentivos.component';
import { IncentivoInfoComponent } from 'app/components/sale-manipulation/components/4.5-incentivo-info/incentivo-info.component';
import { EmpleadosComponent } from 'app/components/empleados/empleados.component';
import { FlotillasComponent } from 'app/components/flotillas/flotillas.component';
import { CountedPaymentsComponent } from './components/credit_user/counted_payments/counted_payments.component';
import { CreditUserPaymentsComponent } from './components/credit_user/credit_user_payments/credit_user_payments.component';
import { EditCreditUserModalComponent } from './components/credit_user/modals/edit/edit_credit_user_modal.component';
import { TiposClienteFidelizadosComponent } from './components/clientes-fidelizados/tipos-cliente-fidelizado/tipos-cliente-fidelizado.component';
import { SaleModalComponent } from './components/Ventas/sales/modals/sales-modal.component';
import {DiscountCategoryComponent } from './components/credit_user/discount-category/discount-category.component';
import { AddDiscountByCategoryModalComponent } from './components/credit_user/discount-category/modals/add_discount_by_category_modal.component';
import { EditDiscountByCategoryModalComponent } from './components/credit_user/discount-category/modals/edit/edit_discount_by_category_modal.component';
import { DescuentosPorTurnoBomberoComponent } from 'app/components/Cuadres/cuadre/cuadre-turno/modals/descuentos-por-turno-bombero/descuentos-por-turno-bombero.component';
import { VolumeComparationComponent } from './components/Tanques/volume-comparation/volume-comparation.component';
import { SaleCuadreModalComponent } from './components/Cuadres/cuadre/cuadre-turno/modals/sales-cuadre-modal.component';
import { ConsultaCuadreBomberosComponent } from './components/Cuadres/consulta-cuadre-bombero/consulta-cuadre-bombero.component';
import { PumptabletClosedTicketsComponent } from './components/Ventas/pumptablet_tickets/pump_tablet_closed_tickets.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { PumpServiceModeSettings } from './components/settings/pumpServicesModeSettings/pumpServiceModeSettings.component';
import { DiscountClientComponent } from './components/discount/discount_client/discount-client.component';
import { DiscountProductClientService } from './services/discount-product-client.service';
import { ProductComponent } from './components/products/product.component';
import { DiscountProductClientComponent } from './components/discount/discount_product_client/discount-product-client.component';
import { DiscountTktPluComponent } from './components/discount/discount-tkt-plu/discount-tkt-plu.component';
import {
  AutofocusModule
} from 'angular-autofocus-fix'; // <--- new code
import { ChartsModule } from 'ng2-charts';
import { CoinRatesComponent } from './components/coin-rates/coin-rates.component';
import { FeatureFlagDirective } from './commons/utils/feature-flags.directive';
import { BaseService } from './commons/base.service';
import { HomeService } from './components/home/home.service';
import { TankStatusComponent } from './components/home/tank-status/tank-status.component';
import { ConfiguracionTanqueComponent } from './components/configuracion-tanque/configuracion-tanque.component';
import { CompleteTankStatusComponent } from './components/Tanques/estado-tanques/complete-tank-status/complete-tank-status.component';
import { NewTankStatusComponent } from './components/Tanques/new-tank-status/new-tank-status.component';

@NgModule({
  declarations: [FeatureFlagDirective,
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ListadoVentasComponent,
    SaleDetailModalComponent,
    SaleModalComponent,
    VentaModalComponent,
    AutenticacionBomberoModalComponent,
    PumptabletComponent,
    ConfiguracioncomprobantesComponent,
    EstadotanquesComponent,
    TurnosComponent,
    ConfigurationComponent,
    ConsultaVentasComponent,
    ConsultacomprobantesComponent,
    LoginComponent,
    CategoriasComponent,
    ProductosComponent,
    EntryComponent,
    InventarioComponent,
    RolesComponent,
    PermisodenegadoComponent,
    UsuarioComponent,
    SalesComponent,
    BomberosComponent,
    ReporteperiodoComponent,
    AperturaTurnoComponent,
    InsertarCuadreComponent,
    CuadreTurnoComponent,
    ConfiguraciontanquesComponent,
    VentasPorBomberoCuadreModalComponent,
    SaleCuadreModalComponent,
    HistorialTanquesComponent,
    CamposDinamicosModalComponent,
    ConsultaCuadreComponent,
    ConsultaCuadreBomberosComponent,
    MovimientoTanqueModalComponent,
    MovimientosTanquesComponent,
    VolumeComparationComponent,
    MedidaTanqueModalComponent,
    ConfiguracionHorariosTurnosComponent,
    ReporteDiaMesComponent,
    PagosComponent,
    PagosPorBomberoCuadreModalComponent,
    DepositosPorBomberoCuadreModalComponent,
    FooterComponent,
    HeaderComponent,
    DepositosComponent,
    PumptabletClosedTicketsComponent,
    TurnosCuadrarModalComponent,
    EditarBomberoAperturaModalComponent,
    AutenticacionUsuarioModalComponent,
    TablePumpTabletComponent,
    PumpPumpTabletComponent,
    SaleComponent,
    TurnosDiasComponent,
    ServicioComponent,
    CierresAutomaticosComponent,
    ConfigurePumpComponent,
    MultipleBills,
    ReporteperiodoagendadosComponent,
    PriceschangesComponent,
    SaleManipulationComponent,
    PumpsSelectionComponent,
    SalesSelectionComponent,
    SaleDetailComponent,
    PaymentsMethodSelectionComponent,
    ClientesFidelizadosComponent,
    ConfiguracionPuntajesFidelidadComponent,
    ComodinesSelectionComponent,
    FidelizacionInfoComponent,
    PaymentsMethodSelectedComponent,
    RncSelectionComponent,
    InvoicesTypesComponent,
    NewRncComponent,
    VentaTipoPagoComponent,
    ConfigurationScheduleDaysComponent,
    CreditUserComponent,
    NewCreditUserModalComponent,
    IncentivosComponent,
    IncentivoInfoComponent,
    EmpleadosComponent,
    FlotillasComponent,
    CreditUserPaymentsComponent,
    CountedPaymentsComponent,
    EditCreditUserModalComponent,
    TiposClienteFidelizadosComponent,
    DiscountCategoryComponent,
    AddDiscountByCategoryModalComponent,
    EditDiscountByCategoryModalComponent,
    TiposClienteFidelizadosComponent,
    DescuentosPorTurnoBomberoComponent,
    NewPumpTabletComponent,
    TransactionHistoryComponent,
    PumpServiceModeSettings,
    DiscountClientComponent,
    ProductComponent,
    DiscountProductClientComponent,
    DiscountTktPluComponent,
    CoinRatesComponent,
    TankStatusComponent,
    ConfiguracionTanqueComponent,
    CompleteTankStatusComponent,
    NewTankStatusComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,ChartsModule,
    RouterModule.forRoot(APP_ROUTES, { useHash: true }),
    DateTimePickerModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    BootstrapModalModule,
    NgSelectModule,
    ColorPickerModule,
    ReactiveFormsModule,AutofocusModule
  ],
  entryComponents: [
    VentaModalComponent,
    AutenticacionBomberoModalComponent,
    SaleDetailModalComponent,
    SaleModalComponent,
    VentasPorBomberoCuadreModalComponent,
    SaleCuadreModalComponent,
    CamposDinamicosModalComponent,
    MovimientoTanqueModalComponent,
    MedidaTanqueModalComponent,
    PagosPorBomberoCuadreModalComponent,
    DescuentosPorTurnoBomberoComponent,
    DepositosPorBomberoCuadreModalComponent,
    TurnosCuadrarModalComponent,
    EditarBomberoAperturaModalComponent,
    AutenticacionUsuarioModalComponent,
    NewCreditUserModalComponent,
    EditCreditUserModalComponent,
    AddDiscountByCategoryModalComponent,
    EditDiscountByCategoryModalComponent
  ],
  providers: [
    BaseService,
    HomeService,
    AuthGuard,
    VentasService,
    DiscountProductClientService,
    PumptabletService,
    ComprobantesService,
    EstadoTanquesService,
    TurnosService,
    ConfigurationService,
    ConsultaventasService,
    AuthenticationService,
    CategoriesService,
    ProductosService,
    EntryService,
    SalesService,
    BomberosService,
    AperturaTurnosService,
    CuadresService,
    ConfiguracionTurnosHorariosService,
    GlobalEventsManager,
    PrintServiceService,
    InvocationService,
    DepositosService,
    AutenticadorBomberosService,
    PopupProviderService,
    AutenticadorFirmantesService,
    ConsolaServicioService,
    CierresAutomaticosService,
    HelperServiceService,
    ScheduledPeriodsReportServiceService,
    PriceschangeserviceService,
    PumpsSelectionResolverService,
    SaleManipulationProviderService,
    CreditUserService,
    IncentivosService,
    EmpleadosService,
    FlotillasService,
    IframePrintService,
    HttpService,
    CoinRatesService,
    ConfiguracionTanqueService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
