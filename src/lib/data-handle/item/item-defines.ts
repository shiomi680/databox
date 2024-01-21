
import { ColumnsDef } from "../general-defines"
import path from "path";
import { FieldParam } from "@/components/general-form/molecules/grid-text-field";
import { globalConsts } from "@/consts";
import { FileAttachment } from "@/lib/db/file/file.model";
const ITEM_PAGE_URL = globalConsts.url.itemPage

//左のテーブル
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
  {
    field: "Tags",
    headerName: "Tags",
  },

]

export const defaultGridColumnVisibility = {
  ModelNumber: true,
  ItemName: true,
  ItemDescription: true,
  Cost: false,
  SalePrice: false,
}


enum fieldType {
  date = "date",
  number = "number",
  text = "text"
}

//content画面の設定
export const itemComponentInfo: FieldParam[] = [
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
    gridSize: 12,
    rows: 4
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

export type ItemFormData = {
  ModelNumber: string,
  ItemName: string,
  ItemDescription: string,
  Cost: string,
  SalePrice: string,
  Files: FileAttachment[],
  Tags: string[]
}

export const itemFormDefault: ItemFormData = {
  ModelNumber: "",
  ItemName: "",
  ItemDescription: "",
  Cost: "",
  SalePrice: "",
  Files: [],
  Tags: []
}