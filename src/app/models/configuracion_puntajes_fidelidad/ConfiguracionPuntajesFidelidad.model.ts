import { Modalidad } from "./Modalidad.model";

export class ConfiguracionPuntajesFidelidad {
    public constructor(
        public id: number,
        public parametroModalidad: number,
        public puntos: number,
        public minimoConsumido: number,
        public tipoCliente: string,
        public operacion?: {
            fidelizacion: boolean,
            canje: boolean
        },
        public modalidad?: Modalidad,
        public id_tipo_cliente: number = 0
    ) { }
}