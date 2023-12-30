import { ShippingModel } from '@prisma/client'
import { prisma } from './prisma'
import { UnwrapPromise } from '@prisma/client/runtime/library'

export type ShippingReturn = UnwrapPromise<ReturnType<typeof getShippingApi>>
export type UpdateShippingReturn = UnwrapPromise<ReturnType<typeof createOrUpdateShipping>>

export type PostShippingApiParams = Partial<ShippingModel>

export async function getShippingApi(shippingId:number) {
    const shippingInfo=await prisma.shippingModel.findUnique({
        where:{
            ShippingId:shippingId
        },
        include:{
            Files:true
        }
    })
    if (shippingInfo) {
        return shippingInfo
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
export async function createOrUpdateShipping(shipping: Partial<ShippingModel>) {

  if (shipping.ShippingId) {
    const { ShippingId, ...inputData } = shipping
    return await prisma.shippingModel.update({
      where: {
        ShippingId: ShippingId,
      },
      data: inputData,
    })
  } else{
    const { ShippingId,Title ="", ...inputData } = shipping
    return await prisma.shippingModel.create({ data: { ...inputData, Title } })
  
  }
}


export type ShippingListReturn = UnwrapPromise<ReturnType<typeof getShippingListApi>>
export type ShippingListElement = ShippingListReturn[number]

export async function getShippingListApi() {
  const items = await prisma.shippingModel.findMany({
  })
  return items
}
