import { NextFunction } from 'express';
import { FilterQuery } from 'mongoose';
import UserContainerTaskException from '../errors/UserContainerTaskException';
import UserExistsException from '../errors/UserExistsException';
import Task, { TaskInterface } from '../schemas/Task';
import User from '../schemas/User';

class UserService {
  public async validateExistAnyTask(id:string, next:NextFunction):Promise<boolean> {
    const tasks = await Task.exists({ responsible: { _id: id } } as FilterQuery<TaskInterface>);
    if (tasks) {
      next(new UserContainerTaskException());
      return true;
    }
    return false;
  }

  public async userExists(id:string, next:NextFunction) {
    const checkUser = await User.exists({ _id: id });
    if (!checkUser) {
      next(new UserExistsException());
      return true;
    }
    return false;
  }
}

export default new UserService();
