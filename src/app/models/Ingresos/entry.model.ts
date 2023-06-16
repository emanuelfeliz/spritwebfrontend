import {EntryDetail} from './entry_detail.model';
export class Entry{
    public codigo:string;
    public description:string;
    public date:string;
    public total:number;
    public estado:string;
    public detalles:EntryDetail[];
    public constructor(
        codigo:string,
        description:string,
        date:string,
        total:number,
        estado:string
    ){
        this.codigo=codigo;
        this.description=description;
        this.date=date;
        this.total=total;
        this.estado=estado;
        this.detalles=null;
    }
}