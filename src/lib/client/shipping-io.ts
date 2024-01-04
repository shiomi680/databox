import { fetchData, postData } from './data-io'
import {
  ShippingApiReturn,
  UpdateShippingReturn,
  PostShippingApiParams,
  ShippingListElement,
  ShippingListReturn
} from '../api/shipping-api'
import { UnwrapPromise } from '@prisma/client/runtime/library'
import { globalConsts } from '@/consts'
import path from 'path'

const SHIPPING_URL = globalConsts.url.shipping
const SHIPPINGLIST_URL = globalConsts.url.shippings

type ShippingReturn = UnwrapPromise<ReturnType<typeof getShipping>>

export const getShipping = async (shippingId: number) => {
  const data = await fetchData<ShippingApiReturn>(path.join(SHIPPING_URL, shippingId.toString()))
  return data
}

//送信ボタンを押したとき
export const updateShipping = async (item: PostShippingApiParams) => {
  const data = await postData<UpdateShippingReturn, PostShippingApiParams>(
    SHIPPING_URL,
    item,
  )
  return data
}


export async function getShippingList(): Promise<ShippingListReturn> {
  const data = await fetchData<ShippingListReturn>(`${SHIPPINGLIST_URL}`)
  return data
}


export type { ShippingReturn, UpdateShippingReturn, PostShippingApiParams, ShippingListElement, ShippingListReturn }
