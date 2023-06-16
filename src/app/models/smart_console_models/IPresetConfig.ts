import { IGrade } from "app/components/settings/pumpServicesModeSettings/pump.interface";

export interface IPresetConfig{
    type:number;
    pumpNo:number;
    amount:number;
   tankFull:boolean;
   grades: Array<IGrade>;
}
