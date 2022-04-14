import HttpStatusCode from '../responses/HttpStatusCode';
import HttpException from './HttpException';

class ServerErrorException extends HttpException {
  constructor(error: any) {
    super(getStatus(error), getMessage(error));
  }
}

function getStatus(error: any): number {
  if (isMongoException(error)) return HttpStatusCode.BAD_REQUEST;
  return HttpStatusCode.INTERNAL_SERVER_ERROR;
}

function isMongoException(error: any): boolean {
  if (isMongoError(error) || isValidationError(error)) return true;
  return false;
}

function isMongoError(error: { name: string; }): boolean {
  return error.name === 'MongoError';
}

function isValidationError(error: { name: string; }): boolean {
  return error.name === 'ValidationError';
}

function getMessage(error: any): any {
  try {
    if (isMongoException(error)) {
      if (isKeyUniqueError(error)) return getMessageKeyUnique(error);
      if (isValidationError(error)) return getMessageValidationError(error);
    } else return getMessageGeneric();
  } catch (error) {
    return getMessageGeneric();
  }
}

function isKeyUniqueError(error: { code: number; } |any) {
  return isMongoError(error) && error.code === 11000;
}

function getMessageKeyUnique(error: { keyPattern: any; }): string {
  const { keyPattern } = error;

  const listFormatedErros: string[] = [];
  Object.keys(keyPattern).forEach((field) => {
    switch (field) {
      case 'name':
        listFormatedErros.push('Nome deve ser único');
        break;

      case 'email':
        listFormatedErros.push('Email deve ser único');
        break;
      default:
        listFormatedErros.push(`${field} deve ser único`);
    }
  });

  return listFormatedErros.join(' | ');
}

function getMessageValidationError(error: { errors: any; }): string {
  const { errors } = error;

  const listFormatedErros: any[] = [];
  Object.keys(errors).forEach((field) => {
    listFormatedErros.push(errors[field].message);
  });

  return listFormatedErros.join(' | ');
}

function getMessageGeneric(): string {
  return 'Erro interno no servidor.';
}

export default ServerErrorException;
