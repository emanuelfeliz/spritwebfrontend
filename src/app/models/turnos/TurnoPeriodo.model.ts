export class TurnoPeriodo{
    public constructor(
        public close_id:number,
        public period_status:string,
        public period_type:string,
        public period_start_date:string,
        public period_start_time:string,
        public period_end_date:string,
        public period_end_time:string,
        public codigo_generado:string
    ){}
}