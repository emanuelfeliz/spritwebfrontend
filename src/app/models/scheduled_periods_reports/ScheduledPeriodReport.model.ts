export class ScheduledPeriodReport{
    public constructor(
        public id:number,
        public start_date:string,
        public end_date:string,
        public initial_shift:number,
        public final_shift:number,
        public reference_shift:string,
        public register_date:string
    ){}
}