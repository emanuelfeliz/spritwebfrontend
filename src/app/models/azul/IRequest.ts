interface IBaseRequest {
  amount: string;
  itbis: string;
  orderNumber: string;
  merchantId: string;
  terminalId: string;
}

export interface IAzulSale extends IBaseRequest {
  installment: string;
  useMultiMessaging: string;
  promoData: string;
}

export interface IAzulCancellation extends IBaseRequest {
  authorizationNumber: string;
}

export interface IAzulRefund extends IBaseRequest {

}

export interface IAzulResponse {
  dateTime: string;
  responseMessage: string;
  orderNumber: string;
  amount: string;
  authorizationNumber: string;
}
