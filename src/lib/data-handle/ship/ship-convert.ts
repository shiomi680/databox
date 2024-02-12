import { Shipping, ShippingInput } from "@/lib/db/ship/ship.model"
import { componentInfo, ShipFormData, shipFormDefault } from "./ship-defines";

export function toFormData(data?: Shipping) {
  if (data) {
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
      Files: data?.Files || []


    }
    return param
  } else {
    return shipFormDefault
  }
}


export function toPostData(shipData: ShipFormData, id?: string) {
  const param: ShippingInput = {
    Id: id,
    ShipDate: shipData.ShipDate,
    Title: shipData.Title,
    ShippingInvoicePrice: parseFloat(shipData.ShippingInvoicePrice),
    ShipFrom: shipData.ShipFrom,
    ShipTo: shipData.ShipTo,
    ShippingInvoiceCurrency: shipData.ShippingInvoiceCurrency,
    TradeTerm: shipData.TradeTerm,
    AcquisitionDate: shipData.AcquisitionDate,
    AcquisitionPrice: parseFloat(shipData.AcquisitionPrice) || 0,
    BookValue: parseFloat(shipData.BookValue) || 0,
    Defrayer: shipData.Defrayer,
    Comment: shipData.Comment,
    CommentAboutSale: shipData.CommentAboutSale,
    Gx: shipData.Gx,
    CommentAboutAcquisition: shipData.CommentAboutAcquisition,
    InvoiceNo: shipData.InvoiceNo,
    Carrier: shipData.Carrier,
    AwbNo: shipData.AwbNo,
    ExportPermission: shipData.ExportPermission,
    Files: shipData.Files
  }
  return param
}

const ShipHandle = {
  toFormData,
  toPostData
}

export default ShipHandle