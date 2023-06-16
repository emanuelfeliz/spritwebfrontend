export class WarehouseProduct{
    public id:number;
    public description:string;
    public categoria:string;
    public code:string;
    public price:number;
    public cost:number;
    public itbis:boolean;
    public last_modification:string;
    public product_categoryid:number
}


export class WarehouseProductCategory{
    public id:number;
    public description:string;
    public code:string;
}