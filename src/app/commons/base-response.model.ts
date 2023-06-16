export class BaseResponse<T>{
    header:HeaderResponse;
    data:T;
}

export class HeaderResponse{
    code:string;
    message:string;
    type:string;
    details:string;
    errors:ErrorResponse[]

}

export class ErrorResponse{
    code:string;
    message:string;
    source:string;
    starcktrace:string;
} 


export enum HeaderTypeEnum{
    Success="Success",
    Info="Info",
    Functional="Functional",
    Technical="Technical"
}
export enum HeaderCodeEnum{
    OK = "OK_200",
    Unauthorized = "UA_401",
    InternalError = "EI_500",
    BadRequest = "MalformedJSON_301",
}
export enum ExportFormatType{
    WordForWindows = 3,
    Excel = 4,
    PortableDocFormat = 5,
}