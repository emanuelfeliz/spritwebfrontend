export class PumpTabletDataPump{
  constructor(
    public pump:number,
    public nozzle:number,    
    public finalVolume:number,
    public endTime:string,
    public endDate:string,
    public turno_actual:number,
    public producto:string,
    public secuencia:string
  ){}
}
