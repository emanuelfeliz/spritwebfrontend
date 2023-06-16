import { IPump } from 'app/components/settings/pumpServicesModeSettings/pump.interface';
import { ModelList } from '../ModelList.model';
export class ResumenLado {
    public constructor(
        public Lado: number,
        public TurnoActual: number,
        public aperturado: boolean,
        public bombero: string,
        public Status: string,
        public pump: IPump
    ) { }
}
