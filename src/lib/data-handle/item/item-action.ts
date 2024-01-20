"use server"
import { readItem, addNewItem, updateItem, readItemByRevision, readItemList } from "@/lib/db/item/item.operation"
import { Item, ItemInput } from '@/lib/db/item/item.model'
import { UnwrapPromise } from '@prisma/client/runtime/library'

export type ItemListReturn = UnwrapPromise<ReturnType<typeof getItemListAction>>
export type ItemListElement = ItemListReturn[number]
export type ItemReturn = UnwrapPromise<ReturnType<typeof getItemAction>>
export type PostItemApiParams = Item

export async function getItemAction(Id: string, revisonId?: string) {
  if (!revisonId) {
    return await readItem(Id)
  } else {
    return await readItemByRevision(Id, revisonId)
  }
}



export async function postItemAction(item: ItemInput, commitComment: string) {
  if (item.id) {
    return await updateItem(item.id.toString(), item, commitComment)
  } else {
    return await addNewItem(item, commitComment)
  }

}


export async function getItemListAction() {
  return await readItemList()
}