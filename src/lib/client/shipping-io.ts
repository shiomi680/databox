import { fetchData, postData } from './data-io'
import {
  ShippingApiReturn,
  UpdateShippingReturn,
  PostShippingApiParams,
  ShippingListElement,
  ShippingListReturn
} from '../api/shipping-api'
import { UnwrapPromise } from '@prisma/client/runtime/library'

type ShippingReturn = UnwrapPromise<ReturnType<typeof getShipping>>

export const getShipping = async (shippingId: number) => {
  const data = await fetchData<ShippingApiReturn>(`/api/shipping/${shippingId}`)
  const rtn = {
    ...data,
    AcquisitionDate: data.AcquisitionDate ? new Date(data.AcquisitionDate) : null,
    ShipDate: data.ShipDate ? new Date(data.ShipDate) : null
  }

  return rtn
}

//送信ボタンを押したとき
export const updateShipping = async (item: PostShippingApiParams) => {
  const data = await postData<UpdateShippingReturn, PostShippingApiParams>(
    `/api/shipping/`,
    item,
  )
  return data
}


export async function getShippingList(): Promise<ShippingListReturn> {
  const data = await fetchData<ShippingListReturn>(`/api/shippings/`)
  return data
}


export type { ShippingReturn, UpdateShippingReturn, PostShippingApiParams, ShippingListElement, ShippingListReturn }
