export class PriceChangeDetail {
    public constructor(
        public price_change_id: number,
        public grade_id: number,
        public price_level: number,
        public ppu: number,
        public product: string
    ) { }
}
