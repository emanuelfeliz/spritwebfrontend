export interface IResponse {
  success: boolean;
  message: string;
  error: string;
}

export interface IResponseWithList<T> extends IResponse {
  List: Array<T>;
}

export interface IResponseWithElement<T> extends IResponse {
  element: T;
}
