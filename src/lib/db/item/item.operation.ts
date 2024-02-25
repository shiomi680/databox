import { ItemModel, ItemInput, ItemRevisionModel } from "./item.model";
import { connectDB } from "../db-connect";
import { addTagList } from "../tag/tag.operation";
import { RevisionService } from "../revision/revision.operation";

export const itemRevisionService = new RevisionService(ItemRevisionModel)

export async function addNewItem(item: ItemInput, commitComment: string) {
  await connectDB();
  const newItem = new ItemModel(item);
  const savedItem = await newItem.save();

  addTagList(item.Tags); // Add tags to the tag list for input suggestions

  await itemRevisionService.createRevisionData(savedItem, commitComment); // Use itemRevisionService
  return await itemRevisionService.attachRevisionsToData(savedItem.toJSON(), savedItem.Id); // Use itemRevisionService
}

export async function updateItem(id: string, item: ItemInput, commitComment: string) {
  await connectDB();
  const updatedItem = await ItemModel.findByIdAndUpdate(id, item, { new: true });
  if (!updatedItem) {
    return null;
  }

  addTagList(item.Tags); // Add tags to the tag list for input suggestions

  await itemRevisionService.createRevisionData(updatedItem, commitComment); // Use itemRevisionService
  return await itemRevisionService.attachRevisionsToData(updatedItem.toJSON(), updatedItem.Id); // Use itemRevisionService
}

export async function readItemList() {
  await connectDB();
  const items = await ItemModel.find();
  return items.map(x => x.toJSON());
}

export async function readItem(id: string) {
  await connectDB();
  const item = await ItemModel.findById(id);
  if (item) {
    return await itemRevisionService.attachRevisionsToData(item.toJSON(), id); // Use itemRevisionService
  }
}