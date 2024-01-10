import { ShippingModel, ShippingRevision } from '@prisma/client'
import { prisma } from './prisma'
import { toFileInfo } from './file-api/file-api'
import { UnwrapPromise } from '@prisma/client/runtime/library'

export type ShippingApiReturn = UnwrapPromise<ReturnType<typeof getShippingApi>>
export type UpdateShippingReturn = UnwrapPromise<ReturnType<typeof createOrUpdateShipping>>

type ShippingRevisionSubset = Omit<ShippingRevision, 'ShippingRevisionId' | 'createdAt'>;

export type PostShippingApiParams = Partial<
  ShippingRevisionSubset & {
    Files: {
      FileId: number,
      Visible: boolean
    }[]
  }
>

export async function getShippingApi(Id: number) {
  const shippingInfo = await prisma.shippingModel.findUnique({
    where: {
      ShippingId: Id
    },
    include: {
      ShippingRevisions: {
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          ShippingFileMappings: {
            include: {
              FileModel: true
            }
          }
        }
      }
    }
  })

  if (shippingInfo && shippingInfo.ShippingRevisions.length > 0) {
    const latestRevision = shippingInfo.ShippingRevisions[0];
    const { ShippingFileMappings, ...rest } = latestRevision;
    const rtn = {
      ...rest,
      Files: ShippingFileMappings.map(m => toFileInfo(m.FileModel, m.Visible)),
      Revisions: shippingInfo.ShippingRevisions.map(rev => ({
        createdAt: rev.createdAt,
        CommitComment: rev.CommitComment
      }))
    }

    return rtn;
  } else {
    throw new Error(`Shipping with id ${Id} does not exist or has no revisions`)
  }
}

export async function createOrUpdateShipping(shipping: PostShippingApiParams) {
  const { ShippingModelId, Files, ...inputData } = shipping

  let updatedShipping: ShippingModel;

  if (ShippingModelId) {
    const foundShipping = await prisma.shippingModel.findUnique({
      where: { ShippingId: ShippingModelId }
    })
    if (foundShipping) {
      updatedShipping = foundShipping
    }
    else {
      updatedShipping = await prisma.shippingModel.create({
        data: {}
      })
    }
  } else {
    updatedShipping = await prisma.shippingModel.create({
      data: {}
    })
  }

  // Create a new revision
  const newRevision = await prisma.shippingRevision.create({
    data: {
      ...inputData,
      ShippingModelId: updatedShipping.ShippingId,
      CommitComment: inputData.CommitComment || '',
    }
  });

  // Update file mappings
  const operations: any = [];
  if (newRevision && newRevision.ShippingRevisionId) {
    if (Files) {
      const fileMappings = Files.map(file => ({
        ShippingRevisionId: newRevision.ShippingRevisionId,
        FileId: file.FileId,
        Visible: file.Visible
      }));
      fileMappings.forEach(fileMapping => {
        operations.push(
          prisma.shippingFileMapping.create({
            data: fileMapping
          })
        );
      });
    }

    await prisma.$transaction(operations);
  }
  return await getShippingApi(updatedShipping.ShippingId)
}

export type ShippingListReturn = UnwrapPromise<ReturnType<typeof getShippingListApi>>
export type ShippingListElement = ShippingListReturn[number]

export async function getShippingListApi() {
  const items = await prisma.shippingModel.findMany({
    include: {
      ShippingRevisions: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1,
        include: {
          ShippingFileMappings: {
            include: {
              FileModel: true
            }
          }
        }
      },
    }
  })
  return items.map(item => {
    const latestRevision = item.ShippingRevisions[0];
    const { ShippingFileMappings, ...rest } = latestRevision;
    return {
      ...rest,
      Files: ShippingFileMappings.map(m => toFileInfo(m.FileModel, m.Visible))
    }
  })
}