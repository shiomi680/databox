import { ItemModel, ItemRevisionModel, Item, ItemInput, ItemRevisionSchema } from "./item.model";
import { connectDB } from "../db-connect";
import { RevisionInfo } from "../revision/revision.model";
import { createRevisionFunctions } from "../revision/revision.operation";


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
  await createItemRevision(savedItem, commitComment)
  return await itemAddRevisions(savedItem.toJSON(), savedItem.Id);

}

export async function updateItem(id: string, item: ItemInput, commitComment: string) {
  await connectDB()
  const updatedItem = await ItemModel.findByIdAndUpdate(id, item, { new: true });
  if (!updatedItem) {
    return null;
  }

  await createItemRevision(updatedItem, commitComment)
  return await itemAddRevisions(updatedItem.toJSON(), updatedItem.Id);
}

export async function readItemList() {
  await connectDB()
  const items = await ItemModel.find();
  const rtn = items.map(x => x.toJSON());
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

const functions = createRevisionFunctions(ItemRevisionModel)

const itemAddRevisions = functions.attachRevisionsToData
export const readItemByRevision = functions.readDataByRevisionId
const createItemRevision = functions.createRevisonData
