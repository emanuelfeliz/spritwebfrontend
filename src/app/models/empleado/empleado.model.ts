export class Empleado {
    constructor(
        public id: number,
        public nombre: string,
        public cedula: string,
        public departamento: string,
        public codigo: string,
        public qrcode: string,
        public barcode:string,
        public countrycode: string
    ){}
}