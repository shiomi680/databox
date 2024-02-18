import { post, prop, getModelForClass, modelOptions, Severity, mongoose, pre } from '@typegoose/typegoose';
import { FileAttachment } from "../file/file.model"
import { Types } from 'mongoose';
import { RevisionBase } from '../revision/revision.model';

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
export class Shipping {
  @prop({ default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  public get Id() {
    return this._id.toString()
  }

  @prop()
  ShipDate: string;

  @prop()
  ShipFrom: string;

  @prop()
  ShipTo: string;

  @prop()
  Title: string;

  @prop()
  ShippingInvoicePrice: number;

  @prop()
  ShippingInvoiceCurrency: string;

  @prop()
  TradeTerm: string;

  @prop()
  AcquisitionDate: string;

  @prop()
  AcquisitionPrice: number;

  @prop()
  BookValue: number;

  @prop()
  Defrayer: string;

  @prop()
  Comment: string;

  @prop()
  CommentAboutSale: string;

  @prop()
  Gx: string;

  @prop()
  CommentAboutAcquisition: string;

  @prop()
  InvoiceNo: string;

  @prop()
  Carrier: string;

  @prop()
  AwbNo: string;

  @prop()
  ExportPermission: string;

  @prop({ type: () => [FileAttachment] })
  Files: FileAttachment[];

}


export type ShippingInput = Omit<Shipping, '_id' | "Id"> & { Id?: string };
export const ShippingModel = (mongoose.models.Shipping || getModelForClass(Shipping)) as mongoose.Model<mongoose.Document<unknown, {}> & Shipping>;

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
export class ShippingRevision extends RevisionBase {

  @prop({ ref: () => Shipping })
  Shipping: Shipping;
}

export const ShippingRevisionModel = (mongoose.models.ShippingRevision || getModelForClass(ShippingRevision)) as mongoose.Model<mongoose.Document<unknown, {}> & ShippingRevision>;