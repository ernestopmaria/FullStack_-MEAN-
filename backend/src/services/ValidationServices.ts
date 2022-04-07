import {
  NextFunction,
} from 'express';
import { Types } from 'mongoose';

export default new class ValidationServices {
  public validateId(id:string):boolean {
    if (!Types.ObjectId.isValid(id)) {
      return true;
    }
    return false;
  }
}();
