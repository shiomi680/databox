import { post, prop, getModelForClass, modelOptions, Severity, mongoose, pre, buildSchema } from '@typegoose/typegoose';
import { FileAttachment } from "../file/file.model"
import { Types } from 'mongoose';
import { connectDB } from "../db-connect";
export type RevisionInfo = {
  Id: string,
  CommitComment: string,
  CreateAt: string
}

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

export interface WithId {
  Id: string;
}
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
export class ExtendedRevision<T extends WithId> extends RevisionBase {
  @prop({ refPath: 'onModel' })
  Data: T;

  @prop({ required: true })
  onModel: string; // This holds the model name for dynamic reference
}

export function createExtendedRevisionSchema(schema: any) {
  const rtn = new mongoose.Schema({
    Data: { type: schema, required: true },
    ObjectId: { type: String, required: true },
    CreateAt: { type: String, required: true, default: () => new Date().toISOString() },
    CommitComment: { type: String, required: false }
  }, {
    toJSON: { virtuals: true }, // Ensure virtuals are included when document is converted to JSON
    toObject: { virtuals: true } // Ensure virtuals are included when document is converted to a plain object
  });

  rtn.virtual('Id').get(function () {
    return this._id.toString();
  });
  return rtn
}

export function createExtendedRevisionModel(modelName: string, schema: any) {
  const model = mongoose.models[modelName] || mongoose.model(modelName, schema);
  return model;
}


