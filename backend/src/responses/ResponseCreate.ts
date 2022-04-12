import { Response } from 'express';
import HttpStatusCode from './HttpStatusCode';

export default function responseCreate(res:Response, body:any) {
  const status = HttpStatusCode.OK;
  const message = 'Criado com sucesso';
  const error = false;

  return res.status(status).send({
    message, status, error, body,
  });
}
