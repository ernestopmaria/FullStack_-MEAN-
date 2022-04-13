import { Request } from 'express';
import { FilterQuery } from 'mongoose';
import { StatusEnum, TaskInterface } from '../schemas/Task';

export enum TaskFilterEnum{
    MY,
    OPEN,
    FINISHED,
    ALL,
}

class TaskService {
  public getParamsList(req:Request):FilterQuery<TaskInterface[]>|undefined {
    const { filter, _id } = req.params;
    if (!filter) { return; }

    if (TaskFilterEnum[TaskFilterEnum.MY] === TaskFilterEnum[filter as unknown as number]) return { responsible: { _id } };

    if (TaskFilterEnum[TaskFilterEnum.OPEN] === TaskFilterEnum[filter as unknown as number]) return { status: StatusEnum.OPEN };

    if (TaskFilterEnum[TaskFilterEnum.FINISHED] === TaskFilterEnum[filter as unknown as number]) return { status: StatusEnum.FINISHED };

    // eslint-disable-next-line no-empty
    if (TaskFilterEnum[TaskFilterEnum.ALL] === TaskFilterEnum[filter as unknown as number]) {}
  }

  public checkStatusFinished(task:TaskInterface) {
    if (StatusEnum.FINISHED === task.status) task.conclused = new Date();
  }
}

export default new TaskService();
