import { DetallePorLado } from "app/models/apertura_turno/DetallePorLado.model";

export class AperturaTurnoBombero {
    public constructor(public id: number,
        public bombero: string,
        public fecha_inicio: string,
        public hora_inicio: string,
        public fecha_fin: string,
        public hora_fin: string,
        public lados: string,
        public turno_anterior: string,
        public activo: string,
        public id_bombero: number,
        public turno_actual: string,
        public lados_pendientes: number,
        public lados_activos: string,
        public lados_inactivos: string,
        public detalles_por_lado: Array<DetallePorLado>) {

    }
}