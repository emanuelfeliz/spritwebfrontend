/*Tabla ssf_facturas_comprobantes-Agregar campo*/
ALTER TABLE ssf_facturas_comprobantes
ADD COLUMN
sale_id int;
ALTER TABLE ssf_facturas_comprobantes
ADD COLUMN
forma_pago varchar(40);


/*Tabla colores */
CREATE TABLE colores_tanque
(
   id_color int4 NOT NULL PRIMARY KEY,
   color varchar(30) NOT NULL
)
WITHOUT OIDS;
ALTER TABLE colores_tanque OWNER TO postgres;

INSERT INTO colores_tanque(id_color,color) VALUES(1,'Rosado');
INSERT INTO colores_tanque(id_color,color) VALUES(2,'Azul');
INSERT INTO colores_tanque(id_color,color) VALUES(3,'Cian');
INSERT INTO colores_tanque(id_color,color) VALUES(4,'Naranja');
INSERT INTO colores_tanque(id_color,color) VALUES(5,'Rojo');
INSERT INTO colores_tanque(id_color,color) VALUES(6,'Verde');


/*Actualizacion tabla Configuracion colores tanque*/
DROP TABLE configuracion_colores_tanque;
CREATE TABLE configuracion_colores_tanque
(
  id serial NOT NULL,
  id_plu int4,
  id_color int4 NOT NULL,
  CONSTRAINT pk_id_conf_color_tanque PRIMARY KEY (id)
)
WITHOUT OIDS;
ALTER TABLE configuracion_colores_tanque OWNER TO postgres;

CREATE UNIQUE INDEX fk_color_s
  ON configuracion_colores_tanque
  USING btree
  (id_color);

/*Modificacion tabla ssf_datos_cliente*/
ALTER TABLE ssf_datos_cliente RENAME tkt_cust_id TO id;
ALTER TABLE ssf_datos_cliente RENAME tkt_cust_name TO name;
ALTER TABLE ssf_datos_cliente RENAME tkt_cust_address TO address;
ALTER TABLE ssf_datos_cliente RENAME tkt_cust_rnc TO rnc;
ALTER TABLE ssf_datos_cliente RENAME tkt_cust_telefono TO telefono;
ALTER TABLE ssf_datos_cliente RENAME tkt_cust_mensaje TO mensaje;



ALTER TABLE ssf_datos_cliente ADD COLUMN ruta_exportacion_comprobante_venta character varying(150)
NOT NULL DEFAULT 'C:\\Users\\POS0000\\Documents\\ExportacionSpirit\\Comprobantes';
ALTER TABLE ssf_datos_cliente ADD COLUMN ruta_exportacion_cierres_pumptablet character varying(150)
NOT NULL DEFAULT 'C:\\Users\\POS0000\\Documents\\ExportacionSpirit\\Cierres PumpTablet';
ALTER TABLE ssf_datos_cliente ADD COLUMN ruta_exportacion_reporte_turno_cerrado character varying(150)
NOT NULL DEFAULT 'C:\\Users\\POS0000\\Documents\\ExportacionSpirit\\Reporte Turnos Cerrados';
ALTER TABLE ssf_datos_cliente ADD COLUMN permitir_comprobante_venta_duplicada character varying(2)
NOT NULL DEFAULT 'NO';
ALTER TABLE ssf_datos_cliente ADD COLUMN generar_comprobante_excedio_limite character varying(2)
NOT NULL DEFAULT 'NO';
ALTER TABLE ssf_datos_cliente ADD COLUMN exportar_comprobante_venta character varying(2)
NOT NULL DEFAULT 'NO';
ALTER TABLE ssf_datos_cliente ADD COLUMN exportar_cierres_pumptablet character varying(2)
NOT NULL DEFAULT 'NO';
ALTER TABLE ssf_datos_cliente ADD COLUMN exportar_reporte_turnocerrado character varying(2)
NOT NULL DEFAULT 'NO';


ALTER TABLE ssf_datos_cliente ADD COLUMN ruta_exportacion_reporte_turno_curso character varying(150)
NOT NULL DEFAULT 'C:\\Users\\POS0000\\Documents\\ExportacionSpirit\\Reporte Turnos Curso';
ALTER TABLE ssf_datos_cliente ADD COLUMN exportar_reporte_turnocurso character varying(2)
NOT NULL DEFAULT 'NO';

ALTER TABLE ssf_datos_cliente ADD COLUMN ruta_exportacion_listadocomprobantes character varying(150)
NOT NULL DEFAULT 'C:\Users\Administrador\Documents\Listado Comprobantes';




/*Tabla Entry y EntryDetail*/
-- DROP TABLE entry;

CREATE TABLE entry
(
  codigo character varying(200) NOT NULL,
  descripcion character varying(200) NOT NULL,
  fecha character varying(20) NOT NULL,
  total double precision NOT NULL,
  estado character varying(100) NOT NULL,
  CONSTRAINT pk_entry PRIMARY KEY (codigo)
);
ALTER TABLE entry
  OWNER TO postgres;
-- DROP TABLE entry_detail;

CREATE TABLE entry_detail
(
  codigo_entry character varying(200) NOT NULL,
  product character varying(200) NOT NULL,
  productid integer NOT NULL,
  cantidad double precision NOT NULL,
  importe double precision NOT NULL,
  cost double precision NOT NULL DEFAULT 0,
  CONSTRAINT fk_entry_entrydetail FOREIGN KEY (codigo_entry)
      REFERENCES entry (codigo) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);
ALTER TABLE entry_detail
  OWNER TO postgres;


/*Tabla inventgario*/


