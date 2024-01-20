import { Item } from "@/lib/db/item/item.model";
import { ItemReturn, PostItemApiParams } from "@/lib/data-handle/item/item-action";
import { itemComponentInfo, ItemFormData } from "./item-defines";

import { FileAttachment } from "@/lib/db/file/file.model";


export function toFormData(data: ItemReturn | null) {
  const param: ItemFormData = {
    ModelNumber: data?.ModelNumber || "",
    ItemName: data?.ItemName || "",
    ItemDescription: data?.ItemDescription || "",
    Cost: data?.Cost?.toString() || "0",
    SalePrice: data?.SalePrice?.toString() || "0",
  }
  return param
}

type toPostDataParams = {
  itemData: ItemFormData,
  id: string | undefined,
}

export function toPostData(itemData: ItemFormData, id?: string) {
  const item = {
    ModelNumber: itemData.ModelNumber,
    ItemName: itemData.ItemName,
    ItemDescription: itemData.ItemDescription,
    Cost: parseFloat(itemData.Cost),
    SalePrice: parseFloat(itemData.SalePrice),
    Files: [],
    Tags: [],
  }
  return item
}

export const ItemHandle = {
  toFormData,
  toPostData
}

export default ItemHandle