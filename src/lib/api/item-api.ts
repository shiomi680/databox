import { ItemModel } from '@prisma/client'
import { prisma } from './prisma'
import { toFileInfo } from './file-api/file-api'
import { UnwrapPromise } from '@prisma/client/runtime/library'

export type ItemApiReturn = UnwrapPromise<ReturnType<typeof getItemApi>>
export type UpdateItemReturn = UnwrapPromise<ReturnType<typeof createOrUpdateItem>>

export type PostItemApiParams = Partial<
  ItemModel & {
    Files: number[]
  }
>

export async function getItemApi(Id: number) {
  const itemInfo = await prisma.itemModel.findUnique({
    where: {
      Id: Id
    },
    include: {
      ItemFileMappings: {
        include: {
          FileModel: true
        }
      }
    }
  })
  if (itemInfo) {
    const { ItemFileMappings, ...rest } = itemInfo
    const rtn = {
      ...rest,
      Files: ItemFileMappings.map(m => toFileInfo(m.FileModel))
    }

    return rtn
  } else {
    throw new Error(`${itemInfo} is not exist`)
  }
}

export async function createOrUpdateItem(item: PostItemApiParams) {
  const { Id, Files, ...inputData } = item

  let updatedItem: ItemModel;

  if (Id) {
    updatedItem = await prisma.itemModel.update({
      where: { Id },
      data: inputData,
    });
  } else {
    updatedItem = await prisma.itemModel.create({
      data: {
        ...inputData,
        ItemName: inputData.ItemName || 'no data'
      },
    });
  }

  const operations = [];
  if (updatedItem && updatedItem.Id) {
    operations.push(
      prisma.itemFileMapping.deleteMany({
        where: {
          ItemId: updatedItem.Id
        }
      }))
    if (Files) {
      const fileMappings = Files.map(fileId => ({
        ItemId: updatedItem.Id,
        FileId: fileId,
      }));
      fileMappings.forEach(fileMapping => {
        operations.push(
          prisma.itemFileMapping.create({
            data: fileMapping,
          })
        );
      });
    }

    await prisma.$transaction(operations);
  }
  return await getItemApi(updatedItem.Id)
}

export type ItemListReturn = UnwrapPromise<ReturnType<typeof getItemListApi>>
export type ItemListElement = ItemListReturn[number]

export async function getItemListApi() {
  const items = await prisma.itemModel.findMany({
    include: {
      ItemFileMappings: {
        include: {
          FileModel: true
        }
      }
    }
  })
  return items.map(item => {
    const { ItemFileMappings, ...rest } = item
    return {
      ...rest,
      Files: ItemFileMappings.map(m => toFileInfo(m.FileModel))
    }
  })
}