export class DataEstacion {
  public constructor
    (
    public name: string,
    public address: string,
    public rnc: string,
    public telefono: string,
    public mensaje: string,
    public ruta_exportacion_comprobante_venta: string,
    public ruta_exportacion_cierres_pumptablet: string,
    public ruta_exportacion_reporte_turno_cerrado: string,
    public ruta_exportacion_reporte_turno_curso: string,
    public ruta_exportacion_listadocomprobantes: string,
    public ruta_exportacion_pagos: string,
    public ruta_exportacion_cuadres: string,
    public ruta_exportacion_depositos: string,
    public ruta_exportacion_reporte_turno_periodo: string,
    public ruta_exportacion_reporte_venta_tipo_pago: string,
    public permitir_comprobante_venta_duplicada: boolean,
    public generar_comprobante_excedio_limite: boolean,
    public exportar_comprobante_venta: boolean,
    public exportar_cierres_pumptablet: boolean,
    public exportar_reporte_turnocerrado: boolean,
    public exportar_reporte_turnocurso: boolean,
    public exportar_reporte_turnoperiodo: boolean,
    public tamano_ticket_venta: string,
    public tamano_ticket_comprobante: string,
    public tamano_ticket_apertura: string,
    public tamano_ticket_cierre_dispensador: string,
    public tamano_ticket_cierre_lado: string,
    public tamano_ticket_pumpTablet : string,
    public tamano_ticket_deposito : string,
    public tamano_ticket_facturacion : string,
    public ruta_exportacion_cuadre_pdf : string,
    public ruta_archivo_rnc : string,
    public autenticar_cierre_turno : boolean,

    public rutaLogsSpiritConsolePumpLogs : string,
    public pumpLogFileName : string,
    public exportarFocusFileExcel : boolean,
    public rutaFocusFileExcel : string,
    public consoleType : string,
    public validationPumpsWorking : string,
    public delayToClosePump : string,
    public webpagesVersion : string,
    public webpagesEnabled : boolean,
    public PreserveLoginUrl : boolean,
    public ClientValidationEnabled : boolean,
    public UnobtrusiveJavaScriptEnabled : boolean,
    public CrystalImageCleanerAutoStart : boolean,
    public CrystalImageCleanerSleep : string,
    public CrystalImageCleanerAge : string,
    public listadodeventas : string,
    public showConsoleVolume : boolean,
    public BigSizeTanks : boolean,
    public hideSubReport : boolean,
    public LimiteVentasAndroid : string,
    public ConsoleVolumeFromTrinityAPI : boolean,
    public showProductHeight : boolean,
    public showProductVolume : boolean,
    public showProductUllage : boolean,
    public showProductTCVolume : boolean,
    public showProductMass : boolean,
    public showCalculatedProductVolume : boolean,
    public ShowProductDensity : boolean,
    public showWaterVolume : boolean,
    public showWaterHeight : boolean,
    public showWaterInch : boolean,
    public showCalculatedWaterInch : boolean,
    public showCalculatedWaterVolume : boolean,
    public showFuelInch : boolean,
    public showCalculatedFuelInch : boolean,
    public showPercentageProbes : boolean,
    public UseTimerForUpdateTanks : boolean,
    public UseTimerForUpdateDashboardValues : boolean,
    public LogDirectory : string,
    public blockPumpsBySmartshipConsole : boolean,
    public appUseScanner : boolean,
    public MigrateVoucherToEntradaDiaria : boolean,
    public TimeToWaitForWorkWithTally : string,
    public GetPaymentsByShiftAndDate : boolean,
    public URL_PUMPER_PRICES : string,
    public GetDepositsByShiftAndDate : boolean,
    public ShowOnlyLastShiftForJockey : boolean,
    public SaveDepositsWithDepositCode : boolean,
    public MigrateSalesToMonteCristeDB : boolean,
    public appVersion : string

    ) { }
}
