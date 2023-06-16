import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { NewPumpTabletComponent } from './components/Ventas/new_pumptablet/new_pumptablet.component';
import { HistorialTanquesComponent } from './components/Tanques/historial-tanques/historial-tanques.component';
import { AuthGuard } from './guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PumptabletComponent } from './components/Ventas/pumptablet/pumptablet.component';
import { ConfiguracioncomprobantesComponent } from './components/configuracioncomprobantes/configuracioncomprobantes.component';
import { EstadotanquesComponent } from './components/Tanques/estado-tanques/estado-tanques.component';
import { TurnosComponent } from './components/turnos/turnos.component';
import { ConfigurationComponent } from './components/configuration/configuration.component'
import { ConsultaVentasComponent } from './components/Ventas/consulta-ventas/consulta-ventas.component';
import { ConsultacomprobantesComponent } from './components/consultacomprobantes/consultacomprobantes.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ProductosComponent } from './components/productos/productos.component';
import { EntryComponent } from './components/entry/entry.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { PermisodenegadoComponent } from './components/permisodenegado/permisodenegado.component';
import { RolesComponent } from './components/roles/roles.component';
import { SalesComponent } from './components/Ventas/sales/sales.component';
import { BomberosComponent } from './components/bomberos/bomberos.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ReporteperiodoComponent } from './components/reporteperiodo/reporteperiodo.component';
import { AperturaTurnoComponent } from './components/Cuadres/apertura-turno/apertura-turno.component';
import { InsertarCuadreComponent } from './components/Cuadres/cuadre/insertar-cuadre.component';
import { CuadreTurnoComponent } from './components/Cuadres/cuadre/cuadre-turno/cuadre-turno.component';
import { ConfiguraciontanquesComponent } from 'app/components/Tanques/configuracion-tanques/configuracion-tanques.component';
import { ListadoVentasComponent } from 'app/components/Ventas/listado-ventas/listado-ventas.component';
import { ConsultaCuadreComponent } from 'app/components/Cuadres/consulta-cuadre/consulta-cuadre.component';
import { MovimientosTanquesComponent } from 'app/components/Tanques/movimientos-tanques/movimientos-tanques.component';
import { ConfiguracionHorariosTurnosComponent } from 'app/components/configuracion-horarios-turnos/configuracion-horarios-turnos.component';
import { ReporteDiaMesComponent } from 'app/components/reporte-dia-mes/reporte-dia-mes.component';
import { PagosComponent } from 'app/components/Ventas/pagos/pagos.component';
import { DepositosComponent } from 'app/components/Ventas/depositos/depositos.component';
import { TurnosDiasComponent } from './components/turnos-dias/turnos-dias.component';
import { ServicioComponent } from './components/servicio/servicio.component';
import { CierresAutomaticosComponent } from './components/cierres-automaticos/cierres-automaticos.component';
import { MultipleBills } from './components/Ventas/multiple_bills/multiple_bills.component';
import { ReporteperiodoagendadosComponent } from './components/reporteperiodoagendados/reporteperiodoagendados.component';
import { PriceschangesComponent } from './components/priceschanges/priceschanges.component';
import { SaleManipulationComponent } from './components/sale-manipulation/sale-manipulation.component';
import { PumpsSelectionResolverService } from './components/sale-manipulation/resolvers/pumps-selection-resolver.service';
import { SalesSelectionResolverService } from './components/sale-manipulation/resolvers/sales-selection-resolver.service';
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
import {VentaTipoPagoComponent} from './components/Ventas/tipo-de-pago/venta-tipo-pago.component';
import { ConfigurationScheduleDaysComponent } from './components/configuration-schedule-day/configuration-scedule-day.component';
import { CreditUserComponent } from './components/credit_user/credit_user.component';
import { IncentivosComponent } from './components/incentivos/incentivos.component';
import { IncentivoInfoComponent } from './components/sale-manipulation/components/4.5-incentivo-info/incentivo-info.component';
import { EmpleadosComponent } from 'app/components/empleados/empleados.component';
import { FlotillasComponent } from 'app/components/flotillas/flotillas.component';
import { CreditUserPaymentsComponent } from './components/credit_user/credit_user_payments/credit_user_payments.component';
import { CountedPaymentsComponent } from './components/credit_user/counted_payments/counted_payments.component';
import {TiposClienteFidelizadosComponent} from './components/clientes-fidelizados/tipos-cliente-fidelizado/tipos-cliente-fidelizado.component';
import { DiscountCategoryComponent } from './components/credit_user/discount-category/discount-category.component';
import { VolumeComparationComponent } from './components/Tanques/volume-comparation/volume-comparation.component';
import { ConsultaCuadreBomberosComponent } from './components/Cuadres/consulta-cuadre-bombero/consulta-cuadre-bombero.component';
import { PumptabletClosedTicketsComponent } from './components/Ventas/pumptablet_tickets/pump_tablet_closed_tickets.component';
import { PumpServiceModeSettings } from './components/settings/pumpServicesModeSettings/pumpServiceModeSettings.component';
import { DiscountClientComponent } from './components/discount/discount_client/discount-client.component';
import { ProductComponent } from './components/products/product.component';
import { DiscountProductClientComponent } from './components/discount/discount_product_client/discount-product-client.component';
import { DiscountTktPluComponent } from './components/discount/discount-tkt-plu/discount-tkt-plu.component';
import { CoinRatesComponent } from './components/coin-rates/coin-rates.component';
import { ConfiguracionTanqueComponent } from './components/configuracion-tanque/configuracion-tanque.component';
import { NewTankStatusComponent } from './components/Tanques/new-tank-status/new-tank-status.component';


