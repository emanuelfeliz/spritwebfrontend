import { Venta } from "app/models/listado-ventas/venta.model";


export class VentaConsulta extends Venta{
  constructor(
    public NumeroVenta:number,
    public SaleId:number,
    public turno:number,
    public Pump:number,
    public Nozzle:number,
    public GradeId:number,
    public ProductName:string,
    public Volume:number,
    public Money:number,
    public EndDate:string,
    public EndTime:string,
    public StartDate:string,
    public StartTime:string,
    public InitialVolume:number,
    public FinalVolume:number,
    public ProductId:string,
    public volumen_vendido:number,
    public monto_vendido:number,
    public Precio:number,
    public DescuentoFidelizacion: number
  ){
    super(NumeroVenta,SaleId,turno,Pump,Nozzle,GradeId,ProductName,Volume,Money,EndDate,EndTime,Precio,DescuentoFidelizacion);
  }
}
