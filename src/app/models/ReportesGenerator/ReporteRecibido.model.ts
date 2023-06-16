export class ReporteRecibido{
  public constructor(
    public titulo:string,
    public ruta:string,
    public nombre:string,
    public reporte_exportacion:boolean,
    public nombre_permiso_exportacion:string,
    public ruta_exportacion:string,
    public json:string
  ){}
}