import { Denominaciones } from "app/models/cuadres/denominaciones.model";

export class CuadreValidaciones{
  public constructor(
    public denominaciones_admin: Array<Denominaciones>,
    public total_efectivo_registrado_admin: number
  ){}
}