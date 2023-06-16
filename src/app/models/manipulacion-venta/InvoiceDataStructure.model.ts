import { PaymentSale } from './PaymentSale.model';
import { InvoiceType } from '../consulta-comprobantes/InvoiceType.model';
import { ClientInfo } from './ClientInfo.model';

export class InvoiceDataStructure {
    paymentSale: PaymentSale;
    invoiceType: InvoiceType;
    clientInfo: ClientInfo;
    constructor(

    ) { }
}
