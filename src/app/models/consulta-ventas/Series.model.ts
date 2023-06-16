import { DataSerie } from './DataSerie.model';

export class Serie{
    public name:string;
    public colorByPoint:boolean;
    public data:DataSerie[];
    public constructor(
        name:string,
        colorByPoint:boolean
    ){
        this.name=name;
        this.colorByPoint=colorByPoint;
        this.data=null;
    }
}