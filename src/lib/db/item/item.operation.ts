import { ItemModel, ItemRevisionModel, ItemInput } from "./item.model";
import { connectDB } from "../db-connect";
import { addTagList } from "../tag/tag.operation";
import { createRevisionFunctions } from "../revision/revision.operation";

const functions = createRevisionFunctions(ItemRevisionModel)

const itemAddRevisions = functions.attachRevisionsToData
export const readItemByRevision = functions.readDataByRevisionId
const createItemRevision = functions.createRevisonData


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

  //タグ入力候補用のリストへ追加
  addTagList(item.Tags)

  await createItemRevision(savedItem, commitComment)
  return await itemAddRevisions(savedItem.toJSON(), savedItem.Id);

}

export async function updateItem(id: string, item: ItemInput, commitComment: string) {
  await connectDB()
  const updatedItem = await ItemModel.findByIdAndUpdate(id, item, { new: true });
  if (!updatedItem) {
    return null;
  }


  //タグ入力候補用のリストへ追加
  addTagList(item.Tags)

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

