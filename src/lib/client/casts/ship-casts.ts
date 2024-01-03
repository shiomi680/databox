import { ShippingModel } from "@prisma/client";
import { ShippingReturn, ShippingListReturn, PostShippingApiParams } from "@/lib/client/shipping-io"
import { ShipData } from "@/components/item-panel/item-panel"

export function toFormData(data: ShippingReturn | null) {
  const param: ShipData = {
    Title: data?.Title || "",
    ShippingInvoicePrice: data?.ShippingInvoicePrice?.toString() || "0",
    ShipDate: data?.ShipDate || ""
  }
  return param
}

type toPostDataParams = {
  shipData: ShipData,
  id: number | undefined,
  files: number[] | undefined
}
export function toPostData({ shipData, id, files }: toPostDataParams) {
  const param: PostShippingApiParams = {
    Id: id,
    Title: shipData?.Title,
    ShippingInvoicePrice: shipData?.ShippingInvoicePrice ? parseFloat(shipData?.ShippingInvoicePrice) : 0,
    ShipDate: shipData?.ShipDate,
    Files: files
  }
  return param
}
export function toApiData(data: ShipData | null, id: number | undefined = undefined) {
  const param: PostShippingApiParams = {
    Id: id,
    Title: data?.Title,
    ShippingInvoicePrice: data?.ShippingInvoicePrice ? parseFloat(data?.ShippingInvoicePrice) : 0,
    ShipDate: data?.ShipDate
  }
  return param
}
const ShipHandle = {
  toFormData,
  toPostData,
  toApiData
}

export default ShipHandle