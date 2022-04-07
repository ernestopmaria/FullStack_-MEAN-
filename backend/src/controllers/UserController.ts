import e, {
  NextFunction, Request, response, Response,
} from 'express';
import { Types } from 'mongoose';
import User from '../schemas/User';
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
    const users = await User.find();
    return res.send(users);
  }

  private async findById(req:Request, res:Response, next:NextFunction):Promise<Response> {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).send('Algo deu errado');
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).send('Usuario não encontrado');
    }
    return res.send(user);
  }

  private async create(req:Request, res:Response, next:NextFunction):Promise<Response> {
    try {
      const {email} =req.body
       const CheckUser = await User.find();
        CheckUser.find(x =>{        
        if(x.email==email){
          return res.status(401).send("User already")
          
        }    
      
      });

      await User.create(req.body)
      

     
    } catch (err) {
      console.error('Something went wrong');
      console.error(err);
    }
    return res.status(200).send();
  }

  private async update(req:Request, res:Response, next:NextFunction):Promise<Response> {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send('Algo deu errado');
      }
      const userExists  = await User.findById(id);
      if (!userExists) {
        return res.status(401).send('Usuario não encontrado');
      }
      
      await User.findByIdAndUpdate(id, req.body);
      return res.send('User Updated');
    } catch (err) {
      console.error('Something went wrong');
      console.error(err);
    }
    return res.status(200).send();
  }

  private async delete(req:Request, res:Response, next:NextFunction):Promise<Response> {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).send('Algo deu errado');
    }
    const user = await User.findById(id);
    if (user) {
      await user.deleteOne();
      return res.send('User deleted');
    }

    return res.status(204).send();
  }
}
