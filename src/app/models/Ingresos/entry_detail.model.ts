export class EntryDetail{
    public product:string;    
    public quantity:number;
    public productid:number;
    public cost:number;
  
    public constructor(product:string,quantity:number,productid:number,cost:number){
      this.product=product;
      this.quantity=quantity;
      this.productid=productid;
      this.cost=cost;
    }
  }