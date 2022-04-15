/* eslint-disable eqeqeq */
import {
  NextFunction, Request, Response,
} from 'express';

import NoContentException from '../errors/NoContentException';
import ServerErrorException from '../errors/ServerErrorException';
import responseCreate from '../responses/ResponseCreate';
import responseOk from '../responses/ResponseOk';
import User from '../schemas/User';
import UserService from '../services/UserService';
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

  private async list(req:Request, res:Response, next:NextFunction):Promise<Response | void> {
    try {
      const users = await User.find();
      if (users.length) return responseOk(res, users);
      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async findById(req:Request, res:Response, next:NextFunction):Promise<Response |void> {
    try {
      const { id } = req.params;
      if (ValidationServices.validateId(id, next)) {
        return;
      }
      const user = await User.findById(id);
      if (user) {
        return responseOk(res, user);
      }
      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async create(req:Request, res:Response, next:NextFunction):Promise<Response |void> {
    try {
      const user = await User.create(req.body);
      return responseCreate(res, user);
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async update(req:Request, res:Response, next:NextFunction):Promise<Response |void> {
    try {
      const { id } = req.params;
      if (ValidationServices.validateId(id, next)) {
        return;
      }

      const user = await User.findByIdAndUpdate(id, req.body);
      if (user) {
        return responseOk(res, user);
      }
      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async delete(req:Request, res:Response, next:NextFunction):Promise<Response |void > {
    try {
      const { id } = req.params;
      if (ValidationServices.validateId(id, next)) {
        return;
      }
      if (await UserService.validateExistAnyTask(id, next)) {
        return;
      }

      const user = await User.findById(id);
      if (user) {
        await user.deleteOne();
        return responseOk(res, user);
      }
      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }
}
