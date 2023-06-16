import { VentaConsultaNueva } from "./VentaConsultaNueva.model";

export class resultConsultaVenta{
    public constructor(
        public ventas:Array<VentaConsultaNueva>,
        public cantidad:number,
        public volumenVendido:number,
        public montoVendido:number
    ){}
}