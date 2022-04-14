/* eslint-disable eqeqeq */
import {
  NextFunction, Request, Response,
} from 'express';

import NoContentException from '../errors/NoContentException';
import ServerErrorException from '../errors/ServerErrorException';
import responseCreate from '../responses/ResponseCreate';
import responseOk from '../responses/ResponseOk';
import Task, { TaskInterface } from '../schemas/Task';
import TaskService from '../services/TaskService';
import UserService from '../services/UserService';
import ValidationServices from '../services/ValidationServices';
import Controller from './Controller';

export default class TaskController extends Controller {
  constructor() {
    super('/task');
  }
  protected initRoutes(): void {
    this.router.get(`${this.path}/:filter/:_id`, this.list);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}/:id`, this.update);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private async list(req:Request, res:Response, next:NextFunction):Promise<Response | void> {
    try {
      const tasks = await Task.find(TaskService.getParamsList(req)).populate('responsible');
      if (tasks.length) return responseOk(res, tasks);
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
      const task = await Task.findById(id).populate('responsible');
      if (task) {
        return responseOk(res, task);
      }
      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async create(req:Request, res:Response, next:NextFunction):Promise<Response |void> {
    try {
      let task:TaskInterface = req.body;
      TaskService.checkStatusFinished(task);
      UserService.userExists(task.responsible, next);

      task = await Task.create(task);
      const taskUpdate = await Task.findById(task.id).populate('responsible');

      return responseCreate(res, taskUpdate);
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
      let task:TaskInterface = req.body;
      TaskService.checkStatusFinished(task);
      UserService.userExists(task.responsible, next);

      task = await Task.findByIdAndUpdate(id, task) as TaskInterface;
      if (task) {
        task = await Task.findById(task.id).populate('responsible') as TaskInterface;
        return responseOk(res, task);
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

      const task = await Task.findById(id);
      if (task) {
        await task.deleteOne();
        return responseOk(res, 'Tarefa deletada com sucesso!');
      }
      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }
}
