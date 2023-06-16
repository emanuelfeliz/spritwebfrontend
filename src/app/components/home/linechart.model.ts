export interface LineChart{
    lineChartData:ChartDataSets,
    lineChartLabels:string[],
    lineChartOptions:ChartOptions,
    lineChartLegend:boolean,
    lineChartType:string
}
export interface ChartDataSets{
    label:string,
    data:number[],
    fill:boolean
}
export interface ChartOptions{
    responsive:boolean,
    title:ChartTitle
}
export interface ChartTitle{
    text:string,
    display:boolean
}