CREATE TABLE inventario
(
  id serial NOT NULL,
  id_product integer NOT NULL,
  stock_actual integer NOT NULL,
  fecha_act character varying NOT NULL,
  CONSTRAINT pk_inventario PRIMARY KEY (id),
  CONSTRAINT fk_inventario_product FOREIGN KEY (id_product)
      REFERENCES product (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);
ALTER TABLE inventario OWNER TO postgres;


ALTER TABLE product ADD COLUMN cost double precision DEFAULT 0;

CREATE TABLE user_roles
(
  id serial NOT NULL,
  rol character varying(200) NOT NULL,
  listado_ventas character(2) NOT NULL DEFAULT 'NO'::bpchar,
  listado_ventas_limitado character(20) NOT NULL DEFAULT 'NO'::bpchar,
  estado_tanques character(2) NOT NULL DEFAULT 'NO'::bpchar,
  pumptablet character(2) NOT NULL DEFAULT 'NO'::bpchar,
  reporte_turno_cerrados character(2) NOT NULL DEFAULT 'NO'::bpchar,
  reporte_turno_curso character(2) NOT NULL DEFAULT 'NO'::bpchar,
  configuracion_sistema character(2) NOT NULL DEFAULT 'NO'::bpchar,
  consulta_ventas character(2) NOT NULL DEFAULT 'NO'::bpchar,
  consulta_ventas_limitado character(20) NOT NULL DEFAULT 'NO'::bpchar,
  consulta_comprobantes character(2) NOT NULL DEFAULT 'NO'::bpchar,
  configuracion_comprobantes character(2) NOT NULL DEFAULT 'NO'::bpchar,
  categorias character(2) NOT NULL DEFAULT 'NO'::bpchar,
  productos character(2) NOT NULL DEFAULT 'NO'::bpchar,
  inventario character(2) NOT NULL DEFAULT 'NO'::bpchar,
  ingresos character(2) NOT NULL DEFAULT 'NO'::bpchar,
  roles character(2) NOT NULL DEFAULT 'NO'::bpchar,
  CONSTRAINT pk_user_roles PRIMARY KEY (id)
);
ALTER TABLE user_roles
  OWNER TO postgres;

INSERT INTO user_roles(rol) VALUES('SuperAdmin');


ALTER TABLE ssf_usuario ADD COLUMN id_rol integer;

ALTER TABLE ADD CONSTRAINT fk_rol_ssfusuario FOREIGN KEY (id_rol)
      REFERENCES user_roles (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE user_roles ADD COLUMN usuarios character(2) NOT NULL DEFAULT 'NO'::bpchar;


/*Actulizacion ssf_closed_pumps IMPORTANTE*/
ALTER TABLE ssf_closed_pumps ALTER COLUMN id TYPE character varying(200);
ALTER TABLE ssf_closed_pumps RENAME id TO codigo_generado;
/*Actulizacion masterInvoice and detailinvoice IMPORTANTE*/
CREATE TABLE masterinvoice
(
  codigo character varying(200) NOT NULL,
  fecha character varying(20) NOT NULL,
  total double precision NOT NULL,
  CONSTRAINT master_invoice_pk PRIMARY KEY (codigo)
);
ALTER TABLE masterinvoice
  OWNER TO postgres;

  CREATE TABLE invoicedetails
(
  codigo_masterinvoice character varying(200) NOT NULL,
  product character varying(200) NOT NULL,
  productid integer NOT NULL,
  cantidad double precision NOT NULL,
  importe double precision NOT NULL,

  CONSTRAINT masterinvoice_fk FOREIGN KEY (codigo_masterinvoice)
      REFERENCES masterinvoice (codigo) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);
ALTER TABLE invoicedetails
  OWNER TO postgres;

/*Eliminacion del index, para poder poner tanques con mismos colores*/
  drop index fk_color_s

/*Permitir secuencia alfanumerica*/
ALTER TABLE ssf_reporte_turno ALTER COLUMN secuencia TYPE character varying(100);
ALTER TABLE ssf_lado_manguera ALTER COLUMN secuencia TYPE character varying(100);



/*Codigo para tabla ssf_bomberos*/
ALTER TABLE ssf_bomberos ADD COLUMN codigo character varying(100);


ALTER TABLE ssf_datos_cliente ADD COLUMN ruta_exportacion_reporte_turno_periodo character varying(150)
NOT NULL DEFAULT 'C:\\Users\\POS0000\\Documents\\ExportacionSpirit\\Reporte Turnos Periodo';

ALTER TABLE ssf_datos_cliente ADD COLUMN exportar_reporte_turnoperiodo character varying(2)
NOT NULL DEFAULT 'NO';

ALTER TABLE user_roles ADD COLUMN reporte_turno_periodo character(2) NOT NULL DEFAULT 'NO'::bpchar;


/*Nueva version*/

ALTER TABLE user_roles ADD COLUMN aperturar_turno character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN insertar_cuadre character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN bomberos character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN configuraciontanques character(2) NOT NULL DEFAULT 'NO'::bpchar;


drop table colores_tanque;
drop table configuracion_colores_tanque;

CREATE TABLE tanks_design
(
  id serial NOT NULL,
  "circleColor" character varying(50) NOT NULL,
  "textColor" character varying(50) NOT NULL,
  "waveTextColor" character varying(50) NOT NULL,
  "waveColor" character varying(50) NOT NULL,
  silhouette integer NOT NULL,
  id_plu character varying(20) NOT NULL,
  CONSTRAINT pk_tanks_design PRIMARY KEY (id),
  CONSTRAINT fk_idplu_tanksdesign FOREIGN KEY (id_plu)
      REFERENCES ssf_tkt_plu (tkt_plu_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT unique_idplu_tanks_design UNIQUE (id_plu)
);
ALTER TABLE tanks_design
  OWNER TO postgres;


ALTER TABLE apertura_turno_bombero
ALTER COLUMN turno TYPE character varying(200);
ALTER TABLE apertura_turno_bombero
DROP COLUMN fecha_inicio_closed_pump;
ALTER TABLE apertura_turno_bombero
DROP COLUMN fecha_fin_closed_pump;
ALTER TABLE apertura_turno_bombero
DROP COLUMN hora_inicio_closed_pump;
ALTER TABLE apertura_turno_bombero
DROP COLUMN hora_fin_closed_pump;

delete from ssf_tkt_plu where tkt_plu_type='D'



ALTER TABLE user_roles ADD COLUMN expiracion_sesion INTEGER NOT NULL DEFAULT 0;



/*Version nueva con vinculacion bomberos facturas, y reportes*/
alter table sales
add COLUMN id_bombero integer;

alter table sales
add COLUMN bombero character varying(100);

alter table sales add CONSTRAINT fk_bombero FOREIGN KEY (id_bombero)
REFERENCES ssf_bomberos (id) MATCH SIMPLE ON UPDATE NO ACTION
ON DELETE NO ACTION;

alter table sales
add COLUMN tipo_pago character varying(100);

alter table sales
add COLUMN tarjeta character varying(100);

ALTER TABLE ssf_bomberos ADD CONSTRAINT u_codigo_bomberos UNIQUE (codigo);

alter table ssf_facturas_comprobantes
add column bombero character varying(100);


/*Version 7 nov+*/
ALTER TABLE apertura_turno_bombero ADD COLUMN
id_bombero integer;

alter table apertura_turno_bombero
ALTER COLUMN id TYPE character varying(200);


alter table apertura_turno_bombero
ALTER COLUMN id set default '';

alter table apertura_turno_bombero

add constraint unique_apertura_id UNIQUE (id);

CREATE TABLE lados_aperturados
(
  apertura_id character varying(200) NOT NULL,
  lado integer NOT NULL,
  cerrado boolean NOT NULL,
  fecha_desvinculacion character varying(15),
  fecha_vinculacion character varying(15) NOT NULL,
  id serial NOT NULL,
  CONSTRAINT pk_lado_aperturado PRIMARY KEY (id),
  CONSTRAINT fk_lado_aperturado_apertura FOREIGN KEY (apertura_id)
      REFERENCES apertura_turno_bombero (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);
ALTER TABLE lados_aperturados
  OWNER TO postgres;

ALTER TABLE apertura_turno_bombero ADD COLUMN
lados_pendientes integer;

ALTER TABLE apertura_turno_bombero ADD COLUMN
turnos_en_fecha character varying(200);

ALTER TABLE apertura_turno_bombero RENAME turno TO turnos_anteriores;

-- DROP TABLE cuadre_bombero;

CREATE TABLE cuadre_bombero
(
  id character varying(200) NOT NULL,
  id_bombero integer NOT NULL,
  bombero character varying(200) NOT NULL,
  lados character varying(150) NOT NULL,
  turno integer NOT NULL,
  venta_combustible double precision NOT NULL,
  volumen_combustible double precision NOT NULL,
  total_vendido double precision NOT NULL,
  denominaciones character varying(1000) NOT NULL,
  total_efectivo double precision NOT NULL,
  total_tarjeta double precision NOT NULL,
  total_efectivo_registrado double precision NOT NULL,
  venta_facturacion double precision NOT NULL,
  comentario character varying(500),
  sales_id character varying(1000),
  fecha character varying(20) NOT NULL,
  diferencia double precision NOT NULL,
  campos_dinamicos character varying(2000),
  CONSTRAINT pk_cuadre_bombero_id PRIMARY KEY (id)
);
ALTER TABLE cuadre_bombero
  OWNER TO postgres;


CREATE TABLE historial_tanques
(
  id serial NOT NULL,
  id_tank integer NOT NULL,
  volumen double precision NOT NULL,
  fecha character varying(20) NOT NULL,
  CONSTRAINT pk_historial_tanques PRIMARY KEY (id)
);
ALTER TABLE historial_tanques
  OWNER TO postgres;


DROP TABLE tanks_volume_calculated;


ALTER TABLE user_roles ADD COLUMN historial_tanques character(2) NOT NULL DEFAULT 'NO'::bpchar;


ALTER TABLE user_roles ADD COLUMN consultar_cuadres character(2) NOT NULL DEFAULT 'NO'::bpchar;


DROP VIEW "viewVentaComprobantes"


ALTER TABLE user_roles ADD COLUMN ingresar_combustible character(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE user_roles ADD COLUMN egresar_combustible character(2) NOT NULL DEFAULT 'NO'::bpchar;


CREATE TABLE movimientos_tanque
(
  id character varying(200) NOT NULL,
  id_tanque integer NOT NULL,
  bombero character varying(100) NOT NULL,
  id_bombero integer NOT NULL,
  volumen double precision NOT NULL,
  tipo_factura character varying(100) NOT NULL,
  fecha character varying(20) NOT NULL,
  volumen_anterior double precision NOT NULL,
  num_factura integer,
  CONSTRAINT pk_movimientos_tanques PRIMARY KEY (id)
);
ALTER TABLE movimientos_tanque OWNER TO postgres;


ALTER TABLE user_roles ADD COLUMN movimientos_tanques character(2) NOT NULL DEFAULT 'NO'::bpchar;


ALTER TABLE ssf_closed_pumps ADD COLUMN no_turno integer;


CREATE TABLE configuracion_horarios_turnos
(
  id serial NOT NULL,
  turno integer NOT NULL,
  hora_inicio character varying(8) NOT NULL,
  hora_fin character varying(8) NOT NULL,
  CONSTRAINT pk_configuracion_horarios_turnos PRIMARY KEY (id),
  CONSTRAINT uq_configuracion_horarios_turno_ UNIQUE (turno)
);
ALTER TABLE configuracion_horarios_turnos
  OWNER TO postgres;



ALTER TABLE user_roles ADD COLUMN configuracion_horario_turnos character(2) NOT NULL DEFAULT 'NO'::bpchar;


/*Cambios a partir del 9 de diciembre 2017*/
ALTER TABLE medidas_tanque ADD COLUMN id_bombero INTEGER NOT NULL;
ALTER TABLE medidas_tanque ADD COLUMN bombero character varying(100) NOT NULL;

ALTER TABLE ssf_facturas_comprobantes ADD COLUMN tipo_otro character varying(200);
ALTER TABLE ssf_facturas_comprobantes ADD COLUMN dato_otro character varying(200);


CREATE TABLE pagos
(
  id serial NOT NULL,
  fecha_pago character varying(20) NOT NULL,
  sale_id integer NOT NULL,
  metodo_pago character varying(200),
  dato_otro character varying(200),
  tipo_otro character varying(200),
  bombero character varying(200),
  CONSTRAINT pk_pagos_ PRIMARY KEY (id)
);
ALTER TABLE pagos
  OWNER TO postgres;


CREATE TABLE cuadre_bombero_validacion
(
  id serial NOT NULL,
  id_usuario character varying(100) NOT NULL,
  total_efectivo_registrado_admin double precision NOT NULL,
  fecha character varying(20) NOT NULL,
  denominaciones_admin character varying(1000) NOT NULL,
  id_cuadre character varying(200) NOT NULL,
  CONSTRAINT cuadre_bombero_validacion_pkey PRIMARY KEY (id),
  CONSTRAINT cuadre_bombero_validacion_id_cuadre_fkey FOREIGN KEY (id_cuadre)
      REFERENCES cuadre_bombero (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);
ALTER TABLE cuadre_bombero_validacion
  OWNER TO postgres;


ALTER TABLE configuracion_horarios_turnos ADD COLUMN entre_dias boolean;

ALTER TABLE ssf_closed_pumps ADD COLUMN fecha_cierre_dia character varying(20);


ALTER TABLE user_roles ADD COLUMN validar_cuadre character(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE user_roles ADD COLUMN cerrar_dia character(2) NOT NULL DEFAULT 'NO'::bpchar;


/*CAMBIOS NUEVOS 17 DIC incluir en el script de instalacion*/

ALTER TABLE user_roles ADD COLUMN
tpo_prepago character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
tpo_cheques character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
tpo_vale_credito character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
tpo_vale_planta character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
tpo_vale_mensajeria character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
tpo_vale_consumo character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
tpo_calibracion_mezcla character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
tpo_calibracion_mantenimiento character(2) NOT NULL DEFAULT 'NO'::bpchar;


ALTER TABLE pagos ALTER COLUMN id TYPE character varying(200);

/*BORRAR DEFAULT SEQUENCE id en la tabla pagos*/

ALTER TABLE cuadre_bombero ADD COLUMN total_otros double precision NOT NULL DEFAULT 0;

ALTER TABLE cuadre_bombero ADD COLUMN ventas character varying(3000);

ALTER TABLE cuadre_bombero ADD COLUMN pagos character varying(3000);



/*Arreglos del 31 dic*/
ALTER TABLE apertura_turno_bombero ADD COLUMN lados_activos character varying(200);
ALTER TABLE apertura_turno_bombero ADD COLUMN lados_inactivos character varying(200);





ALTER TABLE user_roles ADD COLUMN
ver_galones_combustible_cuadre character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
ver_ventas_combustible_cuadre character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
ver_ventas_facturacion_cuadre character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
ver_total_vendido_cuadre character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
ver_total_tarjeta_cuadre character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
ver_total_otros_cuadre character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
ver_total_efectivo_cuadre character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
anular_pago character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
anular_cuadre character(2) NOT NULL DEFAULT 'NO'::bpchar;

DROP TABLE lados_aperturados;

/*Permisos nuevos */

ALTER TABLE user_roles ADD COLUMN
eliminar_apertura character(2) NOT NULL DEFAULT 'NO'::bpchar;

CREATE TABLE ssf_closed_periods
(
  close_id integer NOT NULL,
  period_status character varying(1) NOT NULL,
  period_type character varying(2) NOT NULL,
  period_start_date character varying(8) NOT NULL,
  period_start_time character varying(6) NOT NULL,
  period_end_date character varying(8),
  period_end_time character varying(6),
  codigo_generado character varying(200) NOT NULL,
  CONSTRAINT pk_ssf_closed_periods PRIMARY KEY (codigo_generado)
);
ALTER TABLE ssf_closed_periods
  OWNER TO postgres;



ALTER TABLE cuadre_bombero ADD COLUMN total_efectivo_neto double precision;
ALTER TABLE cuadre_bombero ADD COLUMN volumen_combustible_neto double precision;
ALTER TABLE cuadre_bombero ADD COLUMN volumen_dinamicos double precision;
ALTER TABLE cuadre_bombero ADD COLUMN monto_dinamicos double precision;


CREATE TABLE depositos
(
  codigo character varying(200) NOT NULL,
  bombero character varying(200) NOT NULL,
  monto double precision NOT NULL,
  fecha character varying(20),
  codigo_deposito int DEFAULT 0,
  bombero_id integer NOT NULL,
  CONSTRAINT pk_depositos PRIMARY KEY (codigo)
);
ALTER TABLE depositos
  OWNER TO postgres;

ALTER TABLE user_roles ADD COLUMN
pagos character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
depositos character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
permiso_firmante character(2) NOT NULL DEFAULT 'NO'::bpchar;



ALTER TABLE cuadre_bombero ADD COLUMN depositos character varying(3000);

ALTER TABLE pagos ALTER COLUMN sale_id  DROP  NOT NULL;

ALTER TABLE pagos ADD COLUMN money numeric;

ALTER TABLE pagos DROP COLUMN sale_id;
ALTER TABLE pagos ADD COLUMN venta_sistema character varying(3000);
ALTER TABLE pagos ADD COLUMN venta_fabricada character varying(3000);
ALTER TABLE pagos ADD COLUMN tarjeta character varying(4);


/*Cambios 15 ener*/
ALTER TABLE ssf_usuario ADD COLUMN codigo character varying(50);
ALTER TABLE ssf_usuario ADD CONSTRAINT u_codigo_usuarios UNIQUE (codigo);

ALTER TABLE apertura_turno_bombero ADD COLUMN detalles_por_lado character varying(2000);

ALTER TABLE user_roles ADD COLUMN
cerrar_por_lado character(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE user_roles ADD COLUMN
cerrar_por_dispensador character(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE user_roles ADD COLUMN
aperturar_por_lado character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN
aperturar_por_dispensador character(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE user_roles ADD COLUMN
aperturar_por_dispensador_sin_importar_turno character(2) NOT NULL DEFAULT 'NO'::bpchar;

/*Tablas para reportes generados por servicio BASADO*/
CREATE TABLE BASED_turnosgenerados
(
  turno int4,
  lado int4
)
WITHOUT OIDS;
ALTER TABLE BASED_turnosgenerados OWNER TO postgres;

CREATE TABLE BASED_resumes_productos_turno
(
  id serial NOT NULL,
  turno integer NOT NULL,
  producto character varying(100) NOT NULL,
  volumen double precision NOT NULL,
  monto double precision NOT NULL,
  CONSTRAINT pk_BASED_resumes_productos_turno PRIMARY KEY (id)
);
ALTER TABLE BASED_resumes_productos_turno OWNER TO postgres;


CREATE TABLE BASED_reporte_turno
(
  pump_id integer NOT NULL DEFAULT 0,
  hose_id integer NOT NULL DEFAULT 0,
  grade_id integer NOT NULL DEFAULT 0,
  tkt_plu_long_desc character varying,
  initial_volume double precision DEFAULT 0,
  final_volume double precision DEFAULT 0,
  start_date character varying,
  start_time character varying,
  end_date character varying,
  end_time character varying,
  ppu double precision DEFAULT 0,
  id_relacion integer DEFAULT 0,
  secuencia character varying(100) DEFAULT 0,
  id_turno numeric DEFAULT 0,
  periods_type_id integer NOT NULL DEFAULT 0,
  id_usuario character varying(20)
);
ALTER TABLE BASED_reporte_turno OWNER TO postgres;


/*Tablas para reportes generados por servicio CALCULADO*/
CREATE TABLE CALCULATED_turnosgenerados
(
  turno int4,
  lado int4
)
WITHOUT OIDS;
ALTER TABLE CALCULATED_turnosgenerados OWNER TO postgres;

CREATE TABLE CALCULATED_resumes_productos_turno
(
  id serial NOT NULL,
  turno integer NOT NULL,
  producto character varying(100) NOT NULL,
  volumen double precision NOT NULL,
  monto double precision NOT NULL,
  CONSTRAINT pk_CALCULATED_resumes_productos_turno PRIMARY KEY (id)
);
ALTER TABLE CALCULATED_resumes_productos_turno OWNER TO postgres;


CREATE TABLE CALCULATED_reporte_turno
(
  pump_id integer NOT NULL DEFAULT 0,
  hose_id integer NOT NULL DEFAULT 0,
  grade_id integer NOT NULL DEFAULT 0,
  tkt_plu_long_desc character varying,
  initial_volume double precision DEFAULT 0,
  final_volume double precision DEFAULT 0,
  start_date character varying,
  start_time character varying,
  end_date character varying,
  end_time character varying,
  ppu double precision DEFAULT 0,
  id_relacion integer DEFAULT 0,
  secuencia character varying(100) DEFAULT 0,
  id_turno numeric DEFAULT 0,
  periods_type_id integer NOT NULL DEFAULT 0,
  id_usuario character varying(20)
);
ALTER TABLE CALCULATED_reporte_turno OWNER TO postgres;

CREATE TABLE CALCULATED_reporte_detalle
(
  id serial NOT NULL,
  turno integer NOT NULL,
  start_date character varying(30) NOT NULL,
  start_time character varying(30) NOT NULL,
  end_date character varying(30) NOT NULL,
  end_time character varying(30) NOT NULL,
  numero_turno integer NOT NULL,
  CONSTRAINT pk_CALCULATED_reporte_detalle PRIMARY KEY (id)
);
ALTER TABLE CALCULATED_reporte_detalle OWNER TO postgres;

CREATE TABLE BASED_reporte_detalle
(
  id serial NOT NULL,
  turno integer NOT NULL,
  start_date character varying(30) NOT NULL,
  start_time character varying(30) NOT NULL,
  end_date character varying(30) NOT NULL,
  end_time character varying(30) NOT NULL,
  numero_turno integer NOT NULL,
  CONSTRAINT pk_BASED_reporte_detalle PRIMARY KEY (id)
);
ALTER TABLE BASED_reporte_detalle OWNER TO postgres;


/*Tablas turno en CURSO*/
CREATE TABLE actual_reporte_detalle
(
  id serial NOT NULL,
  start_date character varying(30) NOT NULL,
  start_time character varying(30) NOT NULL,
  end_date character varying(30) NOT NULL,
  end_time character varying(30) NOT NULL,
  numero_turno integer NOT NULL,
  CONSTRAINT pk_actual_reporte_detalle PRIMARY KEY (id)
);
ALTER TABLE actual_reporte_detalle OWNER TO postgres;


CREATE TABLE actual_reporte_turno
(
  pump_id integer NOT NULL DEFAULT 0,
  hose_id integer NOT NULL DEFAULT 0,
  grade_id integer NOT NULL DEFAULT 0,
  tkt_plu_long_desc character varying,
  initial_volume double precision DEFAULT 0,
  final_volume double precision DEFAULT 0,
  start_date character varying,
  start_time character varying,
  end_date character varying,
  end_time character varying,
  ppu double precision DEFAULT 0,
  id_relacion integer DEFAULT 0,
  secuencia character varying(100) DEFAULT 0,
  id_turno numeric DEFAULT 0,
  periods_type_id integer NOT NULL DEFAULT 0,
  id_usuario character varying(20)
);
ALTER TABLE actual_reporte_turno OWNER TO postgres;

CREATE TABLE actual_resumes_productos_turno
(
  id serial NOT NULL,
  producto character varying(100) NOT NULL,
  volumen double precision NOT NULL,
  monto double precision NOT NULL,
  CONSTRAINT pk_actual_resumes_productos_turno PRIMARY KEY (id)
);
ALTER TABLE actual_resumes_productos_turno OWNER TO postgres;


CREATE TABLE actual_shift_generator_permission
(
  generar boolean
);
ALTER TABLE actual_shift_generator_permission OWNER TO postgres;

INSERT INTO actual_shift_generator_permission VALUES(true);

CREATE TABLE detallefactura
(
  f_documento integer,
  f_nodoc integer,
  f_tipodoc character varying DEFAULT 'FC01'::character varying,
  f_devuelta integer,
  f_descuento integer,
  f_envio integer,
  f_monto integer,
  f_itbis integer,
  f_fecha character varying,
  f_hora character varying,
  f_hechopor integer,
  f_costo integer,
  f_mostrar_itbis integer,
  f_anulado integer,
  f_cerrado integer,
  f_vendedor integer,
  f_cobrador integer,
  f_depto integer,
  f_codigo_fidelidad integer,
  f_pago_tarjeta integer,
  f_cliente integer,
  f_pedido integer,
  f_tipo_papel integer,
  f_numero_control integer,
  f_total_bultos integer,
  f_total_kilos integer,
  f_nombre_cliente integer,
  f_entrega_serial boolean,
  f_monto_excento integer,
  f_base_imponible double precision,
  f_observacion integer,
  f_id_transporte integer,
  f_descuento2 integer,
  f_p_descuento1 integer,
  f_p_descuento2 integer,
  f_p_flete integer,
  f_efectivo integer,
  f_cheque integer,
  f_tarjeta_debito integer,
  f_tarjeta_credito integer,
  f_cheque_numero integer,
  f_cheque_banco integer,
  f_cheque_recibido character varying,
  f_cheque_cobro character varying,
  f_tarjeta_db_id integer,
  f_tarjeta_db_banco integer,
  f_tarjeta_db_autorizacion integer,
  f_tarjeta_cre_id integer,
  f_tarjeta_cre_banco integer,
  f_tarjeta_cre_autorizacion integer,
  f_tipo_t_db integer,
  f_tipo_t_cre integer,
  f_posteada boolean,
  f_cajero integer,
  f_monto_transferencia integer,
  f_transferencia_no integer,
  f_banco_transferencia integer,
  f_fecha_transferencia integer,
  f_monto_vale integer,
  f_vale_no integer,
  f_empresa_vale integer,
  f_fechavenci character varying,
  f_balance integer,
  f_descuento_items integer,
  f_tipo_factura boolean,
  f_tiene_devolucion boolean,
  f_cuadre_caja integer,
  f_pagada boolean,
  f_ncf character varying,
  f_tipo_ncf integer,
  f_cheque_confirmacion integer,
  f_mesa integer,
  f_factura_tipo integer,
  f_turno integer,
  f_monto_bruto double precision,
  f_no_contrato integer,
  f_cantidad_pagare integer,
  f_monto_pagare integer,
  f_monto_inicial integer,
  f_estado integer,
  f_supervisor integer,
  f_moneda integer,
  f_direccion integer,
  f_telefono integer,
  f_celular integer,
  f_tipo_entrega boolean,
  f_entregada boolean,
  f_relacionada boolean,
  f_status integer,
  f_fecha_despacho integer,
  f_contra_entrega boolean,
  f_documento2 integer,
  f_cuadre integer,
  f_ruta integer,
  f_marcada boolean,
  f_conciliada boolean,
  f_modificada_por integer,
  f_recibo_unico_ingreso boolean,
  f_precio double precision
);
ALTER TABLE detallefactura OWNER TO postgres;

CREATE TABLE factura
(
  f_documento character varying,
  f_nodoc integer,
  f_tipodoc character varying DEFAULT 'FC01'::character varying,
  f_referencia integer,
  f_descuento integer,
  f_precio integer,
  f_cantidad integer,
  f_fecha character varying,
  f_categoria integer,
  f_itbs integer,
  f_devuelta integer,
  f_costo integer,
  f_iddep integer,
  f_almacen integer,
  f_pedido character varying,
  f_descuento2 integer,
  f_descuento3 integer,
  f_flete integer,
  f_precio_real double precision,
  f_desc_general integer,
  f_total integer,
  f_serial character varying,
  f_impuesto integer
);
ALTER TABLE factura OWNER TO postgres;


CREATE TABLE ssf_reportes_pump_sales
(
  sale_id integer NOT NULL,
  end_date character varying,
  end_time character varying,
  hose_id integer,
  pump_id integer,
  grade_id integer,
  volume double precision,
  ppu double precision,
  money double precision,
  "level" integer,
  sale_type integer,
  initial_volume double precision,
  final_volume double precision,
  start_date character varying,
  start_time character varying,
  sale_auth character varying,
  dia character varying,
  turno integer NOT NULL DEFAULT 0,
  producto character varying(100) NOT NULL DEFAULT 'Gasolina'::character varying,
  CONSTRAINT ssf_reportes_pump_sales_pkey PRIMARY KEY (sale_id)
);
ALTER TABLE ssf_reportes_pump_sales OWNER TO postgres;



DROP TABLE resumes_productos_turno;
DROP TABLE turnosgenerados;
DROP SEQUENCE resumes_productos_turno_id_seq;

alter table depositos add column turno int default 0;
alter table depositos drop column codigo_deposito;
alter table depositos add column codigo_deposito int;


ALTER TABLE apertura_turno_bombero
ALTER COLUMN lados TYPE character varying(70);

alter table depositos add column turno varchar;


/*Cambios a partir del 25 FEBRERO*/


ALTER TABLE user_roles ADD COLUMN func_abrir_cerrar_seleccionados character(2) NOT NULL DEFAULT 'NO'::bpchar;

CREATE TABLE relacion_turno_bomberos(
  id serial not null,
  turno integer not null,
  bombero character varying(200)
);

/*Cambios a partir del 12 de marzo*/
ALTER TABLE ssf_bomberos ADD COLUMN is_master boolean DEFAULT false;

/*Proteccion duplicidad de lados*/
ALTER TABLE ssf_closed_pumps
  ADD CONSTRAINT unique_lado_in_turno UNIQUE (close_id, pump_status, pump_id);

ALTER TABLE ssf_bomberos ADD COLUMN lados character varying(200);
truncate table detallefactura;
truncate table factura;
truncate table logs;
truncate table actual_reporte_detalle;
truncate table actual_reporte_turno;
truncate table actual_resumes_productos_turno;


/*Cambios validacion de cuadre*/


create table unitMeasure (id_measure serial primary key, gallons float, depth float);
insert into unitMeasure (gallons, depth) values
(3, 0.125), (4, 0.250), (5, 0.375), (7, 0.500), (9, 0.625),(11, 0.750),(13, 0.875),(15, 1.000),(18, 1.125),
(20, 1.250),(23, 1.375),(25, 1.500),(28, 1.625),(31, 1.750),(34, 1.875),(37, 2.000),(40, 2.125),(43, 2.250),
(47, 2.375),(50, 2.500),(53, 2.625),(57, 2.750),(61, 2.875),(64, 3.000),(68, 3.125),(72, 3.250),(76, 3.375),
(79, 3.500),(83, 3.625),(87, 3.750),(92, 3.875),(96, 4.000), (100, 4.125),(104, 4.250),(109, 4.375),(113, 4.500),
(117, 4.625), (122, 4.750),(126, 4.875),(131, 5.000),(136, 5.125),(140, 5.250),(145, 5.375),(150, 5.500),(155, 5.625),(160, 5.750),(165, 5.875),(170, 6.000),(175, 6.125),(180, 6.250),(185, 6.375),(190, 6.500),(195, 6.625),(200, 6.750),(206, 6.875),(211, 7.000),(217, 7.125),(222, 7.250),(227, 7.375),(233, 7.500),(239, 7.625),(244, 7.750),(250, 7.875),(255, 8.000),(261, 8.125),(267, 8.250),(273, 8.375),(279, 8.500),(284, 8.625),(290, 8.750),(296, 8.875),(302, 9.000),(308, 9.125),(314, 9.250),(320, 9.375),(327, 9.500),(333, 9.625),(339, 9.750),(345, 9.875),(351, 10.000),(358, 10.125),
(364, 10.250),(370, 10.375),(377, 10.500),(383, 10.625),(390, 10.750),(396, 10.875),(403, 11.000),(409, 11.125),(416, 11.250),(423, 11.375),(429, 11.500),(436, 11.625),(443, 11.750),(449, 11.875),(456, 12.000),(463, 12.125),
(470, 12.250),(477, 12.375),(483, 12.500),(490, 12.625),(497, 12.750),(504, 12.875),(511, 13.000),(518, 13.125),
(525, 13.250),(532, 13.375),(540, 13.500),(547, 13.625),(554, 13.750),(561, 13.875),(568, 14.000),(576, 14.125),
(583, 14.250),(590, 14.375),(597, 14.500),(605, 14.625),(612, 14.750),(620, 14.875),(627, 15.000),(634, 15.125),
(642, 15.250),(649, 15.375),(657, 15.500),(664, 15.625),(672, 15.750),(680, 15.875),(687, 16.000),(695, 16.125),
(703, 16.250),(710, 16.375),(718, 16.500),(726, 16.625),(733, 16.750),(741, 16.875),(749, 17.000),(757, 17.125),
(765, 17.250),(773, 17.375),(780, 17.500),(788, 17.625),(796, 17.750),(804, 17.875),(812, 18.000),(820, 18.125),
(828, 18.250),(836, 18.375),(844, 18.500),(852, 18.625),(860, 18.750),(869, 18.875),(877, 19.000),(885, 19.125),
(893, 19.250),(901, 19.375),(909, 19.500),(918, 19.625),(926, 19.750),(934, 19.875),(942, 20.000),(951, 20.125),
(959, 20.250),(967, 20.375),(976, 20.500),(984, 20.625),(993, 20.750),(1.001, 20.875),(1.009, 21.000),(1.018, 21.125),
(1.026, 21.250),(1.035, 21.375),(1.043, 21.500),(1.052, 21.625),(1.060, 21.750),(1.069, 21.875),(1.078, 22.000),
(1.086, 22.125),(1.095, 22.250),(1.103, 22.375),(1.112, 22.500),(1.121, 22.625),(1.129, 22.750),(1.138, 22.875),
(1.147, 23.000),(1.156, 23.125),(1.164, 23.250),(1.173, 23.375),(1.182, 23.500),(1.191, 23.625),(1.199, 23.750),
(1.208, 23.875),(1.217, 24.000),(1.226, 24.125),(1.235, 24.250),(1.244, 24.375),(1.252, 24.500),(1.261, 24.625),
(1.270, 24.750),(1.279, 24.875),(1.288, 25.000),(1.297, 25.125),(1.306, 25.250),(1.315, 25.375),(1.324, 25.500),
(1.333, 25.625),(1.342, 25.750),(1.351, 25.875),(1.360, 26.000),(1.369, 26.125),(1.378, 26.250),(1.388, 26.375),
(1.397, 26.500),(1.406, 26.625),(1.415, 26.750),(1.424, 26.875),(1.433, 27.000),(1.442, 27.125),(1.452, 27.250),
(1.461, 27.375),(1.470, 27.500),(1.479, 27.625),(1.489, 27.750),(1.498, 27.875),(1.507, 28.000),(1.516, 28.125),
(1.526, 28.250),(1.535, 28.375),(1.544, 28.500),(1.554, 28.625),(1.563, 28.750),(1.572, 28.875),(1.582, 29.000),
(1.591, 29.125),(1.600, 29.250),(1.610, 29.375),(1.619, 29.500),(1.629, 29.625),(1.638, 29.750),(1.647, 29.875),
(1.657, 30.000),(1.666, 30.125),(1.676, 30.250),(1.685, 30.375),(1.695, 30.500),(1.704, 30.625),(1.714, 30.750),
(1.723, 30.875),(1.733, 31.000),(1.742, 31.125),(1.752, 31.250),(1.762, 31.375),(1.771, 31.500),(1.781, 31.625),
(1.790, 31.750),(1.800, 31.875),(1.809, 32.000),(1.819, 32.125),(1.829, 32.250),(1.838, 32.375),(1.848, 32.500),
(1.858, 32.625),(1.867, 32.750),(1.877, 32.875),(1.887, 33.000),(1.896, 33.125),(1.906, 33.250),(1.916, 33.375),
(1.925, 33.500),(1.935, 33.625),(1.945, 33.750),(1.955, 33.875),(1.964, 34.000),(1.974, 34.125),(1.984, 34.250),
(1.994, 34.375),(2.003, 34.500),(2.013, 34.625),(2.023, 34.750),(2.033, 34.875),(2.043, 35.000),(2.052, 35.125),
(2.062, 35.250),(2.072, 35.375),(2.082, 35.500),(2.092, 35.625),(2.102, 35.750),(2.111, 35.875),(2.121, 36.000),
(2.131, 36.125),(2.141, 36.250),(2.151, 36.375),(2.161, 36.500),(2.171, 36.625),(2.181, 36.750),(2.191, 36.875),
(2.200, 37.000),(2.210, 37.125),(2.220, 37.250),(2.230, 37.375),(2.240, 37.500),(2.250, 37.625),(2.260, 37.750),
(2.270, 37.875),(2.280, 38.000),(2.290, 38.125),(2.300, 38.250),(2.310, 38.375),(2.320, 38.500),(2.330, 38.625),
(2.340, 38.750),(2.350, 38.875),(2.360, 39.000),(2.370, 39.125),(2.380, 39.250),(2.390, 39.375),(2.400, 39.500),
(2.410, 39.625),(2.420, 39.750),(2.430, 39.875),(2.440, 40.000),(2.450, 40.125),(2.460, 40.250),(2.470, 40.375),
(2.480, 40.500),(2.490, 40.625),(2.500, 40.750),(2.511, 40.875),(2.521, 41.000),(2.531, 41.125),(2.541, 41.250),
(2.551, 41.375),(2.561, 41.500),(2.571, 41.625),(2.581, 41.750),(2.591, 41.875),(2.601, 42.000),(2.611, 42.125),
(2.622, 42.250),(2.632, 42.375),(2.642, 42.500),(2.652, 42.625),(2.662, 42.750),(2.672, 42.875),(2.682, 43.000),
(2.692, 43.125),(2.703, 43.250),(2.713, 43.375),(2.723, 43.500),(2.733, 43.625),(2.743, 43.750),(2.753, 43.875),
(2.763, 44.000),(2.774, 44.125),(2.784, 44.250),(2.794, 44.375),(2.804, 44.500),(2.814, 44.625),(2.824, 44.750),
(2.834, 44.875),(2.845, 45.000),(2.855, 45.125),(2.865, 45.250),(2.875, 45.375),(2.885, 45.500),(2.895, 45.625),
(2.906, 45.750),(2.916, 45.875),(2.926, 46.000),(2.936, 46.125),(2.946, 46.250),(2.957, 46.375),(2.967, 46.500),
(2.977, 46.625),(2.987, 46.750),(2.997, 46.875),(3.007, 47.000),(3.018, 47.125),(3.028, 47.250),(3.038, 47.375),
(3.048, 47.500),(3.058, 47.625),(3.069, 47.750),(3.079, 47.875),(3.089, 48.000),(3.099, 48.125),(3.109, 48.250),
(3.119, 48.375),(3.130, 48.500),(3.140, 48.625),(3.150, 48.750),(3.160, 48.875),(3.170, 49.000),(3.180, 49.125),
(3.191, 49.250),(3.201, 49.375),(3.211, 49.500),(3.221, 49.625),(3.231, 49.750),(3.242, 49.875),(3.252, 50.000),
(3.262, 50.125),(3.272, 50.250),(3.282, 50.375),(3.292, 50.500),(3.303, 50.625),(3.313, 50.750),(3.323, 50.875),
(3.333, 51.000),(3.343, 51.125),(3.353, 51.250),(3.364, 51.375),(3.374, 51.500),(3.384, 51.625),(3.394, 51.750),
(3.404, 51.875),(3.414, 52.000),(3.424, 52.125),(3.435, 52.250),(3.445, 52.375),(3.455, 52.500),(3.465, 52.625),
(3.475, 52.750),(3.485, 52.875),(3.495, 53.000),(3.505, 53.125),(3.516, 53.250),(3.526, 53.375),(3.536, 53.500),
(3.546, 53.625),(3.556, 53.750),(3.566, 53.875),(3.576, 54.000),(3.586, 54.125),(3.596, 54.250),(3.607, 54.375),
(3.617, 54.500),(3.627, 54.625),(3.637, 54.750),(3.647, 54.875),(3.657, 55.000),(3.667, 55.125),(3.677, 55.250),
(3.687, 55.375),(3.697, 55.500),(3.707, 55.625),(3.717, 55.750),(3.727, 55.875),(3.737, 56.000),(3.747, 56.125),
(3.757, 56.250),(3.767, 56.375),(3.777, 56.500),(3.787, 56.625),(3.797, 56.750),(3.807, 56.875),(3.817, 57.000),
(3.827, 57.125),(3.837, 57.250),(3.847, 57.375),(3.857, 57.500),(3.867, 57.625),(3.877, 57.750),(3.887, 57.875),
(3.897, 58.000),(3.907, 58.125),(3.917, 58.250),(3.927, 58.375),(3.937, 58.500),(3.947, 58.625),(3.957, 58.750),
(3.967, 58.875),(3.977, 59.000),(3.987, 59.125),(3.997, 59.250),(4.006, 59.375),(4.016, 59.500),(4.026, 59.625),
(4.036, 59.750),(4.046, 59.875),(4.056, 60.000),(4.066, 60.125),(4.075, 60.250),(4.085, 60.375),(4.095, 60.500),
(4.105, 60.625),(4.115, 60.750),(4.125, 60.875),(4.134, 61.000),(4.144, 61.125),(4.154, 61.250),(4.164, 61.375),
(4.173, 61.500),(4.183, 61.625),(4.193, 61.750),(4.203, 61.875),(4.212, 62.000),(4.222, 62.125),(4.232, 62.250),
(4.242, 62.375),(4.251, 62.500),(4.261, 62.625),(4.271, 62.750),(4.280, 62.875),(4.290, 63.000),(4.300, 63.125),
(4.309, 63.250),(4.319, 63.375),(4.329, 63.500),(4.338, 63.625),(4.348, 63.750),(4.358, 63.875),(4.367, 64.000),
(4.377, 64.125),(4.386, 64.250),(4.396, 64.375),(4.405, 64.500),(4.415, 64.625),(4.424, 64.750),(4.434, 64.875),
(4.444, 65.000),(4.453, 65.125),(4.463, 65.250),(4.472, 65.375),(4.482, 65.500),(4.491, 65.625),(4.500, 65.750),
(4.510, 65.875),(4.519, 66.000),(4.529, 66.125),(4.538, 66.250),(4.548, 66.375),(4.557, 66.500),(4.566, 66.625),
(4.576, 66.750),(4.585, 66.875),(4.594, 67.000),(4.604, 67.125),(4.613, 67.250),(4.622, 67.375),(4.632, 67.500),
(4.641, 67.625),(4.650, 67.750),(4.660, 67.875),(4.669, 68.000),(4.678, 68.125),(4.687, 68.250),(4.696, 68.375),
(4.706, 68.500),(4.715, 68.625),(4.724, 68.750),(4.733, 68.875),(4.742, 69.000),(4.752, 69.125),(4.761, 69.250),
(4.770, 69.375),(4.779, 69.500),(4.788, 69.625),(4.797, 69.750),(4.806, 69.875),(4.815, 70.000),(4.824, 70.125),
(4.833, 70.250),(4.842, 70.375),(4.851, 70.500),(4.860, 70.625),(4.869, 70.750),(4.878, 70.875),(4.887, 71.000),
(4.896, 71.125),(4.905, 71.250),(4.914, 71.375),(4.923, 71.500),(4.932, 71.625),(4.940, 71.750),(4.949, 71.875),
(4.958, 72.000),(4.967, 72.125),(4.976, 72.250),(4.984, 72.375),(4.993, 72.500),(5.002, 72.625),(5.011, 72.750),
(5.019, 72.875),(5.028, 73.000),(5.037, 73.125),(5.045, 73.250),(5.054, 73.375),(5.063, 73.500),(5.071, 73.625),
(5.080, 73.750),(5.088, 73.875),(5.097, 74.000),(5.105, 74.125),(5.114, 74.250),(5.123, 74.375),(5.131, 74.500),
(5.139, 74.625),(5.148, 74.750),(5.156, 74.875),(5.165, 75.000),(5.173, 75.125),(5.182, 75.250),(5.190, 75.375),
(5.198, 75.500),(5.207, 75.625),(5.215, 75.750),(5.223, 75.875),(5.231, 76.000),(5.240, 76.125),(5.248, 76.250),
(5.256, 76.375),(5.264, 76.500),(5.273, 76.625),(5.281, 76.750),(5.289, 76.875),(5.297, 77.000),(5.305, 77.125),
(5.313, 77.250),(5.321, 77.375),(5.329, 77.500),(5.337, 77.625),(5.345, 77.750),(5.353, 77.875),(5.361, 78.000),
(5.369, 78.125),(5.377, 78.250),(5.385, 78.375),(5.393, 78.500),(5.401, 78.625),(5.408, 78.750),(5.416, 78.875),
(5.424, 79.000),(5.432, 79.125),(5.439, 79.250),(5.447, 79.375),(5.455, 79.500),(5.463, 79.625),(5.470, 79.750),
(5.478, 79.875),(5.485, 80.000),(5.493, 80.125),(5.500, 80.250),(5.508, 80.375),(5.515, 80.500),(5.523, 80.625),
(5.530, 80.750),(5.538, 80.875),(5.545, 81.000),(5.553, 81.125),(5.560, 81.250),(5.567, 81.375),(5.575, 81.500),
(5.582, 81.625),(5.589, 81.750),(5.596, 81.875),(5.604, 82.000),(5.611, 82.125),(5.618, 82.250),(5.625, 82.375),
(5.632, 82.500),(5.639, 82.625),(5.646, 82.750),(5.653, 82.875),(5.660, 83.000),(5.667, 83.125),(5.674, 83.250),
(5.681, 83.375),(5.688, 83.500),(5.695, 83.625),(5.701, 83.750),(5.708, 83.875),(5.715, 84.000),(5.722, 84.125),
(5.728, 84.250),(5.735, 84.375),(5.741, 84.500),(5.748, 84.625),(5.755, 84.750),(5.761, 84.875),(5.768, 85.000),
(5.774, 85.125),(5.781, 85.250),(5.787, 85.375),(5.793, 85.500),(5.800, 85.625),(5.806, 85.750),(5.812, 85.875),
(5.818, 86.000),(5.825, 86.125),(5.831, 86.250),(5.837, 86.375),(5.843, 86.500),(5.849, 86.625),(5.855, 86.750),
(5.861, 86.875),(5.867, 87.000),(5.873, 87.125),(5.879, 87.250),(5.885, 87.375),(5.890, 87.500),(5.896, 87.625),
(5.902, 87.750),(5.908, 87.875),(5.913, 88.000),(5.919, 88.125),(5.924, 88.250),(5.930, 88.375),(5.935, 88.500),
(5.941, 88.625),(5.946, 88.750),(5.952, 88.875),(5.957, 89.000),(5.962, 89.125),(5.967, 89.250),(5.973, 89.375),
(5.978, 89.500),(5.983, 89.625),(5.988, 89.750),(5.993, 89.875),(5.998, 90.000),(6.003, 90.125),(6.008, 90.250),
(6.012, 90.375),(6.017, 90.500),(6.022, 90.625),(6.026, 90.750),(6.031, 90.875),(6.036, 91.000),(6.040, 91.125),
(6.044, 91.250),(6.049, 91.375),(6.053, 91.500),(6.057, 91.625),(6.062, 91.750),(6.066, 91.875),(6.070, 92.000),
(6.074, 92.125),(6.078, 92.250),(6.082, 92.375),(6.086, 92.500),(6.089, 92.625),(6.093, 92.750),(6.097, 92.875),
(6.100, 93.000),(6.104, 93.125),(6.107, 93.250),(6.111, 93.375),(6.114, 93.500),(6.117, 93.625),(6.120, 93.750),
(6.123, 93.875),(6.126, 94.000),(6.129, 94.125),(6.132, 94.250),(6.135, 94.375),(6.137, 94.500),(6.140, 94.625),
(6.142, 94.750),(6.144, 94.875),(6.146, 95.000),(6.148, 95.125),(6.150, 95.250),(6.152, 95.375),(6.153, 95.500),
(6.155, 95.625),(6.156, 95.750),(6.157, 95.875),(6.157, 96.000);


ALTER TABLE user_roles ADD COLUMN agregar_pagos_cuadre character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN agregar_campos_dinamicos_cuadre character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN agregar_depositos_cuadre character(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE user_roles ADD COLUMN acciones_servicio character(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE pump_closed_smart_enhanced
  OWNER TO postgres;

ALTER TABLE user_roles ADD COLUMN cierres_automaticos character(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE ssf_datos_cliente ADD COLUMN ruta_exportacion_consultaventas character varying(150)
NOT NULL DEFAULT 'C:\\Users\\POS0000\\Documents\\ExportacionSpirit\\Consultas';

ALTER TABLE cuadre_bombero ALTER COLUMN campos_dinamicos TYPE varchar(1000000);
ALTER TABLE cuadre_bombero ALTER COLUMN pagos TYPE varchar(1000000);
ALTER TABLE cuadre_bombero ALTER COLUMN ventas TYPE varchar(1000000);
ALTER TABLE cuadre_bombero ALTER COLUMN monto_dinamicos TYPE varchar(1000000);


ALTER TABLE user_roles ADD COLUMN eliminar_deposito character(2) NOT NULL DEFAULT 'NO'::bpchar;

/*Tabla proceso de cierre automatico*/
CREATE TABLE pump_closed_smart_enhanced
(
  id_registro serial NOT NULL,
  configuraciones_pump_data character varying(1000000) NOT NULL,
  mes character varying(100) NOT NULL,
  tipo_cierre character varying(100) NOT NULL,
  fecha_registro character varying(1000) NOT NULL
);

ALTER TABLE pagos ADD COLUMN placa character varying(100);


ALTER TABLE pagos ADD COLUMN sale_id integer;

ALTER TABLE ssf_ncf DROP constraint pk_prefijo;
ALTER TABLE ssf_ncf RENAME prefijo TO serie;
UPDATE ssf_ncf SET serie='A';
ALTER TABLE ssf_ncf ALTER COLUMN serie TYPE character varying(1);

ALTER TABLE ssf_facturas_comprobantes
ALTER COLUMN placa_vehiculo TYPE character varying(15);


ALTER TABLE depositos
ADD COLUMN cuadre_id character varying(200) default NULL;

ALTER TABLE pagos
ADD COLUMN cuadre_id character varying(200) default NULL;

/*SOLO EJECUTAR ESTOS SCRIPTS DESPUES DE HABER EJECUTADO LA MIGRACION DE LA BD http://localhost:51276/api/Migraciones/migrarCuadreNuevaEstructura*/


ALTER TABLE cuadre_bombero DROP COLUMN pagos;
ALTER TABLE cuadre_bombero DROP COLUMN depositos;

ALTER TABLE ssf_datos_cliente ADD COLUMN sucursal character varying(200) default 'no';
ALTER TABLE ssf_ncf ADD COLUMN expiration_date character varying(200);

/*Cambios a partir del 14 de mayo*/
CREATE TABLE scheduled_period_report
(
  id serial NOT NULL,
  start_date character varying(100) NOT NULL,
  end_date character varying(100) NOT NULL,
  register_date character varying(100) NOT NULL,
  initial_shift integer,
  final_shift integer,
  reference_shift character varying(2) NOT NULL,
  CONSTRAINT pk_scheduled_period_report PRIMARY KEY (id)
);
ALTER TABLE scheduled_period_report
  OWNER TO postgres;

CREATE TABLE proccessed_period_report
(
  id serial NOT NULL,
  id_scheduled_period_report integer NOT NULL,
  proccessed_date character varying(100) NOT NULL,
  CONSTRAINT pk_proccessed_period_report PRIMARY KEY (id),
  CONSTRAINT fk_proccessed_pr_scheduled_pr FOREIGN KEY (id_scheduled_period_report)
      REFERENCES scheduled_period_report (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);
ALTER TABLE proccessed_period_report
  OWNER TO postgres;

CREATE TABLE scheduled_period_reporte_detalle
(
  id serial NOT NULL,
  turno integer NOT NULL,
  start_date character varying(30) NOT NULL,
  start_time character varying(30) NOT NULL,
  end_date character varying(30) NOT NULL,
  end_time character varying(30) NOT NULL,
  numero_turno integer NOT NULL,
  id_scheduled_period_report integer NOT NULL
);

CREATE TABLE scheduled_period_reporte_turno
(
  pump_id integer NOT NULL DEFAULT 0,
  hose_id integer NOT NULL DEFAULT 0,
  grade_id integer NOT NULL DEFAULT 0,
  tkt_plu_long_desc character varying,
  initial_volume double precision DEFAULT 0,
  final_volume double precision DEFAULT 0,
  start_date character varying,
  start_time character varying,
  end_date character varying,
  end_time character varying,
  ppu double precision DEFAULT 0,
  id_relacion integer DEFAULT 0,
  secuencia character varying(100) DEFAULT 0,
  id_turno numeric DEFAULT 0,
  periods_type_id integer NOT NULL DEFAULT 0,
  id_usuario character varying(20),
  id_scheduled_period_report integer NOT NULL
);

CREATE TABLE scheduled_period_resumes_productos_turno
(
  id serial NOT NULL,
  turno integer NOT NULL,
  producto character varying(100) NOT NULL,
  volumen double precision NOT NULL,
  monto double precision NOT NULL,
  id_scheduled_period_report integer NOT NULL
);

CREATE TABLE report_settings
(
  id serial NOT NULL,
  field varchar,
  report varchar,
  enabled bool,
  CONSTRAINT report_settings_pkey PRIMARY KEY (id)
)
WITHOUT OIDS;
ALTER TABLE report_settings OWNER TO postgres;

ALTER TABLE ssf_ncf ADD COLUMN expiration_date

INSERT INTO report_settings (field, report, enabled) VALUES ('lado', 'ComprobanteVenta', true), ('bombero', 'ComprobanteVenta', true), ('manguera', 'ComprobanteVenta', true);

ALTER TABLE user_roles ADD COLUMN editar_apertura_cerrada character(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE user_roles ADD COLUMN prices_changes character(2) NOT NULL DEFAULT 'NO'::bpchar;

DELETE FROM ssf_reportes_pump_sales v
where
(select count(*) from ssf_reportes_pump_sales where sale_id=v.sale_id) > 1;

ALTER TABLE ssf_reportes_pump_sales ADD constraint  pk_ssf_reportes_pump_sales Primary Key(sale_id);

CREATE TABLE over_clientes_fidelizados(
  id serial NOT NULL,
  codigo character varying(20) NOT NULL,
  nombre character varying(200) NOT NULL
);
CREATE TABLE over_fidelizaciones(
  id serial NOT NULL,
  codigo character varying(20) NOT NULL,
  sale_id integer NOT NULL,
  ncf character varying(100),
  pay_id character varying(100)
);

ALTER TABLE user_roles ADD COLUMN clientes_fidelizados character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN suppress_voucher character(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE ssf_datos_cliente ADD COLUMN ruta_exportacion_pagos varchar default 'C:\\';
ALTER TABLE ssf_datos_cliente ADD COLUMN ruta_exportacion_depositos varchar default 'C:\\';
ALTER TABLE ssf_datos_cliente ADD COLUMN ruta_exportacion_cuadres varchar default 'C:\\';

ALTER TABLE user_roles ADD COLUMN exportar_listados character(2) NOT NULL DEFAULT 'NO'::bpchar;


ALTER TABLE ssf_datos_cliente ADD COLUMN tamano_ticket_venta varchar default 'M';
ALTER TABLE ssf_datos_cliente ADD COLUMN tamano_ticket_comprobante varchar default 'M';
ALTER TABLE ssf_datos_cliente ADD COLUMN tamano_ticket_apertura varchar default 'M';
ALTER TABLE ssf_datos_cliente ADD COLUMN tamano_ticket_cierre_dispensador varchar default 'M';
ALTER TABLE ssf_datos_cliente ADD COLUMN tamano_ticket_cierre_lado varchar default 'M';

ALTER TABLE ssf_datos_cliente ADD COLUMN tamano_ticket_pumpTablet varchar default 'M';
ALTER TABLE ssf_datos_cliente ADD COLUMN tamano_ticket_deposito varchar default 'M';
ALTER TABLE ssf_datos_cliente ADD COLUMN tamano_ticket_facturacion varchar default 'M';

ALTER TABLE aplicacion_cierre_lados ADD COLUMN id_registro_pump_closed_smart character varying(100) NULL;

/*CAmbios a partir del 24 de julio*/

ALTER TABLE pump_closed_smart_enhanced ADD COLUMN cerrar_pasado_fecha boolean default false NOT NULL;
ALTER TABLE aplicacion_cierre_lados ADD COLUMN cerrar_pasado_fecha boolean default false NOT NULL;
ALTER TABLE aplicacion_cierre_lados ADD COLUMN is_type_unico boolean default false NOT NULL;
ALTER TABLE ssf_facturas_comprobantes ADD COLUMN anulado boolean NOT NULL DEFAULT false;
ALTER TABLE ssf_facturas_comprobantes ADD COLUMN Turno numeric NOT NULL DEFAULT 0;
ALTER TABLE user_roles ADD COLUMN is_bombero char(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN modify_voucher char(2) NOT NULL DEFAULT 'NO'::bpchar;


ALTER TABLE actual_reporte_detalle ADD COLUMN fecha_generacion character varying(100) DEFAULT '' NOT NULL;


CREATE TABLE reporte_mes_info(
	id serial NOT NULL PRIMARY KEY,
	producto character varying(100) not null,
	volumen double precision not null,
	monto double precision not null,
	dia character varying(50) not null,
	dia_numero integer not null,
	mes_numero integer not null,
	ano_numero integer not null

);

CREATE TABLE pumps_informations_details(
  id serial NOT NULL PRIMARY KEY,
  fecha character varying(100) not null,
  log_detail character varying(900) not null,
  pump integer not null
);

/*SQL SERVER Scripts*/
 ALTER TABLE DGII_RNC ALTER COLUMN RNC varchar(500) NOT NULL;

  ALTER TABLE DGII_RNC
  ADD PRIMARY KEY (RNC);
/*SQL SERVER Scripts*/

ALTER TABLE apertura_turno_bombero RENAME turnos_anteriores TO turno_anterior;

ALTER TABLE apertura_turno_bombero RENAME turnos_en_fecha TO turno_actual;


ALTER TABLE apertura_turno_bombero add column secuencia SERIAL NOT NULL;


ALTER TABLE user_roles ADD COLUMN add_rnc char(2) NOT NULL DEFAULT 'NO'::bpchar;

CREATE TABLE pagos_eliminados
(
  id varchar(200) NOT NULL,
  fecha_pago varchar(20) NOT NULL,
  metodo_pago varchar(200),
  dato_otro varchar(200),
  tipo_otro varchar(200),
  bombero varchar(200),
  money numeric,
  venta_sistema varchar(3000),
  venta_fabricada varchar(3000),
  tarjeta varchar(4),
  placa varchar(100),
  turno int4 NOT NULL DEFAULT 0,
  sale_id int4,
  cuadre_id varchar(200) DEFAULT NULL::character varying,
  CONSTRAINT pk_pagos_eliminados PRIMARY KEY (id)
)
WITHOUT OIDS;
ALTER TABLE pagos_eliminados OWNER TO postgres;


/* Tabla clientes fidelizados nuevos campos. 6 Octubre 2018 */
ALTER TABLE over_clientes_fidelizados RENAME COLUMN nombre TO nombres;
ALTER TABLE over_clientes_fidelizados ADD COLUMN apellidos character varying(200);
ALTER TABLE over_clientes_fidelizados ALTER COLUMN apellidos SET NOT NULL;
ALTER TABLE over_clientes_fidelizados ADD COLUMN cedula character varying(200);
ALTER TABLE over_clientes_fidelizados ADD COLUMN pasaporte character varying(200);

/* Tabla roles de usuario nuevo permiso configuracion_puntajes_fidelidad. 8 Octubre 2018 */
ALTER TABLE user_roles ADD COLUMN configuracion_puntajes_fidelidad char(2) NOT NULL DEFAULT 'NO'::bpchar;

/* Nueva tabla configuraciones puntajes fidelidad. 8 Octubre 2018 */
CREATE TABLE over_configuraciones_puntajes_fidelidad
(
  id serial NOT NULL,
  por_galones boolean NOT NULL DEFAULT false,
  por_precio boolean NOT NULL DEFAULT false,
  parametro_modalidad numeric NOT NULL DEFAULT 0,
  puntos numeric NOT NULL DEFAULT 0,
  activa boolean NOT NULL DEFAULT false,
  CONSTRAINT over_configuraciones_puntajes_fidelidad_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE

/* Nuevo campo tabla configuraciones puntajes fidelidad. 8 Octubre 2018 */
ALTER TABLE over_configuraciones_puntajes_fidelidad ADD COLUMN latest boolean;
ALTER TABLE over_configuraciones_puntajes_fidelidad ALTER COLUMN latest SET NOT NULL;
ALTER TABLE over_configuraciones_puntajes_fidelidad ALTER COLUMN latest SET DEFAULT false;

/* Nueva tabla de puntos de fidelizacion. 9 Octubre 2018 */
CREATE TABLE over_puntos_fidelizacion
(
  id serial NOT NULL,
  cliente_codigo character varying(20),
  venta_sistema character varying(3000),
  configuracion_puntajes_fidelidad character varying(3000),
  puntos numeric,
  CONSTRAINT over_puntos_fidelizacion_pkey PRIMARY KEY (id)
);

/* Modificacion campo cliente_codigo en tabla de puntos de fidelizacion. 10 Octubre 2018 */
ALTER TABLE over_puntos_fidelizacion RENAME COLUMN cliente_codigo TO cliente_info;
ALTER TABLE over_puntos_fidelizacion ALTER COLUMN cliente_info TYPE character varying(3000);

ALTER TABLE user_roles ADD COLUMN bombero_open_more_than_one_turn char(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN add_hour_after_a_pump_can_be_close char(2) NOT NULL DEFAULT 'NO'::bpchar;
----
CREATE TABLE hours_can_close_pumps
(
  id integer NOT NULL DEFAULT nextval('hours_can_close_pumps_id_seq'::regclass),
  hour integer DEFAULT 0,
  CONSTRAINT hours_can_close_pumps_pkey PRIMARY KEY (id)
);

ALTER TABLE user_roles ADD COLUMN add_rnc char(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE pagos ADD COLUMN turno int default 0;

ALTER TABLE SSF_DATOS_CLIENTE ADD COLUMN ruta_exportacion_reporte_venta_tipo_pago CHARACTER VARYING(150);

CREATE TABLE pagos_eliminados
(
  id varchar(200) NOT NULL,
  fecha_pago varchar(20) NOT NULL,
  metodo_pago varchar(200),
  dato_otro varchar(200),
  tipo_otro varchar(200),
  bombero varchar(200),
  money numeric,
  venta_sistema varchar(3000),
  venta_fabricada varchar(3000),
  tarjeta varchar(4),
  placa varchar(100),
  sale_id int4,
  cuadre_id varchar(200) DEFAULT NULL::character varying,
  CONSTRAINT pk_pagos_eliminados PRIMARY KEY (id)
)
WITHOUT OIDS;
ALTER TABLE pagos_eliminados OWNER TO postgres;

ALTER TABLE pagos ADD COLUMN turno INT;

CREATE TABLE depositos_eliminados
(
  codigo varchar(200) NOT NULL,
  bombero varchar(200) NOT NULL,
  monto float8 NOT NULL,
  fecha varchar(20),
  codigo_deposito int,
  bombero_id int4 NOT NULL,
  cuadre_id varchar(200),
  turno int4 NOT NULL DEFAULT 0,
  CONSTRAINT pk_depositos_eliminados PRIMARY KEY (codigo)
);

CREATE TABLE hours_can_close_pumps
(
  id serial,
  hour integer DEFAULT 0,
  CONSTRAINT hours_can_close_pumps_pkey PRIMARY KEY (id)
);

ALTER TABLE user_roles ADD COLUMN bombero_open_more_than_one_turn char(2) NOT NULL DEFAULT 'NO'::bpchar;
--Fidelidad permissions
ALTER TABLE user_roles ADD COLUMN incentivos char(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN empleados char(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN flotillas char(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN reimprimir_codigo_cliente_fidelizado char(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE user_roles ADD COLUMN add_hour_after_a_pump_can_be_close char(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE ssf_datos_cliente ADD COLUMN ruta_exportacion_reporte_venta_tipo_pago varchar(150)
NOT NULL DEFAULT 'C:\\Users\\POS0000\\Documents\\ExportacionSpirit\\Comprobantes';

ALTER TABLE pagos ADD COLUMN cliente varchar (50) NOT NULL DEFAULT '';
ALTER TABLE pagos ADD COLUMN rnc varchar (50) NOT NULL DEFAULT '';

CREATE TABLE credit_users (id serial primary key, qrCode varchar(75), barCode varchar(75), countryIdCode varchar(75),
                          RNC varchar (75), companyName varchar(75),
                          isActive boolean NOT NULL DEFAULT true );



/* Se agrega columna cliente_codigo en tabla de puntos de fidelizacion. 18 Octubre 2018 */
ALTER TABLE over_puntos_fidelizacion ADD COLUMN cliente_codigo character varying(20);
ALTER TABLE over_puntos_fidelizacion ALTER COLUMN cliente_codigo SET NOT NULL;

/* Se agrega campos fidelizacion y canje a tabla de configuracion de puntajes de fidelidad. 21 Octubre 2018 */
ALTER TABLE over_configuraciones_puntajes_fidelidad ADD COLUMN fidelizacion boolean;
ALTER TABLE over_configuraciones_puntajes_fidelidad ALTER COLUMN fidelizacion SET NOT NULL;
ALTER TABLE over_configuraciones_puntajes_fidelidad ALTER COLUMN fidelizacion SET DEFAULT false;

ALTER TABLE over_configuraciones_puntajes_fidelidad ADD COLUMN canje boolean;
ALTER TABLE over_configuraciones_puntajes_fidelidad ALTER COLUMN canje SET NOT NULL;
ALTER TABLE over_configuraciones_puntajes_fidelidad ALTER COLUMN canje SET DEFAULT false;

/* Se agrega tabla incentivos. 24 Octubre 2018 */
CREATE TABLE over_incentivos
(
  id serial NOT NULL,
  nombre character varying(100) NOT NULL,
  tipo character varying(20) NOT NULL,
  puntos numeric NOT NULL,
  canjeado boolean NOT NULL DEFAULT false,
  codigo character varying(20) NOT NULL,
  CONSTRAINT over_incentivos_pkey PRIMARY KEY (id)
);

/* Se agrega primary key en tabla de clientes fidelizados, permisos incentivos y reimprimir codigo cliente fidelizado; y campo codigo impreso en tabla clientes fidelizados. 28 Octubre 2018 */
ALTER TABLE over_clientes_fidelizados
  ADD CONSTRAINT over_clientes_fidelizados_pkey PRIMARY KEY(id);

ALTER TABLE user_roles ADD COLUMN incentivos char(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN reimprimir_codigo_cliente_fidelizado char(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE over_clientes_fidelizados ADD COLUMN codigo_impreso boolean;
ALTER TABLE over_clientes_fidelizados ALTER COLUMN codigo_impreso SET NOT NULL;
ALTER TABLE over_clientes_fidelizados ALTER COLUMN codigo_impreso SET DEFAULT false;

/* Se agrega tabla empleados y permiso empleados. 28 Octubre 2018 */
CREATE TABLE over_empleados
(
  id serial NOT NULL,
  nombre character varying(50) NOT NULL,
  cedula character varying(20) NOT NULL,
  departamento character varying(20) NOT NULL,
  codigo character varying(10) NOT NULL,
  CONSTRAINT over_empleados_pkey PRIMARY KEY (id)
);

ALTER TABLE user_roles ADD COLUMN empleados char(2) NOT NULL DEFAULT 'NO'::bpchar;

/* Se agrega tabla flotillas y permiso flotillas. 28 Octubre 2018 */
CREATE TABLE over_flotillas
(
  id serial NOT NULL,
  nombre character varying(30) NOT NULL,
  codigo character varying(10) NOT NULL,
  CONSTRAINT over_flotillas_pkey PRIMARY KEY (id)
);

ALTER TABLE user_roles ADD COLUMN flotillas char(2) NOT NULL DEFAULT 'NO'::bpchar;

/* Se elimina tabla fidelizaciones y se agrega campo fecha_fidelizacion a tabla clientes fidelizados. 10 Noviembre 2018 */
DROP TABLE over_fidelizaciones;

ALTER TABLE over_clientes_fidelizados ADD COLUMN fecha_fidelizacion date NOT NULL DEFAULT now();

/* Se agrega permiso reporte_nuevos_clientes_fidelizados. 13 Noviembre 2018 */
ALTER TABLE user_roles ADD COLUMN reporte_nuevos_clientes_fidelizados character(2) NOT NULL DEFAULT 'NO'::bpchar;

/* Se agrega campo tipo_cliente a tabla clientes fidelizados. 14 Noviembre 2018 */
ALTER TABLE over_clientes_fidelizados ADD COLUMN tipo_cliente character varying(500);

/* Cambios logica configuraciones puntajes de fidelidad segun el cliente. 15 Noviembre 2018 */
ALTER TABLE over_configuraciones_puntajes_fidelidad DROP COLUMN latest;
ALTER TABLE over_configuraciones_puntajes_fidelidad ADD COLUMN minimo_consumido numeric NOT NULL DEFAULT 0;
ALTER TABLE over_clientes_fidelizados DROP COLUMN tipo_cliente;
ALTER TABLE over_clientes_fidelizados ADD COLUMN tipo_cliente character varying(100) NOT NULL DEFAULT 'Cliente normal'::character varying;
ALTER TABLE over_configuraciones_puntajes_fidelidad ADD COLUMN tipo_cliente character varying(100) NOT NULL DEFAULT 'Cliente normal'::character varying;

/* Se agregan campos resto y fecha_vencimiento en tabla puntos de fidelizacion y se modifica tabla clientes fidelizados. 17 Noviembre 2018 */
ALTER TABLE over_puntos_fidelizacion ADD COLUMN resto numeric NOT NULL DEFAULT 0;
ALTER TABLE over_puntos_fidelizacion ADD COLUMN fecha_vencimiento date NOT NULL DEFAULT (now() + '30 days'::interval);

DROP TABLE over_clientes_fidelizados;
CREATE TABLE over_clientes_fidelizados
(
  id serial NOT NULL,
  codigo character varying(20) NOT NULL,
  nombres character varying(50) NOT NULL,
  apellidos character varying(50) NOT NULL,
  cedula character varying(20),
  pasaporte character varying(20),
  codigo_impreso boolean NOT NULL DEFAULT false,
  fecha_fidelizacion date NOT NULL DEFAULT now(),
  tipo_cliente character varying(100) NOT NULL DEFAULT 'Cliente normal'::character varying,
  CONSTRAINT over_clientes_fidelizados_pkey PRIMARY KEY (id)
);

/* Se elimina campo activa en tabla configuraciones puntajes de fidelidad. 18 Noviembre 2018 */
ALTER TABLE over_configuraciones_puntajes_fidelidad DROP COLUMN activa;

CREATE TABLE counted_payments
(
  id varchar(200) NOT NULL,
  fecha_pago varchar(20) NOT NULL,
  metodo_pago varchar(200),
  dato_otro varchar(200),
  tipo_otro varchar(200),
  bombero varchar(200),
  money numeric,
  venta_sistema varchar(3000),
  venta_fabricada varchar(3000),
  tarjeta varchar(4),
  placa varchar(100),
  sale_id int4,
  cuadre_id varchar(200) DEFAULT NULL::character varying,
  turno int,
  cliente varchar(200)

  CONSTRAINT pk_counted_payments PRIMARY KEY (id)
);

ALTER TABLE over_empleados ADD COLUMN   qr_code character varying(75);
ALTER TABLE over_empleados ADD COLUMN  bar_code character varying(75);
ALTER TABLE over_empleados ADD COLUMN countryidcode character varying(75);
ALTER TABLE over_clientes_fidelizados ADD COLUMN   qr_code character varying(75);
ALTER TABLE over_clientes_fidelizados ADD COLUMN  bar_code character varying(75);
ALTER TABLE over_clientes_fidelizados ADD COLUMN countryidcode character varying(75);

ALTER TABLE user_roles ADD COLUMN tpo_pago_contado boolean not null default false;

ALTER TABLE counted_payments ADD COLUMN turno int;

ALTER TABLE counted_payments ADD COLUMN cliente varchar(200);

ALTER TABLE counted_payments ADD COLUMN rnc varchar(50);


CREATE TABLE over_tipos_clientes_fidelizados
(
id serial NOT NULL,
tipo_cliente character varying(1000),
isActive boolean not null default true
);

CREATE TABLE over_clientes_fidelizados
(
  id serial NOT NULL ,
  codigo character varying(20) NOT NULL,
  nombres character varying(50) NOT NULL,
  apellidos character varying(50) NOT NULL,
  cedula character varying(20),
  pasaporte character varying(20),
  codigo_impreso boolean NOT NULL DEFAULT false,
  fecha_fidelizacion date NOT NULL DEFAULT now(),
  tipo_cliente character varying(100) NOT NULL DEFAULT 'Cliente normal'::character varying,
  id_tipo_cliente integer not null,
  qr_code character varying(75),
  bar_code character varying(75),
  countryidcode character varying(75),
  cantidad_de_galones integer NOT NULL DEFAULT 0,
  CONSTRAINT over_clientes_fidelizados_pkey PRIMARY KEY (id)
);


CREATE TABLE over_configuraciones_puntajes_fidelidad
(
  id serial NOT NULL,
  por_galones boolean NOT NULL DEFAULT false,
  por_precio boolean NOT NULL DEFAULT false,
  parametro_modalidad numeric NOT NULL DEFAULT 0,
  puntos numeric NOT NULL DEFAULT 0,
  fidelizacion boolean NOT NULL DEFAULT false,
  canje boolean NOT NULL DEFAULT false,
  minimo_consumido numeric NOT NULL DEFAULT 0,
  tipo_cliente character varying(100) NOT NULL DEFAULT 'Cliente normal'::character varying,
    id_tipo_cliente integer not null,
  CONSTRAINT over_configuraciones_puntajes_fidelidad_pkey PRIMARY KEY (id)
);

INSERT INTO over_tipos_clientes_fidelizados (tipo_cliente) values('incentivo')

ALTER TABLE medidas_tanque ADD COLUMN turno int;
ALTER TABLE medidas_tanque ADD COLUMN profundidad float;

alter table over_clientes_fidelizados add column cantidad_de_galones int not null default 0;

CREATE TABLE over_clientes_fidelizados_temp
(
  id serial,
  codigo varchar(20) NOT NULL,
  nombres varchar(50) NOT NULL,
  apellidos varchar(50) NOT NULL,
  cedula varchar(20),
  pasaporte varchar(20),
  codigo_impreso bool NOT NULL DEFAULT false,
  fecha_fidelizacion date NOT NULL DEFAULT now(),
  tipo_cliente varchar(100) NOT NULL DEFAULT 'Cliente normal'::character varying,
  qr_code varchar(75),
  bar_code varchar(75),
  countryidcode varchar(75),
  cantidad_de_galones int not null default 0
);

CREATE TABLE over_ventas_fidelizacion
(
  Id serial,
  end_date varchar(9),
  end_time varchar(7),
  pump_id int4,
  hose_id int4,
  grade_id int4,
  volume float8,
  money float8,
  ppu float8,
  "level" int4,
  sale_type int4,
  initial_volume float8,
  final_volume float8,
  start_date varchar(9),
  start_time varchar(7),
  preset_amount float8,
  sale_auth varchar(10),
  forma_pago varchar(15),
  bombero varchar(35),
  cedula_cliente varchar(11)
);

ALTER TABLE over_ventas_fidelizacion ADD COLUMN dato_otro varchar(15);
ALTER TABLE over_ventas_fidelizacion ADD COLUMN tipo_otro varchar(15);
ALTER TABLE over_ventas_fidelizacion ADD COLUMN tarjeta varchar(15);
ALTER TABLE over_ventas_fidelizacion ADD COLUMN placa varchar(15);

ALTER TABLE unitmeasure ADD COLUMN tank_id varchar REFERENCES ssf_tkt_plu (tkt_plu_id);

CREATE TABLE over_tipos_clientes_fidelizados
(
  id serial NOT NULL,
  tipo_cliente character varying(1000),
  isActive boolean not null default true
);

CREATE TABLE over_clientes_fidelizados
(
  id serial NOT NULL ,
  codigo character varying(20) NOT NULL,
  nombres character varying(50) NOT NULL,
  apellidos character varying(50) NOT NULL,
  cedula character varying(20),
  pasaporte character varying(20),
  codigo_impreso boolean NOT NULL DEFAULT false,
  fecha_fidelizacion date NOT NULL DEFAULT now(),
  tipo_cliente character varying(100) NOT NULL DEFAULT 'Cliente normal'::character varying,
  id_tipo_cliente integer not null,
  qr_code character varying(75),
  bar_code character varying(75),
  countryidcode character varying(75),
  cantidad_de_galones integer NOT NULL DEFAULT 0,
  CONSTRAINT over_clientes_fidelizados_pkey PRIMARY KEY (id)
);


CREATE TABLE over_configuraciones_puntajes_fidelidad
(
  id serial NOT NULL,
  por_galones boolean NOT NULL DEFAULT false,
  por_precio boolean NOT NULL DEFAULT false,
  parametro_modalidad numeric NOT NULL DEFAULT 0,
  puntos numeric NOT NULL DEFAULT 0,
  fidelizacion boolean NOT NULL DEFAULT false,
  canje boolean NOT NULL DEFAULT false,
  minimo_consumido numeric NOT NULL DEFAULT 0,
  tipo_cliente character varying(100) NOT NULL DEFAULT 'Cliente normal'::character varying,
    id_tipo_cliente integer not null,
  CONSTRAINT over_configuraciones_puntajes_fidelidad_pkey PRIMARY KEY (id)
);


INSERT INTO over_tipos_clientes_fidelizados (tipo_cliente) values('incentivo')


alter table medidas_tanque drop column Id;

alter table medidas_tanque add column Id serial not null;

CREATE TABLE cru_discount_by_category
(
id serial NOT NULL,
categoryname varchar(250),
discountpergalon float not null default 0,
isActive boolean not null default true
);

alter table medidas_tanque add column Id serial not null;

CREATE TABLE credit_users
(
  id serial NOT NULL,
  qrcode varchar(75),
  barcode varchar(75),
  countryidcode varchar(75),
  rnc varchar(75),
  companyname varchar(75),
  isactive bool NOT NULL DEFAULT true,
  discountCategory integer not null default 0,
  discountAmount float not null default 0,
  customerType varchar(15) not null default 'credito',

  CONSTRAINT credit_users_pkey PRIMARY KEY (id)
);


CREATE TABLE credit_users_discounts
(
id serial not null,
userid integer not null default 0,
saleid integer not null default 0,
date varchar(25),
amount float,
pendingamount float,
discountcategoryid integer not null default 0,
isCreditSale boolean not null default false,
turno integer not null default 0,
bombero varchar(100),
paymentId varchar not null default ''
)

ALTER TABLE pagos ADD COLUMN amount numeric default 0;

ALTER TABLE user_roles ADD COLUMN tpo_pago_contado_desc boolean not null default false;

ALTER TABLE pagos ADD COLUMN amount numeric default 0;
ALTER TABLE pagos_eliminados ADD COLUMN amount numeric default 0;

ALTER TABLE sales ADD COLUMN turno int default 0;
ALTER TABLE sales ADD COLUMN placa varchar default '';
ALTER TABLE sales ADD COLUMN cliente varchar default '';
ALTER TABLE sales ADD COLUMN rnc varchar default '';
ALTER TABLE based_reporte_turno ADD COLUMN id serial;


ALTER TABLE Product ADD COLUMN ITBIS BOOLEAN DEFAULT FALSE;

ALTER TABLE Pagos ADD COLUMN ITBIS int DEFAULT 0;
ALTER TABLE pagos_eliminados ADD COLUMN ITBIS int DEFAULT 0;

/** foreign key for prevent duplicate data in closed_pumps**/
CREATE UNIQUE INDEX fk_closed_pumps ON ssf_closed_pumps USING btree (close_id, pump_id);

ALTER TABLE ssf_closed_pumps ADD COLUMN start_sale_id int DEFAULT 0;
ALTER TABLE ssf_closed_pumps ADD COLUMN end_sale_id int DEFAULT 0;

ALTER TABLE historial_tanques ADD COLUMN volumen_manual float8 DEFAULT 0;
ALTER TABLE historial_tanques ADD COLUMN turno int4 DEFAULT 0;

ALTER TABLE aplicacion_cierre_dia DROP COLUMN lados;

CREATE TABLE PaymentCards (
	Id serial primary key,
	Description varchar(15)

);

ALTER TABLE sales ADD COLUMN turno int DEFAULT 0;
ALTER TABLE sales ADD COLUMN id serial;

ALTER TABLE sale_detail ADD COLUMN id serial;

ALTER TABLE user_roles ADD COLUMN debe_cerrar_todos_lados boolean not null default false;
ALTER TABLE user_roles ADD COLUMN autenticar_cierre_turno boolean not null default false;
ALTER TABLE user_roles ADD COLUMN manipulacion_ventas boolean not null default false;
ALTER TABLE user_roles ADD COLUMN creditos boolean not null default false;
ALTER TABLE user_roles ADD COLUMN cliente_creditos boolean not null default false;
ALTER TABLE user_roles ADD COLUMN pagos_creditos boolean not null default false;
ALTER TABLE user_roles ADD COLUMN pagos_contados boolean not null default false;
ALTER TABLE user_roles ADD COLUMN categoria_descuento boolean not null default false;

ALTER TABLE pagos ADD COLUMN verifone_type character varying(200);
ALTER TABLE pagos_eliminados ADD COLUMN verifone_type character varying(200);

CREATE TABLE Verifone (
	id serial primary key,
	verifone_type character varying(200)
);

CREATE TABLE credit_users_discounts
(
  id serial NOT NULL,
  userid int4 NOT NULL DEFAULT 0,
  saleid int4 NOT NULL DEFAULT 0,
  date varchar(25),
  amount float8,
  pendingamount float8,
  discountcategoryid int4 NOT NULL DEFAULT 0,
  iscreditsale bool NOT NULL DEFAULT false,
  turno int4 NOT NULL DEFAULT 0,
  bombero varchar(100),
  paymentid varchar NOT NULL DEFAULT ''::character varying
);

ALTER TABLE pagos ADD COLUMN payment_id serial;

ALTER TABLE credit_users ADD COLUMN discountAmount int;
ALTER TABLE credit_users ADD COLUMN discountCategory int;
ALTER TABLE credit_users ADD COLUMN categoryname varchar;
ALTER TABLE credit_users ADD COLUMN customerType varchar;

ALTER TABLE based_reporte_turno ADD COLUMN id serial;

ALTER TABLE user_roles ADD COLUMN multiple_tarjets character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN dashboard character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN verifone_type character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN close_any_pump character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN re_print_ticket_closed_pump character(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE ssf_lado_manguera ADD COLUMN producto varchar;

CREATE TABLE pump_tickets_closed (

id serial primary key,
data varchar,
shift int,
jockey varchar,
pumps varchar,
);

-- Dashboard trigger --
CREATE TABLE dashboard_data
(
  sales_info_total_sales float8 DEFAULT 0,
  sales_info_percentage float8 DEFAULT 0,
  volume_info_volume_total float8 DEFAULT 0,
  volume_info_today_volume_total float8 DEFAULT 0,
  volume_info_yesterday_volume_total float8 DEFAULT 0,
  volume_info_percentage float8 DEFAULT 0,
  money_info_money_total float8 DEFAULT 0,
  money_info_percentage float8 DEFAULT 0,
  id serial NOT NULL PRIMARY KEY,
  product varchar
);

ALTER TABLE dashboard_data ADD COLUMN period_time varchar DEFAULT 'DIA';
ALTER TABLE dashboard_data ADD COLUMN last_inserted_date date DEFAULT NOW()::date;

----------------------------------------------------------------------------------------------------------------------- FUELS ---------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO dashboard_data (product, period_time) VALUES ('TODOS', 'DIA');
INSERT INTO dashboard_data (product, period_time) VALUES ('GASOLINA VIP 100', 'DIA');
INSERT INTO dashboard_data (product, period_time) VALUES ('KEROSENE', 'DIA');
INSERT INTO dashboard_data (product, period_time) VALUES ('GASOIL OPTIMO', 'DIA');
INSERT INTO dashboard_data (product, period_time) VALUES ('GASOLINA PREMIUM', 'DIA');
INSERT INTO dashboard_data (product, period_time) VALUES ('GASOLINA REGULAR', 'DIA');

INSERT INTO dashboard_data (product, period_time) VALUES ('TODOS', 'SEMANA');
INSERT INTO dashboard_data (product, period_time) VALUES ('GASOLINA VIP 100', 'SEMANA');
INSERT INTO dashboard_data (product, period_time) VALUES ('KEROSENE', 'SEMANA');
INSERT INTO dashboard_data (product, period_time) VALUES ('GASOIL OPTIMO', 'SEMANA');
INSERT INTO dashboard_data (product, period_time) VALUES ('GASOLINA PREMIUM', 'SEMANA');
INSERT INTO dashboard_data (product, period_time) VALUES ('GASOLINA REGULAR', 'SEMANA');

INSERT INTO dashboard_data (product, period_time) VALUES ('TODOS', 'MES');
INSERT INTO dashboard_data (product, period_time) VALUES ('GASOLINA VIP 100', 'MES');
INSERT INTO dashboard_data (product, period_time) VALUES ('KEROSENE', 'MES');
INSERT INTO dashboard_data (product, period_time) VALUES ('GASOIL OPTIMO', 'MES');
INSERT INTO dashboard_data (product, period_time) VALUES ('GASOLINA PREMIUM', 'MES');
INSERT INTO dashboard_data (product, period_time) VALUES ('GASOLINA REGULAR', 'MES');
----------------------------------------------------------------------------------------------------------------------- FUELS ---------------------------------------------------------------------------------------------------------------------------------------------

---------------------------------------------------------------------------------------------------------------------------------- TRIGGER ------------------------------------------------------------------------------------------------------------------------------------------------------------
--- TODO: Refactor stored procedure with foreach---
CREATE OR REPLACE FUNCTION update_dashboard_function()
  RETURNS "trigger" AS
$BODY$

  DECLARE
    right_now date;
    last_insert_record date;
   BEGIN
	right_now := NOW()::date;
	last_insert_record := (SELECT last_inserted_date FROM dashboard_data WHERE product = 'TODOS' AND period_time = 'DIA' ORDER BY id DESC LIMIT 1);

-------------------------------------------------------------------------------------------------------------------------------- ALL ------------------------------------------------------------------------------------------------------------------------------------
      IF (last_insert_record = right_now) THEN
-----------
         UPDATE dashboard_data SET
          ---- Sale data ----
                sales_info_total_sales = (sales_info_total_sales + 1),
                sales_info_percentage = ((sales_info_total_sales / (SELECT COALESCE(( COUNT(sale_id) + 1),1) as total FROM ssf_reportes_pump_sales sps WHERE (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 day')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp) * 100)-100),
                ---- Volume data ----
                volume_info_volume_total = (volume_info_volume_total + new.volume),
                volume_info_yesterday_volume_total = (select COALESCE(SUM(sps.final_volume-sps.initial_volume),1) AS yesterday_volume FROM ssf_reportes_pump_sales sps WHERE (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '24.0001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '0.0001 hour')::timestamp),
                volume_info_today_volume_total = (select COALESCE(SUM(sps.final_volume-sps.initial_volume),1) AS today_volume FROM ssf_reportes_pump_sales sps WHERE (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp),
                volume_info_percentage = (((volume_info_today_volume_total / (volume_info_yesterday_volume_total + 1)) * 100) - 100),
                ---- Money data ----
                money_info_money_total = (SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp),
                money_info_percentage = ( ((SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp)) /(SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '24.0001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '0.0001 hour hour')::timestamp) * 100 ) - 100
                WHERE product = 'TODOS' AND period_time = 'DIA' AND last_inserted_date = CURRENT_DATE::timestamp;
      ELSE
          INSERT INTO dashboard_data (sales_info_total_sales, period_time, product, last_inserted_date)
          VALUES(1, 'DIA', 'TODOS', NOW()::date);

             INSERT INTO dashboard_data (sales_info_total_sales, period_time, product, last_inserted_date)
          VALUES(0, 'DIA', 'GASOLINA VIP 100', NOW()::date);

            INSERT INTO dashboard_data (sales_info_total_sales, period_time, product, last_inserted_date)
          VALUES(0, 'DIA', 'KEROSENE', NOW()::date);

            INSERT INTO dashboard_data (sales_info_total_sales, period_time, product, last_inserted_date)
          VALUES(0, 'DIA', 'GASOIL OPTIMO', NOW()::date);

          INSERT INTO dashboard_data (sales_info_total_sales, period_time, product, last_inserted_date)
          VALUES(0, 'DIA', 'GASOLINA PREMIUM', NOW()::date);

          INSERT INTO dashboard_data (sales_info_total_sales, period_time, product, last_inserted_date)
          VALUES(0, 'DIA', 'GASOLINA REGULAR', NOW()::date);
 END IF;
-----------
-------------------------------------------------------------------------------------------------------------------------------- ALL ------------------------------------------------------------------------------------------------------------------------------------


-------------------------------------------------------------------------------------------------------------------------------- GASOLINA VIP 100 ------------------------------------------------------------------------------------------------------------------------------------

	IF (NEW.producto = 'GASOLINA VIP 100') THEN

		IF (last_insert_record = right_now) THEN
		 UPDATE dashboard_data SET
          ---- Sale data ----
                sales_info_total_sales = (sales_info_total_sales + 1),
                sales_info_percentage = ((sales_info_total_sales / (SELECT COALESCE(( COUNT(sale_id) + 1),1) as total FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA VIP 100' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 day')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp) * 100)-100),
                ---- Volume data ----
                volume_info_volume_total = (volume_info_volume_total + new.volume),
                volume_info_yesterday_volume_total = (select COALESCE(SUM(sps.final_volume-sps.initial_volume),1) AS yesterday_volume FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA VIP 100' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '24.0001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '0.0001 hour')::timestamp),
                volume_info_today_volume_total = (select COALESCE(SUM(sps.final_volume-sps.initial_volume),1) AS today_volume FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA VIP 100' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp),
                volume_info_percentage = (((volume_info_today_volume_total / (volume_info_yesterday_volume_total + 1)) * 100) - 100),
                ---- Money data ----
                money_info_money_total = (SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA VIP 100' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp),
                money_info_percentage = ( ((SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA VIP 100' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp)) /(SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '24.0001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '0.0001 hour hour')::timestamp) * 100 ) - 100
                WHERE product = 'GASOLINA VIP 100' AND period_time = 'DIA' AND last_inserted_date = CURRENT_DATE::timestamp;

END IF;


	RETURN NEW;

-------------------------------------------------------------------------------------------------------------------------------- GASOLINA VIP 100 ------------------------------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------------------- KEROSENE ------------------------------------------------------------------------------------------------------------------------------------
	ELSEIF (NEW.producto = 'KEROSENE') THEN

		IF (last_insert_record = right_now) THEN
			 UPDATE dashboard_data SET
          ---- Sale data ----
                sales_info_total_sales = (sales_info_total_sales + 1),
                sales_info_percentage = ((sales_info_total_sales / (SELECT COALESCE(( COUNT(sale_id) + 1),1) as total FROM ssf_reportes_pump_sales sps WHERE producto = 'KEROSENE' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 day')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp) * 100)-100),
                ---- Volume data ----
                volume_info_volume_total = (volume_info_volume_total + new.volume),
                volume_info_yesterday_volume_total = (select COALESCE(SUM(sps.final_volume-sps.initial_volume),1) AS yesterday_volume FROM ssf_reportes_pump_sales sps WHERE producto = 'KEROSENE' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '24.0001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '0.0001 hour')::timestamp),
                volume_info_today_volume_total = (select COALESCE(SUM(sps.final_volume-sps.initial_volume),1) AS today_volume FROM ssf_reportes_pump_sales sps WHERE producto = 'KEROSENE' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp),
                volume_info_percentage = (((volume_info_today_volume_total / (volume_info_yesterday_volume_total + 1)) * 100) - 100),
                ---- Money data ----
                money_info_money_total = (SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE producto = 'KEROSENE' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp),
                money_info_percentage = ( ((SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE producto = 'KEROSENE' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp)) /(SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '24.0001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '0.0001 hour hour')::timestamp) * 100 ) - 100
                WHERE product = 'KEROSENE' AND period_time = 'DIA' AND last_inserted_date = CURRENT_DATE::timestamp;

    END IF;
-----------
	RETURN NEW;
-------------------------------------------------------------------------------------------------------------------------------- KEROSENE ------------------------------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------------------- GASOIL OPTIMO ------------------------------------------------------------------------------------------------------------------------------------
	ELSEIF(NEW.producto = 'GASOIL OPTIMO') THEN

		IF (last_insert_record = right_now) THEN
		 UPDATE dashboard_data SET
          ---- Sale data ----
                sales_info_total_sales = (sales_info_total_sales + 1),
                sales_info_percentage = ((sales_info_total_sales / (SELECT COALESCE(( COUNT(sale_id) + 1),1) as total FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOIL OPTIMO' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 day')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp) * 100)-100),
                ---- Volume data ----
                volume_info_volume_total = (volume_info_volume_total + new.volume),
                volume_info_yesterday_volume_total = (select COALESCE(SUM(sps.final_volume-sps.initial_volume),1) AS yesterday_volume FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOIL OPTIMO' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '24.0001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '0.0001 hour')::timestamp),
                volume_info_today_volume_total = (select COALESCE(SUM(sps.final_volume-sps.initial_volume),1) AS today_volume FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOIL OPTIMO' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp),
                volume_info_percentage = (((volume_info_today_volume_total / (volume_info_yesterday_volume_total + 1)) * 100) - 100),
                ---- Money data ----
                money_info_money_total = (SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOIL OPTIMO' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp),
                money_info_percentage = ( ((SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOIL OPTIMO' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp)) /(SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '24.0001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '0.0001 hour hour')::timestamp) * 100 ) - 100
                WHERE product = 'GASOIL OPTIMO' AND period_time = 'DIA' AND last_inserted_date = CURRENT_DATE::timestamp;
		END IF;
-----------
	RETURN NEW;
-------------------------------------------------------------------------------------------------------------------------------- GASOIL OPTIMO ------------------------------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------------------- GASOLINA PREMIUM ------------------------------------------------------------------------------------------------------------------------------------

	ELSEIF(NEW.producto = 'GASOLINA PREMIUM') THEN

		IF (last_insert_record = right_now) THEN
			 UPDATE dashboard_data SET
          ---- Sale data ----
                sales_info_total_sales = (sales_info_total_sales + 1),
                sales_info_percentage = ((sales_info_total_sales / (SELECT COALESCE(( COUNT(sale_id) + 1),1) as total FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA PREMIUM' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 day')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp) * 100)-100),
                ---- Volume data ----
                volume_info_volume_total = (volume_info_volume_total + new.volume),
                volume_info_yesterday_volume_total = (select COALESCE(SUM(sps.final_volume-sps.initial_volume),1) AS yesterday_volume FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA PREMIUM' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '24.0001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '0.0001 hour')::timestamp),
                volume_info_today_volume_total = (select COALESCE(SUM(sps.final_volume-sps.initial_volume),1) AS today_volume FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA PREMIUM' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp),
                volume_info_percentage = (((volume_info_today_volume_total / (volume_info_yesterday_volume_total + 1)) * 100) - 100),
                ---- Money data ----
                money_info_money_total = (SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA PREMIUM' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp),
                money_info_percentage = ( ((SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA PREMIUM' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp)) /(SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '24.0001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '0.0001 hour hour')::timestamp) * 100 ) - 100
                WHERE product = 'GASOLINA PREMIUM' AND period_time = 'DIA' AND last_inserted_date = CURRENT_DATE::timestamp;
		END IF;
-----------
	RETURN NEW;
-------------------------------------------------------------------------------------------------------------------------------- GASOLINA PREMIUM ------------------------------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------------------- GASOLINA REGULAR ------------------------------------------------------------------------------------------------------------------------------------
	ELSEIF(NEW.producto = 'GASOLINA REGULAR') THEN
		IF (last_insert_record = right_now) THEN
			 UPDATE dashboard_data SET
          ---- Sale data ----
                sales_info_total_sales = (sales_info_total_sales + 1),
                sales_info_percentage = ((sales_info_total_sales / (SELECT COALESCE(( COUNT(sale_id) + 1),1) as total FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA REGULAR' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 day')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp) * 100)-100),
                ---- Volume data ----
                volume_info_volume_total = (volume_info_volume_total + new.volume),
                volume_info_yesterday_volume_total = (select COALESCE(SUM(sps.final_volume-sps.initial_volume),1) AS yesterday_volume FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA REGULAR' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '24.0001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '0.0001 hour')::timestamp),
                volume_info_today_volume_total = (select COALESCE(SUM(sps.final_volume-sps.initial_volume),1) AS today_volume FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA REGULAR' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp),
                volume_info_percentage = (((volume_info_today_volume_total / (volume_info_yesterday_volume_total + 1)) * 100) - 100),
                ---- Money data ----
                money_info_money_total = (SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA REGULAR' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp),
                money_info_percentage = ( ((SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE producto = 'GASOLINA REGULAR' AND (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '0.00001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '23.9999 hour')::timestamp)) /(SELECT COALESCE(SUM(sps.money)) AS today_money FROM ssf_reportes_pump_sales sps WHERE (sps.start_date || ' ' || sps.start_time)::timestamp >= (CURRENT_DATE - interval '24.0001 hour')::timestamp AND (sps.start_date || ' ' || sps.start_time)::timestamp <= (CURRENT_DATE + interval '0.0001 hour hour')::timestamp) * 100 ) - 100
                WHERE product = 'GASOLINA REGULAR' AND period_time = 'DIA' AND last_inserted_date = CURRENT_DATE::timestamp;
END IF;
-----------
	END IF;
-------------------------------------------------------------------------------------------------------------------------------- GASOLINA REGULAR ------------------------------------------------------------------------------------------------------------------------------------


 RETURN NULL;
   END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;
ALTER FUNCTION update_dashboard_function() OWNER TO postgres;

---------------------------------------------------------------------------------------------------------------------------------- TRIGGER ------------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE TRIGGER ssf_reportes_pump_sales_trigger AFTER INSERT ON ssf_reportes_pump_sales
FOR EACH ROW EXECUTE PROCEDURE update_dashboard_function();

ALTER TABLE pagos_eliminados DROP CONSTRAINT id;
ALTER TABLE pagos_eliminados ADD COLUMN payment_id serial PRIMARY KEY;
ALTER TABLE counted_payments ADD COLUMN payment_id serial PRIMARY KEY;

ALTER TABLE ssf_facturas_comprobantes add column turno INT default 0;


ALTER TABLE cru_discount_by_category ADD COLUMN categorytype VARCHAR;

ALTER TABLE pagos ALTER COLUMN cliente DROP NOT NULL;
ALTER TABLE pagos ALTER COLUMN rnc DROP NOT NULL;


---------------------------------------UPDATE VALUES OF DEPOSITS TABLE----------------------------------------

DROP TABLE depositos1;

INSERT INTO depositos1(codigo, bombero,monto,fecha,codigo_deposito,bombero_id,turno,cuadre_id)
SELECT codigo, bombero,monto,fecha,CAST(codigo_deposito as integer),bombero_id,CAST(turno as integer),cuadre_id FROM depositos

DROP TABLE depositos;
SELECT * INTO depositos FROM depositos1;

---------------------------------------UPDATE VALUES OF DEPOSITS TABLE----------------------------------------

CREATE TABLE cuadre_user_relationship
(
  id serial NOT NULL,
  user_id varchar,
  cuadre_id varchar,
  last_try int4,
  date date DEFAULT (now())::date
);

ALTER TABLE ssf_datos_cliente ADD COLUMN ruta_exportacion_cuadre_pdf varchar(900) DEFAULT 'C:\\';
ALTER TABLE user_roles ADD COLUMN numberoftimecanedittally int DEFAULT 1;

ALTER TABLE user_roles ADD COLUMN open_close_pump character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN auth_deauth_pump character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN multiple_bills character(2) NOT NULL DEFAULT 'NO'::bpchar;
ALTER TABLE user_roles ADD COLUMN allow_user_insert_volume_and_price_in_multiple_bills character(2) NOT NULL DEFAULT 'NO'::bpchar;

ALTER TABLE tanks_volume ADD COLUMN lastMigratedSale int4 DEFAULT 0;

-- Need column in smart console service
ALTER TABLE ssf_generic_config_values ADD COLUMN id_d SERIAL;

CREATE TABLE shift_report
(
  id serial NOT NULL,
  shift integer NOT NULL,
  initial_volume double precision,
  final_volume double precision,
  product_price double precision,
  product character varying(100),
  pump_id integer,
  hose_id integer,
  amount_sold double precision,
  volume double precision,
  sale_id integer,
  CONSTRAINT shift_report_pkey PRIMARY KEY (id)
);

ALTER TABLE ssf_facturas_comprobantes ADD COLUMN ppu double precision DEFAULT 0;

ALTER TABLE cuadre_bombero ADD COLUMN total_descuento numeric default 0;

ALTER TABLE movimientos_tanque ADD COLUMN _id serial not null;

ALTER TABLE cuadre_bombero ADD COLUMN rate float8 DEFAULT 0;
ALTER TABLE cuadre_bombero ADD COLUMN eurorate float8 DEFAULT 0;
ALTER TABLE cuadre_bombero ADD COLUMN euroamount float8 DEFAULT 0;
ALTER TABLE cuadre_bombero ADD COLUMN dollarrate float8 DEFAULT 0;
ALTER TABLE cuadre_bombero ADD COLUMN dollaramount float8 DEFAULT 0;

INSERT INTO coinrate (coinname, rate) VALUES
--('Dollar', 56)
('Euro', 56);


ALTER TABLE movimientos_tanque ADD COLUMN _id SERIAL;

ALTER TABLE medidas_tanque DROP COLUMN id;
ALTER TABLE medidas_tanque ADD COLUMN id serial;

ALTER TABLE pagos ALTER COLUMN id TYPE character varying(200);
ALTER TABLE pagos ALTER COLUMN id TYPE character varying(200);
