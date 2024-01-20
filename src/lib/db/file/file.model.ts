import { post, prop, getModelForClass, modelOptions, Severity, mongoose, pre } from '@typegoose/typegoose';
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
export class File {
  @prop({ default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  public get id() {
    return this._id.toString()
  }


  @prop()
  FileName: string;

  @prop()
  FilePath: string;

  @prop({ required: true, default: () => new Date().toISOString() })
  CreateAt: string;

}

// export const FileModel = getModelForClass(File);
export const FileModel = (mongoose.models.File || getModelForClass(File)) as mongoose.Model<mongoose.Document<unknown, {}> & File>;

// @modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class FileAttachment {
  @prop()
  Id: string;

  @prop()
  Url: string;

  @prop()
  FileName: string;

  @prop()
  CreateAt: string;

  @prop()
  Visible: boolean;
}

// export const FileAttachmentModel = getModelForClass(FileAttachment);

export const FileAttachmentModel = (mongoose.models.FileAttachment || getModelForClass(FileAttachment)) as mongoose.Model<mongoose.Document<unknown, {}> & FileAttachment>;
