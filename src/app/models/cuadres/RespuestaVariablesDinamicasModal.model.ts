import { CampoDinamico } from "app/models/cuadres/campo-dinamico.model";

export class RespuestaVariablesdinamicas{
  public constructor(
    public respuesta:string,
    public campos_dinamicos:Array<CampoDinamico>
  ){}
}