import { Prisma } from "@prisma/client";
import { ShippingReturn, PostShippingApiParams } from "@/lib/data-handle/ship/ship-actions";
import { FileAttachment } from "@/lib/db/file/file.model";

import { componentInfo, ShipFormData } from "./ship-defines";

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
  id: string | undefined,
  files: FileAttachment[],
}

export function toPostData({ shipData, id, files }: toPostDataParams) {
  const param = {
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

const ShipHandle = {
  toFormData,
  toPostData
}

export default ShipHandle