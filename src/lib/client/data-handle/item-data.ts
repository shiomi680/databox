import { ItemModel } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { ItemReturn, ItemListReturn, PostItemApiParams } from "@/lib/client/item-io"
import { FieldParam } from "@/components/molecules/grid-text-field";
import { globalConsts } from "@/consts";
import path from "path";

const ITEM_PAGE_URL = globalConsts.url.itemPage
export const defaultGridColumnVisibility = {
  ModelNumber: true,
  ItemName: true,
  ItemDescription: true,
  Cost: false,
  SalePrice: false,
}

type ColumnsDef = {
  field: string,
  headerName: string,
  link?: (formData: any) => string
}

export const gridColumnsDef: ColumnsDef[] = [
  {
    field: "ModelNumber",
    headerName: "Model Number",
    link: (data: any) => path.join(ITEM_PAGE_URL, data.Id.toString())
  },
  {
    field: "ItemName",
    headerName: "Item Name",
    link: (data: any) => path.join(ITEM_PAGE_URL, data.Id.toString())
  },
  {
    field: "ItemDescription",
    headerName: "Item Description",
  },
  {
    field: "Cost",
    headerName: "Cost",
  },
  {
    field: "SalePrice",
    headerName: "Sale Price",
  },
]

export type ItemFormData = {
  ModelNumber: string,
  ItemName: string,
  ItemDescription: string,
  Cost: string,
  SalePrice: string,
}

enum fieldType {
  date = "date",
  number = "number",
  text = "text"
}

export const componentInfo: FieldParam[] = [
  {
    name: "ModelNumber",
    title: "Model Number",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "ItemName",
    title: "Item Name",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "ItemDescription",
    title: "Item Description",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "Cost",
    title: "Cost",
    type: fieldType.number,
    gridSize: 6
  },
  {
    name: "SalePrice",
    title: "Sale Price",
    type: fieldType.number,
    gridSize: 6
  },
]

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
  files: number[] | undefined
}

export function toPostData({ itemData, id, files }: toPostDataParams) {
  const param: PostItemApiParams = {
    Id: id,
    ModelNumber: itemData?.ModelNumber,
    ItemName: itemData?.ItemName,
    ItemDescription: itemData?.ItemDescription,
    Cost: itemData?.Cost ? new Prisma.Decimal(parseFloat(itemData?.Cost)) : new Prisma.Decimal(0),
    SalePrice: itemData?.SalePrice ? new Prisma.Decimal(parseFloat(itemData?.SalePrice)) : new Prisma.Decimal(0),
    Files: files
  }
  return param
}

const ItemHandle = {
  toFormData,
  toPostData,
  componentInfo
}

export default ItemHandle