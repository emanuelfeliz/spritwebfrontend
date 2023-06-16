export class Usuario {
    public constructor(
        public idusuario: string,
        public usuario: string,
        public clave: string,
        public idrol: number,
        public rol: string,
        public codigo: string
    ) { }
}