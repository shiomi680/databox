import { ShippingModel } from "@prisma/client";
import { Prisma } from '@prisma/client';
import { ShippingReturn, ShippingListReturn, PostShippingApiParams } from "@/lib/client/shipping-io"
import { FieldParam, FieldType } from "@/components/molecules/grid-text-field";
import { globalConsts } from "@/consts";
import path from "path";
import { FileInfo } from "../file-io";

const SHIP_PAGE_URL = globalConsts.url.shippingPage

export const defaultGridColumnVisibility = {
  ShipDate: true,
  ShipFrom: false,
  ShipTo: false,
  Title: true,
  ShippingInvoicePrice: false,
  ShippingInvoiceCurrency: false,
  TradeTerm: false,
  AcquisitionDate: false,
  AcquisitionPrice: false,
  BookValue: false,
  Defrayer: false,
  Comment: false,
  CommentAboutSale: false,
  Gx: false,
  CommentAboutAcquisition: false,
  InvoiceNo: false,
  Carrier: false,
  AwbNo: false,
  ExportPermission: false,
}

type ColumnsDef = {
  field: string,
  headerName: string,
  link?: (formData: any) => string
}

export const gridColumnsDef: ColumnsDef[] = [

  {
    field: "ShipDate",
    headerName: "発送日",

  },
  {
    field: 'Title',
    headerName: 'Title',
    link: (data: any) => path.join(SHIP_PAGE_URL, data.Id.toString())
  },
  {
    field: "ShipFrom",
    headerName: "発送会社",
  },
  {
    field: "ShipTo",
    headerName: "宛先会社",
  },

  {
    field: 'ShippingInvoiceCurrency',
    headerName: 'Invoice価格単位',
  },
  {
    field: 'ShippingInvoicePrice',
    headerName: 'Invoice価格',
  },
  {
    field: 'TradeTerm',
    headerName: '貿易条件',
  },
  {
    field: 'AcquisitionDate',
    headerName: '取得日',
  },
  {
    field: 'AcquisitionPrice',
    headerName: '取得価格',
  },
  {
    field: 'BookValue',
    headerName: '簿価',
  },
  {
    field: 'Gx',
    headerName: 'Gx',
  },
  {
    field: 'CommentAboutAcquisition',
    headerName: '取得に関する備考',
  },
  {
    field: 'InvoiceNo',
    headerName: 'Invoice No',
  },
  {
    field: 'Carrier',
    headerName: '輸送方法',
  },
  {
    field: 'AwbNo',
    headerName: 'AWB No',
  },
  {
    field: 'ExportPermission',
    headerName: '輸出許可',
  },

]

export type ShipFormData = {
  ShipDate: string,
  Title: string,
  ShippingInvoicePrice: string,
  ShipFrom: string,
  ShipTo: string,
  ShippingInvoiceCurrency: string,
  TradeTerm: string,
  AcquisitionDate: string,
  AcquisitionPrice: string,
  BookValue: string,
  Defrayer: string,
  Comment: string,
  CommentAboutSale: string,
  Gx: string,
  CommentAboutAcquisition: string,
  InvoiceNo: string,
  Carrier: string,
  AwbNo: string,
  ExportPermission: string,
}



export const componentInfo: FieldParam[] = [
  {
    name: "ShipDate",
    title: "発送日",
    type: FieldType.date,
    gridSize: 12
  },
  {
    name: "Title",
    title: "Title *",
    type: FieldType.text,
    gridSize: 12
  },

  {
    name: "ShipFrom",
    title: "発送会社",
    type: FieldType.select,
    choices: ["AGG", "AMK", "ANG", "AGM", "AGS", "AGP",],
    gridSize: 6
  },
  {
    name: "ShipTo",
    title: "受取会社",
    type: FieldType.select,
    choices: ["AGG", "AMK", "ANG", "AGM", "AGS", "AGP",],
    gridSize: 6
  },
  {
    name: "ShippingInvoiceCurrency",
    title: "Invoice価格単位",
    type: FieldType.select,
    choices: ["JPY", "USD", "HKD", "SGD", "EUR",],
    gridSize: 3
  },
  {
    name: "ShippingInvoicePrice",
    title: "Invoice価格",
    type: FieldType.number,
    gridSize: 9
  },

  {
    name: "TradeTerm",
    title: "貿易条件",
    type: FieldType.text,
    gridSize: 12
  },
  {
    name: "AcquisitionDate",
    title: "取得日",
    type: FieldType.date,
    gridSize: 12
  },
  {
    name: "AcquisitionPrice",
    title: "取得価格(円)",
    type: FieldType.number,
    gridSize: 6
  },
  {
    name: "BookValue",
    title: "簿価(円)",
    type: FieldType.number,
    gridSize: 6
  },
  {
    name: "Defrayer",
    title: "費用負担",
    type: FieldType.select,
    choices: ["有償", "無償",],
    gridSize: 12
  },

  {
    name: "Gx",
    title: "Gx",
    type: FieldType.text,
    gridSize: 12
  },

  {
    name: "InvoiceNo",
    title: "Invoice No",
    type: FieldType.text,
    gridSize: 12
  },
  {
    name: "Carrier",
    title: "輸送方法",
    type: FieldType.text,
    gridSize: 12
  },
  {
    name: "AwbNo",
    title: "AWB No",
    type: FieldType.text,
    gridSize: 12
  },
  {
    name: "ExportPermission",
    title: "輸出許可",
    type: FieldType.text,
    gridSize: 12
  },
  {
    name: "Comment",
    title: "備考",
    type: FieldType.text,
    gridSize: 12
  },
  {
    name: "CommentAboutSale",
    title: "販売に関する備考",
    type: FieldType.text,
    gridSize: 12
  },
  {
    name: "CommentAboutAcquisition",
    title: "取得に関する備考",
    type: FieldType.text,
    gridSize: 12
  },
]

