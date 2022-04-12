/* eslint-disable eqeqeq */
import {
  NextFunction, Request, Response,
} from 'express';
import HttpException from '../errors/HttpException';
import IdInvalidException from '../errors/IdInvalidException';
import NoContentException from '../errors/NoContentException';
import ServerErrorException from '../errors/ServerErrorException';
import HttpStatusCode from '../responses/HttpStatusCode';
import responseCreate from '../responses/ResponseCreate';
import responseOk from '../responses/ResponseOk';
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
      return res.send(responseOk(res, users));
    } catch (error) {
      return res.send(new ServerErrorException(error));
    }
  }

  private async findById(req:Request, res:Response, next:NextFunction):Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationServices.validateId(id)) {
        return res.status(HttpStatusCode.BAD_REQUEST).send(new IdInvalidException());
      }
      const user = await User.findById(id);
      if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).send(new HttpException(HttpStatusCode.NOT_FOUND, 'Usuario não encontrado!'));
      }
      return res.send(responseOk(res, user));
    } catch (err) {
      return res.send(new ServerErrorException(err));
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

      return res.send(responseCreate(res, user));
    } catch (error) {
      return res.send(new ServerErrorException(error));
    }
  }

  private async update(req:Request, res:Response, next:NextFunction):Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationServices.validateId(id)) {
        return res.status(HttpStatusCode.BAD_REQUEST).send(new IdInvalidException());
      }
      const userExists = await User.findById(id);
      if (!userExists) {
        return res.status(HttpStatusCode.NOT_FOUND).send(new HttpException(HttpStatusCode.NOT_FOUND, 'Usuario não encontrado!'));
      }

      await User.findByIdAndUpdate(id, req.body);
      return res.send(responseOk(res, userExists));
    } catch (err) {
      return res.send(new ServerErrorException(err));
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
        return res.send(responseOk(res, user));
      }
      return res.status(HttpStatusCode.NO_CONTENT).send(new NoContentException());
    } catch (err) {
      return res.send(new ServerErrorException(err));
    }
  }
}
