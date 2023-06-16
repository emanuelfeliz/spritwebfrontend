export class Barchart{
    barChartOptions:BarChartOptions;
    barChartLabels:string[];
    barChartType:string;
    barChartLegend:boolean;
    barChartPlugins:any;
    barChartData:BarChartData[];
    constructor(){
        this.barChartData = [];
        this.barChartLabels = [];
    }

} 

export class BarChartOptions{
    title:BarChartOptionsTitle;
    responsive:boolean;
} 


export class BarChartData{
    data:number[];
    label:string;
}

export class BarChartOptionsTitle{
    text:string;
    display:boolean;
}