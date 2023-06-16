export class ClienteFidelizado {
    public constructor(
        public id: number,
        public nombres: string,
        public apellidos: string,
        public cedula: string,
        public pasaporte: string,
        public codigo: string,
        public puntosFidelizacion: number,
        public codigo_impreso: boolean,
        public fecha_fidelizacion: string,
        public galonesConsumidos: number,
        public pesosConsumidos: number,
        public tipo_cliente: string,
        public qrcode: string,
        public barcode:string,
        public countrycode: string,
        public id_tipo_cliente: number = 0
    ) { }
}
