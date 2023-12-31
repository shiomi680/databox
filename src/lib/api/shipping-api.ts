import { ShippingModel } from '@prisma/client'
import { prisma } from './prisma'
import { UnwrapPromise } from '@prisma/client/runtime/library'

export type ShippingApiReturn = UnwrapPromise<ReturnType<typeof getShippingApi>>
export type UpdateShippingReturn = UnwrapPromise<ReturnType<typeof createOrUpdateShipping>>

export type PostShippingApiParams = Partial<
  Omit<ShippingModel, 'ShipDate' | 'AcquisitionDate'> & {
    ShipDate: string | null
    AcquisitionDate: string | null

  }
>


// export type PostShippingApiParams = Partial<ShippingModel>


export async function getShippingApi(shippingId: number) {
  const shippingInfo = await prisma.shippingModel.findUnique({
    where: {
      ShippingId: shippingId
    },
    include: {
      ShippingFileMapping: true
    }
  })
  if (shippingInfo) {
    const rtn = {
      ...shippingInfo,
      ShipDate: shippingInfo.ShipDate?.toISOString(),
      AcquisitionDate: shippingInfo.AcquisitionDate?.toISOString()
    }
    return rtn
  } else {
    throw new Error(`${shippingInfo} is not exist`)
  }
}

// export async function createNewShipping() {
//     const shipping={
//         Title:""
//     }
//     const newShiping = await prisma.shipping.create({
//       data: shipping,
//     })
//     return newShiping.ShippingId
//   }




// export async function updateShippingApi(param: PostShippingApiParams) {
//   const {ShippingId, ...rest} = param
//   const created = await 
//   const created = await createOrUpdateShi
//   const { Tags, ...rest } = param
//   const inputItem = {
//     ...rest,
//     Cost: rest?.Cost ? new Prisma.Decimal(rest.Cost) : null,
//     SalePrice: rest?.SalePrice ? new Prisma.Decimal(rest.SalePrice) : null,
//   }
//   //item作成
//   const createdItem = await createOrUpdateShipping(inputItem)
//   //タグの設定
//   const createTags = await updateTagMap(createdItem.ItemID, Tags ?? [])
//   return {
//     ...createdItem,
//     Tags: createTags,
//   }
// }
export async function createOrUpdateShipping(shipping: PostShippingApiParams) {
  if (shipping.ShippingId) {
    const { ShippingId, ...inputData } = shipping
    return await prisma.shippingModel.update({
      where: {
        ShippingId: ShippingId,
      },
      data: {
        ...inputData,
        ShipDate: shipping.ShipDate ? new Date(shipping.ShipDate) : null,
        AcquisitionDate: shipping.AcquisitionDate ? new Date(shipping.AcquisitionDate) : null
      }
    }
    )
  } else {
    const { ShippingId, Title = "", ShipDate, AcquisitionDate, ...inputData } = shipping

    return await prisma.shippingModel.create({
      data: {
        ...inputData,
        Title: Title,
        ShipDate: ShipDate ? new Date(ShipDate) : null,
        AcquisitionDate: AcquisitionDate ? new Date(AcquisitionDate) : null
      }
    })
  }
}


export type ShippingListReturn = UnwrapPromise<ReturnType<typeof getShippingListApi>>
export type ShippingListElement = ShippingListReturn[number]

export async function getShippingListApi() {
  const items = await prisma.shippingModel.findMany({
  })
  return items
}
