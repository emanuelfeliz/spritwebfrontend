export class ConfiguracionTanque {
    constructor(
        public Id: number,
        public LlenarEnCero: boolean,
        public PortName: string,
        public TanksQuantity: number,
        public DataBits: number,
        public Parity: number
    )
    {}

}