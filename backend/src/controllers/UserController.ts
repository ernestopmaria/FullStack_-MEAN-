/* eslint-disable eqeqeq */
import {
  NextFunction, Request, Response,
} from 'express';
import HttpException from '../errors/HttpException';
import IdInvalidException from '../errors/IdInvalidException';
import HttpStatusCode from '../responses/HttpStatusCode';
import User from '../schemas/User';
import ValidationServices from '../services/ValidationServices';
import Controller from './Controller';

export default class UserController extends Controller {
  constructor() {
    super('/user');
  }
  protected initRoutes(): void {
    this.router.get(this.path, this.list);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}/:id`, this.update);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private async list(req:Request, res:Response, next:NextFunction):Promise<Response> {
    try {
      const users = await User.find();
      return res.send(users);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Erro interno no servidor'));
    }
  }

  private async findById(req:Request, res:Response, next:NextFunction):Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationServices.validateId(id)) {
        return res.status(HttpStatusCode.BAD_REQUEST).send(new HttpException(HttpStatusCode.BAD_REQUEST, 'Usuario não existe!'));
      }
      const user = await User.findById(id);
      if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).send(new HttpException(HttpStatusCode.NOT_FOUND, 'Usuario não encontrado!'));
      }
      return res.send(user);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Erro interno no servidor'));
    }
  }

  private async create(req:Request, res:Response, next:NextFunction):Promise<Response> {
    try {
      const { email, name, password } = req.body;
      const CheckUser = await User.find();
      // eslint-disable-next-line array-callback-return
      CheckUser.find((x) => {
        if (x.email == email) {
          return res.status(HttpStatusCode.UNAUTHORIZED).send(new HttpException(HttpStatusCode.UNAUTHORIZED, 'Ja existe um usuario com este email!'));
        }
        if (x.name == name) {
          return res.status(HttpStatusCode.UNAUTHORIZED).send(new HttpException(HttpStatusCode.UNAUTHORIZED, 'Por razões de segurança não devemos ter nomes iguais este nome já esta em uso!'));
        }
        if (password.length < 6) {
          return res.status(HttpStatusCode.UNAUTHORIZED).send(new HttpException(HttpStatusCode.UNAUTHORIZED, 'Por razões de segurança a sua password deve ter mais mais de 5 caracteres!'));
        }
      });

      const user = await User.create(req.body);
      return res.status(HttpStatusCode.CREATED).send(new HttpException(HttpStatusCode.CREATED, 'Usuario criado com sucesso!')).json(user);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Erro interno no servidor'));
    }
  }

  private async update(req:Request, res:Response, next:NextFunction):Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationServices.validateId(id)) {
        return res.status(HttpStatusCode.BAD_REQUEST).send(new HttpException(HttpStatusCode.BAD_REQUEST, 'Usuario não valido!'));
      }
      const userExists = await User.findById(id);
      if (!userExists) {
        return res.status(HttpStatusCode.NOT_FOUND).send(new HttpException(HttpStatusCode.NOT_FOUND, 'Usuario não encontrado!'));
      }

      await User.findByIdAndUpdate(id, req.body);
      return res.send(new HttpException(HttpStatusCode.OK, 'Usuario editado com sucesso!'));
    } catch (err) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Erro interno no servidor'));
    }
  }

  private async delete(req:Request, res:Response, next:NextFunction):Promise<Response> {
    try {
      const { id } = req.params;

      if (ValidationServices.validateId(id)) {
        return res.status(HttpStatusCode.BAD_REQUEST).send(new IdInvalidException());
      }

      const user = await User.findById(id);
      if (user) {
        await user.deleteOne();
        return res.send(new HttpException(HttpStatusCode.OK, 'Usuario foi deletado com sucesso!'));
      }
      return res.status(HttpStatusCode.NOT_FOUND).send(new HttpException(HttpStatusCode.NOT_FOUND, 'Usuario não encontrado!'));
    } catch (err) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Erro interno no servidor'));
    }
  }
}
