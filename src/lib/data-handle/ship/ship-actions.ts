"use server"
import { ShippingModel, ShippingRevision } from '@prisma/client'
import { prisma } from '../../api/prisma'
import { toFileInfo } from '../../api/file-api/file-api'
import { UnwrapPromise } from '@prisma/client/runtime/library'
import { readShippingRevisions, readTargetRevisionData, createOrUpdateShipping, findManyShippingModel } from './ship-crud'

export type UpdateShippingReturn = UnwrapPromise<ReturnType<typeof createOrUpdateShipping>>
export type ShippingReturn = UnwrapPromise<ReturnType<typeof getShippingAction>>

type ShippingRevisionSubset = Omit<ShippingRevision, 'ShippingRevisionId' | 'createdAt' | 'ShippingModelId'>;

export type PostShippingApiParams =
  ShippingRevisionSubset & {
    ShippingModelId?: number,
    Files: {
      FileId: number,
      Visible: boolean
    }[]
  }


export async function getShippingAction(Id: number) {
  const shippingRevisions = await readShippingRevisions(Id)
  const newest = await readTargetRevisionData(shippingRevisions[0].ShippingRevisionId)

  return {
    ...newest,
    Files: newest?.ShippingFileMappings.map(sfMap => toFileInfo(sfMap.FileModel)),
    Revisions: shippingRevisions
  }
}

export async function createOrUpdateShippingAction(shipping: PostShippingApiParams) {
  const { ShippingModelId, Files, ...inputData } = shipping
  const newRevision = await createOrUpdateShipping(inputData, ShippingModelId);

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
  return await getShippingAction(newRevision.ShippingModelId)
}

export type ShippingListReturn = UnwrapPromise<ReturnType<typeof getShippingListAction>>
export type ShippingListElement = ShippingListReturn[number]

export async function getShippingListAction() {
  const ships = await findManyShippingModel();
  return ships.map(ship => {
    const latestRevision = ship.ShippingRevisions[0];
    const { ShippingFileMappings, ...rest } = latestRevision;
    return {
      ...rest,
      Files: ShippingFileMappings.map(m => toFileInfo(m.FileModel, m.Visible))
    }
  })
}