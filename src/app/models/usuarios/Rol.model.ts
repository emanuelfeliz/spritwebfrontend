export class Rol {
  public constructor(
    public id: number,
    public nombre: string,
    public listado_ventas: boolean,
    public listado_ventas_limitado: string,
    public estado_tanques: boolean,
    public pumptablet: boolean,
    public reporte_turno_cerrados: boolean,
    public reporte_turno_curso: boolean,
    public configuracion_sistema: boolean,
    public consulta_ventas: boolean,
    public consulta_ventas_limitado: string,
    public consulta_comprobantes: boolean,
    public configuracion_comprobantes: boolean,
    public categorias: boolean,
    public productos: boolean,
    public inventario: boolean,
    public ingresos: boolean,
    public roles: boolean,
    public usuarios: boolean,
    public sales: boolean,
    public reporte_turno_periodo: boolean,
    public aperturar_turno: boolean,
    public insertar_cuadre: boolean,
    public bomberos: boolean,
    public configuraciontanques: boolean,
    public expiracion_sesion: number,
    public historial_tanques: boolean,
    public consultar_cuadres: boolean,
    public ingresar_combustible: boolean,
    public egresar_combustible: boolean,
    public movimientos_tanques: boolean,
    public configuracion_horario_turnos: boolean,
    public cerrar_dia: boolean,
    public validar_cuadre: boolean,
    public tpo_prepago: boolean,
    public tpo_cheques: boolean,
    public tpo_vale_credito: boolean,
    public tpo_vale_planta: boolean,
    public tpo_vale_mensajeria: boolean,
    public tpo_vale_consumo: boolean,
    public tpo_calibracion_mezcla: boolean,
    public tpo_calibracion_mantenimiento: boolean,
    public ver_galones_combustible_cuadre: boolean,
    public ver_ventas_combustible_cuadre: boolean,
    public ver_ventas_facturacion_cuadre: boolean,
    public ver_total_vendido_cuadre: boolean,
    public ver_total_tarjeta_cuadre: boolean,
    public ver_total_otros_cuadre: boolean,
    public ver_total_efectivo_cuadre: boolean,
    public anular_pago: boolean,
    public anular_cuadre: boolean,
    public eliminar_apertura: boolean,
    public depositos: boolean,
    public pagos: boolean,
    public permiso_firmante: boolean,
    public cerrar_por_lado: boolean,
    public cerrar_por_dispensador: boolean,
    public aperturar_por_lado: boolean,
    public aperturar_por_dispensador: boolean,
    public aperturar_por_dispensador_sin_importar_turno: boolean,
    public func_abrir_cerrar_seleccionados: boolean,
    public agregar_pagos_cuadre: boolean,
    public agregar_campos_dinamicos_cuadre: boolean,
    public agregar_depositos_cuadre: boolean,
    public acciones_servicio: boolean,
    public cierres_automaticos: boolean,
    public eliminar_deposito: boolean,
    public editar_apertura_cerrada: boolean,
    public prices_changes: boolean,
    public clientes_fidelizados: boolean,
    public suppress_voucher: boolean,
    public exportar_listados: boolean,
    public is_bombero: boolean,
    public modify_voucher: boolean,
    public add_rnc: boolean,
    public configuracion_puntajes_fidelidad: boolean,
    public bombero_open_more_than_one_turn: boolean,
    public add_hour_after_a_pump_can_be_close: boolean,
    public incentivos: boolean,
    public reimprimir_codigo_cliente_fidelizado: boolean,
    public empleados: boolean,
    public flotillas: boolean,
    public reporte_nuevos_clientes_fidelizados: boolean,
    public tpo_pago_contado: boolean,
    public tpo_pago_contado_desc: boolean,
    public autenticar_cierre_turno: boolean,
    public debe_cerrar_todos_lados: boolean,
    public manipulacion_ventas: boolean,
    public creditos: boolean,
    public cliente_creditos: boolean,
    public pagos_creditos: boolean,
    public pagos_contados: boolean,
    public categoria_descuento: boolean,
    public multiple_tarjets: boolean,
    public dashboard: boolean,
    public verifone_type: boolean,
    public close_any_pump: boolean,
    public re_print_ticket_closed_pump: boolean,
    public open_close_pump: boolean,
    public auth_deauth_pump: boolean,
    public multiple_bills: boolean,
    public allow_user_insert_volume_and_price_in_multiple_bills: boolean,
    public allow_create_deposit_without_manual_code:boolean,
    public allow_see_discount_client:boolean,
    public allow_see_discount_product_client:boolean,
    public allow_see_discount_tkt_plu:boolean,
    public allow_close_dispenser_pumptable:boolean,
    public allow_close_day_pumptable:boolean,
    public can_see_new_pump_table:boolean,

  ) { }
}
