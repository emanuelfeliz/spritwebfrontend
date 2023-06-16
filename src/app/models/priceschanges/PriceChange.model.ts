import { PriceChangeDetail } from './PriceChangeDetail.model';

export class PriceChange {
    public constructor(
        public price_change_id: number,
        public application_date: string,
        public application_time: string,
        public processed_date: string,
        public processed_time: string,
        public prices_changes_detail: Array<PriceChangeDetail>
    ) { }
}
