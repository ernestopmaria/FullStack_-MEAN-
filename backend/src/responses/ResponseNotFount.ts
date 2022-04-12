import { Response } from 'express';
import HttpStatusCode from './HttpStatusCode';

export default function responseNotFound(res: Response) {
  const status = HttpStatusCode.NOT_FOUND;
  const message = 'Rota náo encontrada';
  const error = true;
  const body = {};

  return res.status(status).send({
    status, message, error, body,
  });
}
