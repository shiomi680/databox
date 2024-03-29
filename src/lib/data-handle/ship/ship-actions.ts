"use server"
import { readShipping, addNewShipping, updateShipping, readShippingList, shipRevisionService } from "@/lib/db/ship/ship.operation"
import { Shipping, ShippingInput } from '@/lib/db/ship/ship.model'
import { UnwrapPromise } from '@prisma/client/runtime/library'


export type ShippingListReturn = UnwrapPromise<ReturnType<typeof getShippingListAction>>
export type ShippingListElement = ShippingListReturn[number]
export type ShippingReturn = UnwrapPromise<ReturnType<typeof getShippingAction>>
export type PostShippingApiParams = Shipping

export async function getShippingAction(Id: string, revisonId?: string) {
  if (!revisonId) {
    return await readShipping(Id)
  } else {
    return await shipRevisionService.readDataByRevisionId(Id, revisonId)
  }
}

export async function postShippingAction(ship: ShippingInput, commitComment: string) {
  if (ship.Id) {
    return await updateShipping(ship.Id.toString(), ship, commitComment)
  } else {
    return await addNewShipping(ship, commitComment)
  }
}

export async function getShippingListAction() {
  return await readShippingList()
}