import { BomberoAutenticado } from '../bomberos/BomberoAutenticado.model';
import { Venta } from '../listado-ventas/venta.model';
import { ClienteFidelizado } from '../clientes-fidelizados/ClienteFidelizado.model';
import { Comodin } from './Comodin.model';

export class PaymentSale {
    bomberoAutenticado: BomberoAutenticado;
    sale: Venta;
    metodo: string;
    tarjeta: string;
    placa: string;
    tipo_otro: string;
    dato_otro: string;
    comodin: Comodin;
    Rnc: string;
    Client: string;
}
