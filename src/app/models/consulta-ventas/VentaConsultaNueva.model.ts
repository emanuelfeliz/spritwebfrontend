import { Venta } from "../listado-ventas/venta.model";

export class VentaConsultaNueva extends Venta{
    public constructor(
        public NumeroVenta:number,
        public SaleId:number,
        public Pump:number,
        public turno: number,
        public Nozzle:number,
        public GradeId:number,
        public ProductName:string,
        public Volume:number,
        public Money:number,
        public EndDate:string,
        public EndTime:string,
        public Precio:number,
        public StartDate:string,
        public StartTime:string,
        public initial_volume:number,
        public final_volume:number,
        public ProductId:string,
        public DescuentoFidelizacion:number    
    ){
        super(NumeroVenta,SaleId,turno,Pump,Nozzle,GradeId,ProductName,Volume,Money,EndDate,EndTime,Precio,DescuentoFidelizacion);
    }
}