export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'listadoVentas', component: ListadoVentasComponent, canActivate: [AuthGuard] },
  { path: 'pumptablet', component: PumptabletComponent, canActivate: [AuthGuard] },
  { path: 'new-pumptablet', component: NewPumpTabletComponent, canActivate: [AuthGuard] },
  { path: 'configuracioncomprobantes', component: ConfiguracioncomprobantesComponent, canActivate: [AuthGuard] },
  { path: 'consultacomprobantes', component: ConsultacomprobantesComponent, canActivate: [AuthGuard] },
  { path: 'estadotanques', component: EstadotanquesComponent, canActivate: [AuthGuard] },
  { path: 'turnoscerrados', component: TurnosComponent, canActivate: [AuthGuard] },
  { path: 'configuration', component: ConfigurationComponent, canActivate: [AuthGuard] },
  { path: 'consultaventas', component: ConsultaVentasComponent, canActivate: [AuthGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard] },
  { path: 'productos', component: ProductosComponent, canActivate: [AuthGuard] },
  { path: 'ingresos', component: EntryComponent, canActivate: [AuthGuard] },
  { path: 'inventario', component: InventarioComponent, canActivate: [AuthGuard] },
  { path: 'permisodenegado', component: PermisodenegadoComponent, canActivate: [AuthGuard] },
  { path: 'roles', component: RolesComponent, canActivate: [AuthGuard] },
  { path: 'sales', component: SalesComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuarioComponent, canActivate: [AuthGuard] },
  { path: 'bomberos', component: BomberosComponent, canActivate: [AuthGuard] },
  { path: 'aperturar_turno', component: AperturaTurnoComponent, canActivate: [AuthGuard] },
  { path: 'turnosperiodo', component: ReporteperiodoComponent, canActivate: [AuthGuard] },
  { path: 'cuadre', component: InsertarCuadreComponent, canActivate: [AuthGuard] },
  { path: 'cuadrar_turno/:turno/:id_cuadre/:bombero/:lados', component: CuadreTurnoComponent, canActivate: [AuthGuard] },
  { path: 'configuraciontanques', component: ConfiguraciontanquesComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'historial_tanques', component: HistorialTanquesComponent, canActivate: [AuthGuard] },
  { path: 'consultar_cuadres', component: ConsultaCuadreComponent, canActivate: [AuthGuard] },
  { path: 'consultar_cuadres_bomberos', component: ConsultaCuadreBomberosComponent, canActivate: [AuthGuard] },
  { path: 'movimientos_tanques', component: MovimientosTanquesComponent, canActivate: [AuthGuard] },
  { path: 'volume-comparation', component: VolumeComparationComponent, canActivate: [AuthGuard] },
  { path: 'configuracion_horarios_turno', component: ConfiguracionHorariosTurnosComponent, canActivate: [AuthGuard] },
  { path: 'configuracion_horarios_dias', component: ConfigurationScheduleDaysComponent, canActivate: [AuthGuard] },
  { path: 'reporte_mes', component: ReporteDiaMesComponent, canActivate: [AuthGuard] },
  { path: 'pagos', component: PagosComponent, canActivate: [AuthGuard] },
  { path: 'depositos', component: DepositosComponent, canActivate: [AuthGuard] },
  { path: 'pump_tablet_closed_tickets', component: PumptabletClosedTicketsComponent, canActivate: [AuthGuard] },
  { path: 'turnosdias', component: TurnosDiasComponent, canActivate: [AuthGuard] },
  { path: 'servicio', component: ServicioComponent, canActivate: [AuthGuard] },
  { path: 'cierres-automaticos', component: CierresAutomaticosComponent, canActivate: [AuthGuard] },
  { path: 'pump-service-mode-settings', component: PumpServiceModeSettings, canActivate: [AuthGuard] },
  { path: 'factura-multiple', component: MultipleBills, canActivate: [AuthGuard] },
  { path: 'reporteperiodoagendados', component: ReporteperiodoagendadosComponent, canActivate: [AuthGuard] },
  { path: 'priceschanges', component: PriceschangesComponent, canActivate: [AuthGuard] },
  { path: 'clientes-fidelizados', component: ClientesFidelizadosComponent, canActivate: [AuthGuard] },
  { path: 'configuracion-puntajes-fidelidad', component: ConfiguracionPuntajesFidelidadComponent, canActivate: [AuthGuard] },
  { path: 'new-rnc', component: NewRncComponent, canActivate: [AuthGuard] },
  { path: 'ventaTipoPago', component: VentaTipoPagoComponent, canActivate: [AuthGuard] },
  { path: 'credit_user', component: CreditUserComponent, canActivate: [AuthGuard] },
  { path: 'incentivos', component: IncentivosComponent, canActivate: [AuthGuard] },
  { path: 'empleados', component: EmpleadosComponent, canActivate: [AuthGuard] },
  { path: 'flotillas', component: FlotillasComponent, canActivate: [AuthGuard] },
  { path: 'credit_user_payments', component: CreditUserPaymentsComponent, canActivate: [AuthGuard] },
  { path: 'counted_payments', component: CountedPaymentsComponent, canActivate: [AuthGuard] },
  { path: 'tipo-clientes-fidelizados', component: TiposClienteFidelizadosComponent, canActivate: [AuthGuard] },
  { path: 'discount-by-category', component: DiscountCategoryComponent, canActivate: [AuthGuard] },
  { path: 'transaction_history', component: TransactionHistoryComponent, canActivate: [AuthGuard] },
  { path: 'discount/discount_client', component: DiscountClientComponent, canActivate: [AuthGuard] },
  { path: 'warehouse/products', component: ProductComponent, canActivate: [AuthGuard] },
  { path: 'discount/discount_product_client', component: DiscountProductClientComponent, canActivate: [AuthGuard] },
  { path: 'discount/discount_tkt_plu', component: DiscountTktPluComponent, canActivate: [AuthGuard] },
  { path: 'coin-rates', component: CoinRatesComponent, canActivate: [AuthGuard] },
  {  path: 'sale-manipulation', component: SaleManipulationComponent, canActivate: [AuthGuard]},
  {  path: 'configuracion-tanque', component: ConfiguracionTanqueComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'pumps-selection',
        component: PumpsSelectionComponent,
        canActivate: [AuthGuard],
        resolve: {
          dataLados: PumpsSelectionResolverService
        }
      },
      {
        path: 'sales-selection/:pump',
        component: SalesSelectionComponent,
        canActivate: [AuthGuard],
        resolve: {
          dataVentas: SalesSelectionResolverService
        }
      },
      {
        path: 'sale-detail',
        component: SaleDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'payments-method-selection',
        component: PaymentsMethodSelectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'comodines-selection',
        component: ComodinesSelectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'fidelizacion-info',
        component: FidelizacionInfoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'incentivo-info',
        component: IncentivoInfoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'payments-method-selected',
        component: PaymentsMethodSelectedComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rnc-selection',
        component: RncSelectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invoices-types',
        component: InvoicesTypesComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {path: 'new-tank-status',component:NewTankStatusComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' }
];


