/* eslint-disable eqeqeq */
import {
  NextFunction, Request, Response,
} from 'express';

import ServerErrorException from '../errors/ServerErrorException';

import responseOk from '../responses/ResponseOk';
import Task from '../schemas/Task';

import Controller from './Controller';

export default class DashController extends Controller {
  constructor() {
    super('/dash');
  }
  protected initRoutes(): void {
    this.router.get(this.path, this.list);
  }

  private async list(req:Request, res:Response, next:NextFunction):Promise<Response | void> {
    try {
      const tasks = await Task.find({}, '-_id -__v -description -concluded -creation').populate('responsible', 'name');
      if (tasks.length) {
        return responseOk(res, tasks);
      }
      return;
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }
}
