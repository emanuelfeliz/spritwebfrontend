export class GenericResponse<T>{
  public constructor(
    public Success: boolean,
    public Response: T,
    public PossibleError: string,
    public Details: string,
    public IDENTIFICADOR: string
  ) { }
}

export interface IResponse {
  success: boolean;
  message: string;
  error: string;
  action: string;
}

export interface IResponseWithList<T> extends IResponse {
  list: Array<T>;
}

export interface IResponseWithElement<T> extends IResponse {
  element: T
}
