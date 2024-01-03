import { ShippingModel } from "@prisma/client";
import { ShippingReturn, ShippingListReturn, PostShippingApiParams } from "@/lib/client/shipping-io"

export type ShipFormData = {
  ShipDate: string,
  Title: string,
  ShippingInvoicePrice: string,
}
enum fieldType {
  date = "date",
  number = "number",
  text = "text"
}
type fieldParam = {
  name: string,
  type: string,
  size: number
}

export const componentInfo: fieldParam[] = [
  {
    name: "ShipDate",
    type: fieldType.date,
    size: 12
  },
  {
    name: "Title",
    type: fieldType.text,
    size: 12
  },
  {
    name: "ShippingInvoicePrice",
    type: fieldType.number,
    size: 12
  }
]

export function toFormData(data: ShippingReturn | null) {
  const param: ShipFormData = {
    Title: data?.Title || "",
    ShippingInvoicePrice: data?.ShippingInvoicePrice?.toString() || "0",
    ShipDate: data?.ShipDate || ""
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
    Title: shipData?.Title,
    ShippingInvoicePrice: shipData?.ShippingInvoicePrice ? parseFloat(shipData?.ShippingInvoicePrice) : 0,
    ShipDate: shipData?.ShipDate,
    Files: files
  }
  return param
}
export function toApiData(data: ShipFormData | null, id: number | undefined = undefined) {
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
  toApiData,
  componentInfo
}

export default ShipHandle