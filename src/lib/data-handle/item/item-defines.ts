
import { ColumnsDef } from "../general-defines"
import path from "path";
import { FieldParam } from "@/components/features/general-form/molecules/grid-text-field";
import { globalConsts } from "@/consts";
import { FieldType } from "@/components/features/general-form/molecules/grid-text-field";
import { FileAttachment } from "@/lib/db/file/file.model";
import { Flag } from "@mui/icons-material";
import { GridFilterModel } from "@mui/x-data-grid";
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
  {
    field: "Deleted",
    headerName: "Deleted"
  }

]

export const defaultGridColumnVisibility = {
  ModelNumber: true,
  ItemName: true,
  ItemDescription: true,
  Cost: false,
  SalePrice: false,
  Deleted: false
}

export const defaultFilter: GridFilterModel = {
  items: [
    {
      field: "Deleted",
      operator: "contains",
      value: "false"
    }
  ]
}


//content画面の設定
export const itemComponentInfo: FieldParam[] = [
  {
    name: "ModelNumber",
    title: "Model Number",
    type: FieldType.text,
    gridSize: 12
  },
  {
    name: "ItemName",
    title: "Item Name",
    type: FieldType.text,
    gridSize: 12
  },
  {
    name: "ItemDescription",
    title: "Item Description",
    type: FieldType.text,
    gridSize: 12,
    rows: 4
  },
  {
    name: "Cost",
    title: "Cost",
    type: FieldType.number,
    gridSize: 6
  },
  {
    name: "SalePrice",
    title: "Sale Price",
    type: FieldType.number,
    gridSize: 6
  }
]

export type ItemFormData = {
  ModelNumber: string,
  ItemName: string,
  ItemDescription: string,
  Cost: string,
  SalePrice: string,
  Files: FileAttachment[],
  Tags: string[],
  Deleted: boolean
}

export const itemFormDefault: ItemFormData = {
  ModelNumber: "",
  ItemName: "",
  ItemDescription: "",
  Cost: "0",
  SalePrice: "0",
  Files: [],
  Tags: [],
  Deleted: false

}