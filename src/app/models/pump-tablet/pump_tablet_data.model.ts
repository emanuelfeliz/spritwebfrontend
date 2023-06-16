import { PumpTabletDataPump } from './pump_tablet_data_pump.model';
import { ModelList } from '../ModelList.model';
export class PumpTabletData {
  public constructor(
    public Lado1: ModelList<PumpTabletDataPump>,
    public Lado2: ModelList<PumpTabletDataPump>
  ) { }
}
