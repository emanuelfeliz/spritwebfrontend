import { ClienteFidelizado } from "../clientes-fidelizados/ClienteFidelizado.model";
import { Incentivo } from "../incentivo/incentivo.model";
import { Modalidad } from "../configuracion_puntajes_fidelidad/Modalidad.model";

export class Comodin {
    constructor(
        public activado: boolean,
        public tipo: string,
        public clienteFidelizado: ClienteFidelizado,
        public puntosACanjear: number,
        public incentivo: Incentivo,
        public modalidad: Modalidad
    ){}
}