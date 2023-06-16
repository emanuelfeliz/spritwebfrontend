import { Deposito } from "app/models/depositos/Deposito.model";

export class ReturnResultDepositos{
  public constructor(
    public response:string,
    public depositos:Array<Deposito>
  ){}
}