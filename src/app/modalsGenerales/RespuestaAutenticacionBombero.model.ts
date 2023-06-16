import { BomberoAutenticado } from "app/models/bomberos/BomberoAutenticado.model";

export class RespuestaAutenticacionBombero {
    public constructor(
        public bombero: BomberoAutenticado,
        public respuesta: string
    ) { }
}
