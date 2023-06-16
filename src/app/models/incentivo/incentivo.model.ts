export class Incentivo {
    constructor(
        public id: number,
        public nombre: string,
        public tipo: string,
        public puntos: number,
        public canjeado: boolean,
        public codigo: string
    ){}
}