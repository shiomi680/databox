import { post, prop, getModelForClass, modelOptions, Severity, mongoose, pre, buildSchema } from '@typegoose/typegoose';
import { FileAttachment } from "../file/file.model"
import { Types } from 'mongoose';
import { ExtendedRevision, createExtendedRevisionModel, createExtendedRevisionSchema } from '../revision/revision.model';


@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret._id;
      }
    },
    toObject: { virtuals: true }
  }
})
export class Item {
  @prop({ default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  public get Id() {
    return this._id.toString()
  }

  @prop()
  ModelNumber: string;

  @prop()
  ItemName: string;

  @prop()
  ItemDescription: string;

  @prop()
  Cost: number;

  @prop()
  SalePrice: number;

  @prop({ type: () => [FileAttachment] })
  Files: FileAttachment[];

  @prop({ type: () => [String] })
  Tags: string[];

}

export type ItemInput = Omit<Item, '_id' | "Id"> & { Id?: string };
// export const ItemModel = getModelForClass(Item);
export const ItemModel = (mongoose.models.Item || getModelForClass(Item)) as mongoose.Model<mongoose.Document<unknown, {}> & Item>;


//revision 設定
const itemSchema = buildSchema(Item)
export const ItemRevisionSchema = createExtendedRevisionSchema(itemSchema)

export const ItemRevisionModel = createExtendedRevisionModel('ItemRevision', ItemRevisionSchema);
