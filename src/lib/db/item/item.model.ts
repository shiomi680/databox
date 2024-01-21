import { post, prop, getModelForClass, modelOptions, Severity, mongoose, pre } from '@typegoose/typegoose';
import { FileAttachment } from "../file/file.model"
import { Types } from 'mongoose';
import { RevisionBase } from '../common/revision.model';


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


// @post<RevisionBase>('save', function (doc) {
//   doc.Id = doc._id.toString();
// })


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
export class ItemRevision extends RevisionBase {

  @prop({ ref: () => Item })
  Item: Item;
}


export const ItemRevisionModel = (mongoose.models.ItemRevision || getModelForClass(ItemRevision)) as mongoose.Model<mongoose.Document<unknown, {}> & ItemRevision>;
