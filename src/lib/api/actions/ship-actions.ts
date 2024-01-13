"use server"
import { ShippingModel, ShippingRevision } from '@prisma/client'
import { prisma } from '../prisma'
import { toFileInfo } from '../file-api/file-api'
import { UnwrapPromise } from '@prisma/client/runtime/library'

export type UpdateShippingReturn = UnwrapPromise<ReturnType<typeof createOrUpdateShippingAction>>
export type ShippingReturn = UnwrapPromise<ReturnType<typeof getShippingAction>>

type ShippingRevisionSubset = Omit<ShippingRevision, 'ShippingRevisionId' | 'createdAt'>;

export type PostShippingApiParams = Partial<
  ShippingRevisionSubset & {
    Files: {
      FileId: number,
      Visible: boolean
    }[]
  }
>



export async function getShippingAction(Id: number) {
  const shippingRevisions = await prisma.shippingRevision.findMany({
    where: {
      ShippingModelId: Id
    },
    select: {
      ShippingRevisionId: true,
      Comment: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc"
    },
  })
  const newest = await prisma.shippingRevision.findUnique({
    where: {
      ShippingRevisionId: shippingRevisions[0].ShippingRevisionId
    },
    include: {
      ShippingFileMappings: {
        include: {
          FileModel: true
        }
      },
    }

  })
  return {
    ...newest,
    Files: newest?.ShippingFileMappings.map(sfMap => toFileInfo(sfMap.FileModel)),
    Revesions: shippingRevisions
  }
}

export async function createOrUpdateShippingAction(shipping: PostShippingApiParams) {
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
  return await getShippingAction(updatedShipping.ShippingId)
}

export type ShippingListReturn = UnwrapPromise<ReturnType<typeof getShippingListAction>>
export type ShippingListElement = ShippingListReturn[number]

export async function getShippingListAction() {
  const ships = await prisma.shippingModel.findMany({
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
  return ships.map(item => {
    const latestRevision = item.ShippingRevisions[0];
    const { ShippingFileMappings, ...rest } = latestRevision;
    return {
      ...rest,
      Files: ShippingFileMappings.map(m => toFileInfo(m.FileModel, m.Visible))
    }
  })
}