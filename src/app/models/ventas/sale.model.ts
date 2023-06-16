import { SaleDetail } from './sale_detail.model';

export interface Voucher {
    paymentMethod: string;
    fuel: string;
    RNC: string;
    client: string;
    NCF: string;
};

export interface SaleWithVoucher {
    sale: Sale;
    voucher: Voucher;
};

export class Sale {
    public codigo: string;
    public date: string;
    public total: number;
    public estado: string;
    public id_bombero: number;
    public bombero: string;
    public tipo_pago: string;
    public tarjeta: string;
    public turno: number;
    public placa: string;
    public cliente: string;
    public rnc: string;
    public detalles: SaleDetail[];

    public constructor(
        codigo: string,
        description: string,
        date: string,
        total: number,
        estado: string,
        id_bombero: number,
        bombero: string,
        tipo_pago: string,
        tarjeta: string,
        turno: number,
        placa: string,
        cliente: string,
        rnc: string,
    ) {
        this.codigo = codigo;
        this.date = date;
        this.total = total;
        this.estado = estado;
        this.detalles = null;
        this.id_bombero = id_bombero;
        this.bombero = bombero;
        this.tipo_pago = tipo_pago;
        this.turno = turno;
        this.placa = placa;
        this.cliente = cliente
        this.rnc = rnc
    }
}