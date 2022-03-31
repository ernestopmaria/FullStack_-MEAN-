import express, { Router } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Controller from './controllers/Controller';

export default class App {
    public app: express.Application

    public constructor(controllers:Controller[]) {
      this.app = express();
      this.app.use(cors());

      this.initMongoose();
      this.connectToDb();
      this.initExpressJson();
      this.initControllers(controllers);
    }

    private initMongoose():void {
      mongoose.set('runValidators', true);
    }

    private connectToDb() {
      mongoose.connect('mongodb+srv://admin:0b8AVXsxy0iXyb8R@cluster0.ac51g.mongodb.net/dashboard?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
    }
    private initExpressJson():void { this.app.use(express.json()); }

    private initControllers(controllers:Controller[]): void {
      controllers.forEach((controller) => {
        this.app.use('/', controller.router);
      });
    }

    public listen(port:number):void {
      this.app.listen(port, () => {
        console.log(`Server started on ${port}`);
      });
    }
}
