import { ItemModel, ItemRevisionModel, Item, ItemInput, ItemRevision } from "./item.model";
import { connectDB } from "../db-connect";
import { RevisionInfo } from "../common/revision.model";


export async function addNewItem(item: ItemInput, commitComment: string) {
  await connectDB()
  // const newItem = new ItemModel(item);
  const newItem = new ItemModel({
    ModelNumber: item.ModelNumber,
    ItemName: item.ItemName,
    ItemDescription: item.ItemDescription,
    Cost: item.Cost,
    SalePrice: item.SalePrice,
    Files: item.Files,
    Tags: item.Tags
  });
  const savedItem = await newItem.save();

  const revision = new ItemRevisionModel({
    Item: savedItem,
    ObjectId: savedItem._id.toString(),
    CommitComment: commitComment
  });
  await revision.save();

  return await itemAddRevisions(savedItem.toJSON(), savedItem.Id);

}

export async function updateItem(id: string, item: ItemInput, commitComment: string) {
  await connectDB()
  const updatedItem = await ItemModel.findByIdAndUpdate(id, item, { new: true });
  if (!updatedItem) {
    return null;
  }

  const revision = new ItemRevisionModel({
    Item: updatedItem,
    ObjectId: updatedItem.Id,
    CommitComment: commitComment
  });
  await revision.save();

  return await itemAddRevisions(updatedItem.toJSON(), updatedItem.Id);
}

export async function readItemList() {
  await connectDB()
  const items = await ItemModel.find();
  const rtn = items.map(x => x.toJSON());
  console.log(rtn)
  return rtn
}

export async function readItem(id: string) {
  await connectDB()
  const item = await ItemModel.findById(id);
  if (item) {
    const rtn = await itemAddRevisions(item.toJSON(), id);
    return rtn
  }
}


export async function readItemByRevision(itemId: string, revisionId: string) {
  await connectDB()
  const revision = await ItemRevisionModel.findById(revisionId);
  if (revision?.Item) {
    return await itemAddRevisions(revision.Item, itemId);
  } else {
    return
  }
}



async function getTargetItemsRevisions(objectId: string) {
  await connectDB()
  const revisions = await ItemRevisionModel.find({ ObjectId: objectId }, "_id CommitComment CreateAt").sort('-CreateAt');
  const rtn: RevisionInfo[] = revisions.map(x => x.toJSON())
  return rtn
}

async function itemAddRevisions(item: Item, objectId: string) {
  await connectDB()
  const revisions = await getTargetItemsRevisions(objectId)
  return {
    ...item,
    Id: item.Id,
    Revisions: revisions
  };
}