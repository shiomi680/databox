import { Item, ItemInput } from "@/lib/db/item/item.model";
import { itemComponentInfo, ItemFormData, itemFormDefault } from "./item-defines";

export function toFormData(item?: Item) {
  if (item) {
    const param: ItemFormData = {
      ModelNumber: item.ModelNumber,
      ItemName: item.ItemName,
      ItemDescription: item.ItemDescription,
      Cost: item.Cost.toString(),
      SalePrice: item.SalePrice.toString(),
      Tags: item.Tags,
      Files: item.Files,
      Deleted: item.Deleted
    }
    return param
  } else {
    return itemFormDefault
  }
}

export function toPostData(itemData: ItemFormData, id?: string) {
  const item: ItemInput = {
    Id: id,
    ModelNumber: itemData.ModelNumber,
    ItemName: itemData.ItemName,
    ItemDescription: itemData.ItemDescription,
    Cost: parseFloat(itemData.Cost) || 0,
    SalePrice: parseFloat(itemData.SalePrice) || 0,
    Files: itemData.Files,
    Tags: itemData.Tags,
    Deleted: itemData.Deleted
  }
  return item
}

export const ItemHandle = {
  toFormData,
  toPostData
}

export default ItemHandle