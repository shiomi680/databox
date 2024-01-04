import { fetchData, postData } from './data-io'
import {
  ItemApiReturn,
  UpdateItemReturn,
  PostItemApiParams,
  ItemListElement,
  ItemListReturn
} from '../api/item-api'
import { UnwrapPromise } from '@prisma/client/runtime/library'
import { globalConsts } from '@/consts'
import path from 'path'

const ITEM_URL = globalConsts.url.item
const ITEMLIST_URL = globalConsts.url.items

type ItemReturn = UnwrapPromise<ReturnType<typeof getItem>>

export const getItem = async (itemId: number) => {
  const data = await fetchData<ItemApiReturn>(path.join(ITEM_URL, itemId.toString()))
  return data
}

export const updateItem = async (item: PostItemApiParams) => {
  const data = await postData<UpdateItemReturn, PostItemApiParams>(
    ITEM_URL,
    item,
  )
  return data
}

export async function getItemList(): Promise<ItemListReturn> {
  const data = await fetchData<ItemListReturn>(`${ITEMLIST_URL}`)
  return data
}

export type { ItemReturn, UpdateItemReturn, PostItemApiParams, ItemListElement, ItemListReturn }