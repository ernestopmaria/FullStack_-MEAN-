import HttpStatusCode from './http-status-code';

export interface Response<T>{
  body:T;
  error :boolean;
  message:string;
  status:HttpStatusCode;
}
