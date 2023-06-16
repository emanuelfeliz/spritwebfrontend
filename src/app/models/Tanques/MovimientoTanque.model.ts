import { EstadoTanque } from "app/models/Tanques/EstadoTanque.model";

export class MovimientoTanque{
    public constructor(
        public id:string,
        public num_factura:number,
        public id_tanque:number,
        public tanque:string,
        public bombero:string,
        public id_bombero:number,
        public volumen_movimiento:number,
        public volumen_anterior:number,
        public tipo_factura:string,
        public producto:string,
        public aumentando:boolean,
        public fecha:string
    ){}
}