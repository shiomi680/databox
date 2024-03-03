import { post, prop, getModelForClass, modelOptions, Severity, mongoose, pre } from '@typegoose/typegoose';
import { Types } from 'mongoose';
@modelOptions({
})
export class Tag {
  @prop({ default: () => new Types.ObjectId() })
  _id: Types.ObjectId;


  @prop()
  TagName: string;
}

export const TagModel = (mongoose.models.Tag || getModelForClass(Tag)) as mongoose.Model<mongoose.Document<unknown, {}> & Tag>;

