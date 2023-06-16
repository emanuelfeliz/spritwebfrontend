export class Deposito{
  public constructor(
    public codigo: string,
    public bombero: string,
    public bombero_id: number,
    public monto: number,
    public fecha: string,
    public codigo_deposito: string,
    public cuadre_id: string,
    public turno?: number,
  ){}
}