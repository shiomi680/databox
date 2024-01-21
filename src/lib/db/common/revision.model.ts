import { post, prop, getModelForClass, modelOptions, Severity, mongoose, pre } from '@typegoose/typegoose';
import { FileAttachment } from "../file/file.model"
import { Types } from 'mongoose';

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) { delete ret._id; }
    }
  }
})
export class RevisionBase {
  @prop({ default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  public get Id() {
    return this._id.toString()
  }


  @prop()
  ObjectId: string;

  @prop({ required: true, default: () => new Date().toISOString() })
  CreateAt: string;

  @prop()
  CommitComment: string;
}