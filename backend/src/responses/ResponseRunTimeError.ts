import { Response } from 'express';
import HttpStatusCode from './HttpStatusCode';

export default function responseRunTimeError(res :Response, status:HttpStatusCode, message:string) {
  const error = true;
  const body = {};

  return res.status(status).send({
    status, message, error, body,
  });
}
