import { ModelList } from "../ModelList.model";
import { Cuadre } from "./cuadre.model";
import { ResumenCuadres } from "./ResumenCuadres.model";

export class CuadreData{
    public constructor(
        public cuadres:ModelList<Cuadre>,
        public resumenCuadres:ResumenCuadres
    ){}
}