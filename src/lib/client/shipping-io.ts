import { fetchData, postData } from './data-io'
import {
    ShippingReturn,
    UpdateShippingReturn,
    PostShippingApiParams,
    ShippingListElement,
    ShippingListReturn
} from '../api/shipping-api'

export const getShipping = async (shippingId: number): Promise<ShippingReturn> => {
  const data = await fetchData<ShippingReturn>(`/api/shipping/${shippingId}`)
  return data
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


export type { ShippingReturn, UpdateShippingReturn, PostShippingApiParams ,ShippingListElement,ShippingListReturn}
