import { Response, Request } from 'express';
import responseNotFound from '../responses/ResponseNotFount';

export default function notFoundErrorMiddleware(req:Request, res:Response) {
  return responseNotFound(res);
}
