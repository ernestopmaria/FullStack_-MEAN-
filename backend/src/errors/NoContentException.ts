import HttpStatusCode from '../responses/HttpStatusCode';
import HttpException from './HttpException';

class NoContentException extends HttpException {
  constructor() {
    super(HttpStatusCode.NO_CONTENT, 'Nenhum registro encontrado!');
  }
}

export default NoContentException;
