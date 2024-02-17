import { post, prop, getModelForClass, modelOptions, Severity, mongoose, pre } from '@typegoose/typegoose';
import { FileAttachment } from "../file/file.model"
import { Types } from 'mongoose';

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
export function createExtendedRevisionModel<T extends WithId>(modelName: string) {
  const model = mongoose.models[modelName] || getModelForClass(ExtendedRevision, {
    schemaOptions: { collection: modelName },
    options: { customName: modelName } // Ensure the model name is set correctly
  });
  return model;
}