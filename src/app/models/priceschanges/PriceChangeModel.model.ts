import { PriceChange } from './PriceChange.model';
import { PriceChangeDetail } from './PriceChangeDetail.model';

export class PriceChangeModel {
    public constructor(
        public priceChange: PriceChange,
        public priceChangeDetail: Array<PriceChangeDetail>
    ) { }
}