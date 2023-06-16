import { BomberoAutenticado } from '../bomberos/BomberoAutenticado.model';

export class BomberoByLado {
    public constructor(
        public bomberoAutenticado: BomberoAutenticado,
        public lado: number
    ) { }
}
