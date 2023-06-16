export class SaleDetail{
    public product:string;    
    public quantity:number;
    public productid:number;
    public price:number;
    public itbis: boolean;
  
    public constructor(product:string,quantity:number,productid:number,price:number, itbis: boolean){
      this.product=product;
      this.quantity=quantity;
      this.productid=productid;
      this.price=price;
      this.itbis = itbis;
    }
  }