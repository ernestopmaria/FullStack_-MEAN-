import express, { Router } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

export default class App {
    public app: express.Application

    public constructor() {
      this.app = express();
      this.app.use(cors());
      this.initMongoose();
      this.connectToDb();
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

    public listen(port:number):void {
      console.log('Server started');
    }
}
