import { DataDia } from "./data-dia.model";
import { ConfPumpData } from "./conf-pump-data.model";

export class CierreAutomatico {
    public constructor(
        public id_registro: number,
        public configuraciones_pump_data: Array<ConfPumpData>,
        public mes: string,
        public tipo_cierre: string,
        public fecha_registro: string,
        public cerrar_pasado_fecha: boolean
    ) {}
};