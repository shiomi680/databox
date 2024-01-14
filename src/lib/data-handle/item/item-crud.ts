import { prisma } from '../../api/prisma'
import { ItemRevision } from "@prisma/client"


export async function readItemRevisions(itemId: number) {
  const itemRevisions = await prisma.itemRevision.findMany({
    where: {
      ItemModelId: itemId
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      ItemRevisionId: true,
      CommitComment: true,
      createdAt: true
    }
  })
  return itemRevisions
}

export async function readTargetRevisionData(revisionId: number) {
  const revision = await prisma.itemRevision.findUnique({
    where: {
      ItemRevisionId: revisionId
    },
    include: {
      ItemFileMappings: {
        select: {
          FileModel: true,
          Visible: true
        }
      },
      ItemTagMappings: {
        select: {
          TagModel: true
        }
      }
    }
  })
  return revision
}

type ItemRevisionSubset = Omit<ItemRevision, "ItemModelId" | 'ItemRevisionId' | 'createdAt'>;

export async function createOrUpdateItem(data: ItemRevisionSubset, ItemModelId?: number,) {

  const itemId = await getOrCreateItemId(ItemModelId)
  // Create a new revision
  const newRevision = await prisma.itemRevision.create({
    data: {
      ...data,
      ItemModelId: itemId,
    }
  });
  return newRevision
}

async function getOrCreateItemId(itemModelId?: number) {
  if (itemModelId) {
    const foundItem = await prisma.itemModel.findUnique({
      where: {
        ItemModelId: itemModelId
      }
    })
    if (foundItem) {
      return foundItem.ItemModelId
    } else {
      return await createItemId()
    }
  } else {
    return await createItemId()
  }
}

async function createItemId() {
  const item = await prisma.itemModel.create({
  })
  return item.ItemModelId
}
