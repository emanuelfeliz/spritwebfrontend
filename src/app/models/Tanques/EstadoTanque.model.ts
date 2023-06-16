import { Gauge } from './Gauge.model';
import { TankDesign } from 'app/models/Tanques/TankDesign.model';

export class EstadoTanque {
  public constructor(
    public id: number,
    public producto: string,
    public actualVolume: number,
    public dispensed: number,
    public last_volume_receibed: number,
    public capacity: number,
    public last_sale_id: number,
    public color: string,
    public lleno: number,
    public tanque3D: Gauge,
    public tankDesign: TankDesign,
    public consoleVolume: number,
    public ProbeInformation: IProbeInformation,
    public Probe: IProbe
  ) { }
}

export interface IProbeInformation {
  canShowConsoleVolume: boolean;
  showProductHeight: boolean;
  showProductVolume: boolean;
  showProductUllage: boolean;
  showProductTCVolume: boolean;
  showProductMass: boolean;
  showCalculatedProductVolume: boolean;
  showWaterVolume: boolean;
  showWaterHeight: boolean;
  showWaterInch: boolean;
  showCalculatedWaterInch: boolean;
  showCalculatedWaterVolume: boolean;
  showFuelInch: boolean;
  showCalculatedFuelInch: boolean;
  showPercentageProbes: boolean;
  showProductDensity: boolean;
}

export interface IProbe {
  Status: string;
  ProductHeight: number;
  WaterHeight: number;
  Temperature: number;
  ProductVolume: number;
  WaterVolume: number;
  ProductUllage: number;
  ProductTCVolume: number;
  ProductDensity: number;
  ProductMass: number;
  FuelInch: number;
  PercentageProbes: number;
  WaterInch: number;
}