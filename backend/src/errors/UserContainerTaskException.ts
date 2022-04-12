import HttpStatusCode from '../responses/HttpStatusCode';
import HttpException from './HttpException';

class UserContainerTaskException extends HttpException {
  constructor() {
    super(HttpStatusCode.CONFLICT, 'Impossivel excluir, pois o usuario possui tarefas relacionadas');
  }
}

export default UserContainerTaskException;
