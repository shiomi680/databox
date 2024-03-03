"use server"
import { readItem, addNewItem, updateItem, itemRevisionService, readItemList, deleteItem } from "@/lib/db/item/item.operation"
import { Item, ItemInput } from '@/lib/db/item/item.model'

export async function getItemAction(Id: string, revisonId?: string) {
  if (!revisonId) {
    return await readItem(Id)
  } else {
    return await itemRevisionService.readDataByRevisionId(Id, revisonId)
  }
}

export async function deleteItemAction(Id: string) {
  return await deleteItem(Id)
}


export async function postItemAction(item: ItemInput, commitComment: string) {
  if (item.Id) {
    return await updateItem(item.Id.toString(), item, commitComment)
  } else {
    return await addNewItem(item, commitComment)
  }

}


export async function getItemListAction() {
  return await readItemList()
}