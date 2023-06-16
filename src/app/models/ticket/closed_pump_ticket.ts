import { AperturaTurnoBombero } from "../apertura_turno/apertura_turno_bombero.model";

export interface ClosedPumpTicket {
    shift:number;
    jockey: string;
    data: AperturaTurnoBombero;
    pumps: string;
}