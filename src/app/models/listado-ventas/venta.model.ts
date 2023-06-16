export class Venta {
  constructor(
    public NumeroVenta: number,
    public SaleId: number,
    public Turno: number,
    public Pump: number,
    public Nozzle: number,
    public GradeId: number,
    public ProductName: string,
    public Volume: number,
    public Money: number,
    public EndDate: string,
    public EndTime: string,
    public Precio: number,
    public DescuentoComodin: number
  ) { }
}

