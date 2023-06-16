export class ProccessedPeriodReport{
    public constructor(
        public id:number,
        public id_scheduled_period_report:number,
        public proccessed_date:string,
        public start_date: string,
        public end_date: string,
        public initial_shift:number,
        public final_shift:number,
        public reference_shift:string
    ){}
}