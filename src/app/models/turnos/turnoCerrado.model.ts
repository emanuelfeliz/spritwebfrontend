export class TurnoCerrado{
  public constructor(
    public CloseId:number,
    public FechaInicial:string,
    public HoraInicial:string,
    public FechaFinal:string,
    public HoraFinal:string,
    public no_turno:number,
    public calculated_report_ready:boolean,
    public based_report_ready:boolean
  ){

  }
}
