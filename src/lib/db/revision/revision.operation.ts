import { connectDB } from "../db-connect";
import { RevisionInfo } from "./revision.model";
import { mongoose } from '@typegoose/typegoose';

export function createRevisionFunctions(revisionModel: mongoose.Model<Document, any>) {
  const createRevisionData = async (entity: any, commitComment: string) => {
    const revision = new revisionModel({
      Data: entity,
      ObjectId: entity.Id,
      CommitComment: commitComment
    });
    return await revision.save();
  };
  const readRevisions = async (objectId: string) => {
    await connectDB();
    const revisions: any[] = await revisionModel.find({ ObjectId: objectId }, "Id CommitComment CreateAt").sort('-CreateAt');
    return revisions.map(x => x.toJSON()) as RevisionInfo[];
  };
  const attachRevisionsToData = async (entity: any, objectId: string) => {
    const revisions = await readRevisions(objectId);
    return {
      ...entity,
      Id: objectId,
      Revisions: revisions
    };
  };
  const readDataByRevisionId = async (entityId: string, revisionId: string) => {
    await connectDB();
    const revision = await revisionModel.findById(revisionId).exec();
    if (revision && revision.toObject().Data) {
      return await attachRevisionsToData(revision.toObject().Data, entityId);
    }
  };

  return {
    createRevisionData,
    readRevisions,
    readDataByRevisionId,
    attachRevisionsToData
  }
}

export class RevisionService {
  createRevisionData: (entity: any, commitComment: string) => Promise<any>;
  readRevisions: (objectId: string) => Promise<any[]>;
  readDataByRevisionId: (entityId: string, revisionId: string) => Promise<any>;
  attachRevisionsToData: (entity: any, objectId: string) => Promise<any>;

  constructor(revisionModel: mongoose.Model<Document, any>) {
    const { createRevisionData, readRevisions, readDataByRevisionId, attachRevisionsToData } = createRevisionFunctions(revisionModel);
    this.createRevisionData = createRevisionData;
    this.readRevisions = readRevisions;
    this.readDataByRevisionId = readDataByRevisionId;
    this.attachRevisionsToData = attachRevisionsToData;
  }
}