import HttpStatusCode from '../responses/HttpStatusCode';
import HttpException from './HttpException';

class UserExistsException extends HttpException {
  constructor() {
    super(HttpStatusCode.UNAUTHORIZED, 'É obrigatório um responsável valido');
  }
}

export default UserExistsException;
