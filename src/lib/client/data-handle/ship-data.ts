import { ShippingModel } from "@prisma/client";
import { ShippingReturn, ShippingListReturn, PostShippingApiParams } from "@/lib/client/shipping-io"
import { FieldParam } from "@/components/atom/gridTextField";

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

enum fieldType {
  date = "date",
  number = "number",
  text = "text"
}

export const componentInfo: FieldParam[] = [
  {
    name: "ShipDate",
    type: fieldType.date,
    gridSize: 12
  },
  {
    name: "Title",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "ShippingInvoicePrice",
    type: fieldType.number,
    gridSize: 12
  },
  {
    name: "ShipFrom",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "ShipTo",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "ShippingInvoiceCurrency",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "TradeTerm",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "AcquisitionDate",
    type: fieldType.date,
    gridSize: 12
  },
  {
    name: "AcquisitionPrice",
    type: fieldType.number,
    gridSize: 12
  },
  {
    name: "BookValue",
    type: fieldType.number,
    gridSize: 12
  },
  {
    name: "Defrayer",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "Comment",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "CommentAboutSale",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "Gx",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "CommentAboutAcquisition",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "InvoiceNo",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "Carrier",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "AwbNo",
    type: fieldType.text,
    gridSize: 12
  },
  {
    name: "ExportPermission",
    type: fieldType.text,
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
  files: number[] | undefined
}

export function toPostData({ shipData, id, files }: toPostDataParams) {
  const param: PostShippingApiParams = {
    Id: id,
    ShipDate: shipData?.ShipDate,
    Title: shipData?.Title,
    ShippingInvoicePrice: shipData?.ShippingInvoicePrice ? parseFloat(shipData?.ShippingInvoicePrice) : 0,
    ShipFrom: shipData?.ShipFrom,
    ShipTo: shipData?.ShipTo,
    ShippingInvoiceCurrency: shipData?.ShippingInvoiceCurrency,
    TradeTerm: shipData?.TradeTerm,
    AcquisitionDate: shipData?.AcquisitionDate,
    AcquisitionPrice: shipData?.AcquisitionPrice ? parseFloat(shipData?.AcquisitionPrice) : 0,
    BookValue: shipData?.BookValue ? parseFloat(shipData?.BookValue) : 0,
    Defrayer: shipData?.Defrayer,
    Comment: shipData?.Comment,
    CommentAboutSale: shipData?.CommentAboutSale,
    Gx: shipData?.Gx,
    CommentAboutAcquisition: shipData?.CommentAboutAcquisition,
    InvoiceNo: shipData?.InvoiceNo,
    Carrier: shipData?.Carrier,
    AwbNo: shipData?.AwbNo,
    ExportPermission: shipData?.ExportPermission,
    Files: files
  }
  return param
}

export function toApiData(data: ShipFormData | null, id: number | undefined = undefined) {
  const param: PostShippingApiParams = {
    Id: id,
    ShipDate: data?.ShipDate,
    Title: data?.Title,
    ShippingInvoicePrice: data?.ShippingInvoicePrice ? parseFloat(data?.ShippingInvoicePrice) : 0,
    ShipFrom: data?.ShipFrom,
    ShipTo: data?.ShipTo,
    ShippingInvoiceCurrency: data?.ShippingInvoiceCurrency,
    TradeTerm: data?.TradeTerm,
    AcquisitionDate: data?.AcquisitionDate,
    AcquisitionPrice: data?.AcquisitionPrice ? parseFloat(data?.AcquisitionPrice) : 0,
    BookValue: data?.BookValue ? parseFloat(data?.BookValue) : 0,
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