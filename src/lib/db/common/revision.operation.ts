
import { connectDB } from "../db-connect";
import { RevisionInfo } from "../common/revision.model";
import { Model, Document } from 'mongoose';
import { mongoose } from '@typegoose/typegoose';
import { Item } from "../item/item.model";

export function createRevisionFunctions(revisionModel: mongoose.Model<Document, any>) {
  const createRevisonData = async (item: any, commitComment: string) => {
    const revision = new revisionModel({
      Data: item,
      ObjectId: item.Id,
      CommitComment: commitComment
    });
    return await revision.save();
  }
  const readRevisions = async (objectId: string) => {
    await connectDB()
    const revisions: any[] = await revisionModel.find({ ObjectId: objectId }, "Id CommitComment CreateAt").sort('-CreateAt');
    const rtn: RevisionInfo[] = revisions.map(x => x.toJSON())
    return rtn
  }

  const attachRevisionsToData = async (item: any, objectId: string) => {
    const revisions = await readRevisions(objectId)
    const id = item.Id || item.id || item._id?.toString() || undefined
    const rtn = {
      ...item,
      Id: id,
      Revisions: revisions
    };
    return rtn
  }
  const readDataByRevisionId = async (dataId: string, revisionId: string) => {
    await connectDB()
    const revisionQ = await revisionModel.findById(revisionId).exec();
    const revision = revisionQ.toObject()

    if (revision && revision.Data) {

      return await attachRevisionsToData(revision.Data, dataId);
    } else {
      return
    }
  }

  return {
    createRevisonData,
    readRevisions,
    readDataByRevisionId,
    attachRevisionsToData
  }
}