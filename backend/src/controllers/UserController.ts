import {
  NextFunction, Request, response, Response,
} from 'express';
import { now } from 'mongoose';
import User from '../schemas/User';
import Controller from './Controller';

interface IUser{
    name:string;
    email:string;
    password:string;
    creation:Date;
}

export default class UserController extends Controller {
  constructor() {
    super('/user');
  }
  protected initRoutes(): void {
    this.router.get(this.path, this.list);
    this.router.post(this.path, this.create);
  }

  private async list(req:Request, res:Response, next:NextFunction):Promise<Response> {
    const users = await User.find();
    return res.send(users);
  }

  private async findById(req:Request, res:Response, next:NextFunction):Promise<Response> {
    const { id } = req.params;
    return null;
  }

  private async create(req:Request, res:Response, next:NextFunction):Promise<Response> {
    const { name, email, password } = req.body;

    const user = {
      name,
      email,
      password,

    }as IUser;
    User.create(user);

    return response.status(200).send();
  }
}