export function toFormData(data: ShippingReturn | null) {
  const param: ShipFormData = {
    Title: data?.Title || "",
    ShippingInvoicePrice: data?.ShippingInvoicePrice?.toString() || "0",
    ShipDate: data?.ShipDate || "",
    ShipFrom: data?.ShipFrom || "",
    ShipTo: data?.ShipTo || "",
    ShippingInvoiceCurrency: data?.ShippingInvoiceCurrency || "",
    TradeTerm: data?.TradeTerm || "",
    AcquisitionDate: data?.AcquisitionDate || "",
    AcquisitionPrice: data?.AcquisitionPrice?.toString() || "0",
    BookValue: data?.BookValue?.toString() || "0",
    Defrayer: data?.Defrayer || "",
    Comment: data?.Comment || "",
    CommentAboutSale: data?.CommentAboutSale || "",
    Gx: data?.Gx || "",
    CommentAboutAcquisition: data?.CommentAboutAcquisition || "",
    InvoiceNo: data?.InvoiceNo || "",
    Carrier: data?.Carrier || "",
    AwbNo: data?.AwbNo || "",
    ExportPermission: data?.ExportPermission || "",

  }
  return param
}

type toPostDataParams = {
  shipData: ShipFormData,
  id: number | undefined,
  files: FileInfo[]
}

export function toPostData({ shipData, id, files }: toPostDataParams) {
  const param: PostShippingApiParams = {
    Id: id,
    ShipDate: shipData?.ShipDate,
    Title: shipData?.Title,
    ShippingInvoicePrice: shipData?.ShippingInvoicePrice ? new Prisma.Decimal(shipData?.ShippingInvoicePrice) : new Prisma.Decimal(0),
    ShipFrom: shipData?.ShipFrom,
    ShipTo: shipData?.ShipTo,
    ShippingInvoiceCurrency: shipData?.ShippingInvoiceCurrency,
    TradeTerm: shipData?.TradeTerm,
    AcquisitionDate: shipData?.AcquisitionDate,
    AcquisitionPrice: shipData?.AcquisitionPrice ? new Prisma.Decimal(shipData?.AcquisitionPrice) : new Prisma.Decimal(0),

    BookValue: shipData?.BookValue ? new Prisma.Decimal(shipData?.BookValue) : new Prisma.Decimal(0),
    Defrayer: shipData?.Defrayer,
    Comment: shipData?.Comment,
    CommentAboutSale: shipData?.CommentAboutSale,
    Gx: shipData?.Gx,
    CommentAboutAcquisition: shipData?.CommentAboutAcquisition,
    InvoiceNo: shipData?.InvoiceNo,
    Carrier: shipData?.Carrier,
    AwbNo: shipData?.AwbNo,
    ExportPermission: shipData?.ExportPermission,
    Files: files.map(f => ({
      FileId: f.FileId,
      Visible: f.Visible
    }))
  }
  return param
}

export function toApiData(data: ShipFormData | null, id: number | undefined = undefined) {
  const param: PostShippingApiParams = {
    Id: id,
    ShipDate: data?.ShipDate,
    Title: data?.Title,
    ShippingInvoicePrice: data?.ShippingInvoicePrice ? new Prisma.Decimal(data?.ShippingInvoicePrice) : new Prisma.Decimal(0),
    ShipFrom: data?.ShipFrom,
    ShipTo: data?.ShipTo,
    ShippingInvoiceCurrency: data?.ShippingInvoiceCurrency,
    TradeTerm: data?.TradeTerm,
    AcquisitionDate: data?.AcquisitionDate,
    AcquisitionPrice: data?.AcquisitionPrice ? new Prisma.Decimal(data?.AcquisitionPrice) : new Prisma.Decimal(0),
    BookValue: data?.BookValue ? new Prisma.Decimal(data?.BookValue) : new Prisma.Decimal(0),
    Defrayer: data?.Defrayer,
    Comment: data?.Comment,
    CommentAboutSale: data?.CommentAboutSale,
    Gx: data?.Gx,
    CommentAboutAcquisition: data?.CommentAboutAcquisition,
    InvoiceNo: data?.InvoiceNo,
    Carrier: data?.Carrier,
    AwbNo: data?.AwbNo,
    ExportPermission: data?.ExportPermission,
  }
  return param
}

const ShipHandle = {
  toFormData,
  toPostData,
  toApiData,
  componentInfo
}

export default ShipHandle