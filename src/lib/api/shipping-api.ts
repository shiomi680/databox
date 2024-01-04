import { ShippingModel } from '@prisma/client'
import { prisma } from './prisma'
import { UnwrapPromise } from '@prisma/client/runtime/library'
import { toFileInfo } from './file-api/file-api'

export type ShippingApiReturn = UnwrapPromise<ReturnType<typeof getShippingApi>>
export type UpdateShippingReturn = UnwrapPromise<ReturnType<typeof createOrUpdateShipping>>

export type PostShippingApiParams = Partial<
  ShippingModel & {
    Files: number[]

  }
>

export async function getShippingApi(Id: number) {
  const shippingInfo = await prisma.shippingModel.findUnique({
    where: {
      Id: Id
    },
    include: {
      ShippingFileMappings: {
        include: {
          FileModel: true
        }
      }
    }
  })
  if (shippingInfo) {
    const { ShippingFileMappings, ...rest } = shippingInfo
    const rtn = {
      ...rest,
      Files: ShippingFileMappings.map(m => toFileInfo(m.FileModel))
    }

    return rtn
  } else {
    throw new Error(`${shippingInfo} is not exist`)
  }
}



export async function createOrUpdateShipping(shipping: PostShippingApiParams) {
  const { Id, Files, ...inputData } = shipping

  let updatedShip: ShippingModel;

  if (Id) {
    updatedShip = await prisma.shippingModel.update({
      where: { Id },
      data: inputData,
    });
  } else {
    updatedShip = await prisma.shippingModel.create({
      data: {
        ...inputData,
        Title: inputData.Title || 'no data'
      },
    });
  }

  const operations = [];
  if (updatedShip && updatedShip.Id) {
    operations.push(
      prisma.shippingFileMapping.deleteMany({
        where: {
          ShippingId: updatedShip.Id
        }
      }))
    if (Files) {
      const fileMappings = Files.map(fileId => ({
        ShippingId: updatedShip.Id,
        FileId: fileId,
      }));
      fileMappings.forEach(fileMapping => {
        operations.push(
          prisma.shippingFileMapping.create({
            data: fileMapping,
          })
        );
      });
    }

    await prisma.$transaction(operations);
  }
  return await getShippingApi(updatedShip.Id)
}


export type ShippingListReturn = UnwrapPromise<ReturnType<typeof getShippingListApi>>
export type ShippingListElement = ShippingListReturn[number]

export async function getShippingListApi() {
  const items = await prisma.shippingModel.findMany({
  })
  return items
}
