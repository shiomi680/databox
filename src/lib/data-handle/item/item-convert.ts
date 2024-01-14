import { Prisma } from "@prisma/client";
import { ItemReturn, PostItemApiParams } from "@/lib/data-handle/item/item-action";

import { FileInfo } from "../../client/file-io";
import { itemComponentInfo, ItemFormData } from "./item-defines";


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
  id: number | undefined,
  files: FileInfo[] | undefined
  tags: string[]
  commitComment: string
}

export function toPostData({ itemData, id, files, tags, commitComment }: toPostDataParams) {
  const param: PostItemApiParams = {
    CommitComment: commitComment,
    ItemModelId: id,
    ModelNumber: itemData?.ModelNumber,
    ItemName: itemData?.ItemName,
    ItemDescription: itemData?.ItemDescription,
    Cost: itemData?.Cost ? new Prisma.Decimal(parseFloat(itemData?.Cost)) : new Prisma.Decimal(0),
    SalePrice: itemData?.SalePrice ? new Prisma.Decimal(parseFloat(itemData?.SalePrice)) : new Prisma.Decimal(0),
    Files: files?.map(f => ({
      FileId: f.FileId,
      Visible: f.Visible
    })) || [],
    Tags: tags
  }
  return param
}

const ItemHandle = {
  toFormData,
  toPostData
}

export default ItemHandle