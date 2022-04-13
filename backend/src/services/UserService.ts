import { NextFunction } from 'express';
import { FilterQuery } from 'mongoose';
import UserContainerTaskException from '../errors/UserContainerTaskException';
import Task, { TaskInterface } from '../schemas/Task';

class UserService {
  public async validateExistAnyTask(id:string, next:NextFunction):Promise<boolean> {
    const tasks = await Task.exists({ responsible: { _id: id } } as FilterQuery<TaskInterface>);
    if (tasks) {
      next(new UserContainerTaskException());
      return true;
    }
    return false;
  }
}

export default new UserService();
