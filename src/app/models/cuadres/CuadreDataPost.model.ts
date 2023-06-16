import { Cuadre } from "./cuadre.model";

export class CuadreDataPost {
    public cuadre: Cuadre;
    public cuadre_initially_loaded: Cuadre;
    public constructor(
        public _cuadre: Cuadre
    ) {
        this.cuadre = _cuadre;
    }
}