export class MedidaTanque {
    public constructor(
        public id_tanque: number,
        public tanque: string,
        public volumen_medida: number,
        public volumen_manual:number,
        public fecha: string,
        public id_bombero: number,
        public bombero: string,
        public turno: number
    ) {

    }
}