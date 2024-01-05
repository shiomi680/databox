import { ItemModel } from '@prisma/client'
import { prisma } from './prisma'
import { toFileInfo } from './file-api/file-api'
import { UnwrapPromise } from '@prisma/client/runtime/library'

export type ItemApiReturn = UnwrapPromise<ReturnType<typeof getItemApi>>
export type UpdateItemReturn = UnwrapPromise<ReturnType<typeof createOrUpdateItem>>


export type PostItemApiParams = Partial<
  ItemModel & {
    Files: {
      FileId: number,
      Visible: boolean
    }[]
    Tags: string[]
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
      },
      ItemTagMappings: { // Include ItemTagMappings
        include: {
          TagModel: true // Include related TagModel
        }
      }
    }
  })
  if (itemInfo) {
    const { ItemFileMappings, ItemTagMappings, ...rest } = itemInfo
    const rtn = {
      ...rest,
      Files: ItemFileMappings.map(m => toFileInfo(m.FileModel, m.Visible)),
      Tags: ItemTagMappings.map(m => m.TagModel.TagName) // Map ItemTagMappings to get related TagModel
    }

    return rtn
  } else {
    throw new Error(`${itemInfo} is not exist`)
  }
}
export async function createOrUpdateItem(item: PostItemApiParams) {
  const { Id, Files, Tags, ...inputData } = item

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

  //file mappingのアップデート
  const operations = [];
  if (updatedItem && updatedItem.Id) {
    operations.push(
      prisma.itemFileMapping.deleteMany({
        where: {
          ItemId: updatedItem.Id
        }
      }))
    if (Files) {
      const fileMappings = Files.map(file => ({
        ItemId: updatedItem.Id,
        FileId: file.FileId,
        Visible: file.Visible

      }));
      fileMappings.forEach(fileMapping => {
        operations.push(
          prisma.itemFileMapping.create({
            data: fileMapping
          })
        );
      });
    }

    //tag mappingのアップデート
    if (Tags) {
      for (const tag of Tags) {
        let tagModel = await prisma.tagModel.findUnique({
          where: { TagName: tag },
        });

        if (!tagModel) {
          tagModel = await prisma.tagModel.create({
            data: { TagName: tag },
          });
        }

        operations.push(
          prisma.itemTagMapping.upsert({
            where: { ItemId_TagId: { ItemId: updatedItem.Id, TagId: tagModel.Id } },
            update: {},
            create: { ItemId: updatedItem.Id, TagId: tagModel.Id },
          })
        );
      }
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
      },
      ItemTagMappings: {
        include: {
          TagModel: true
        }
      }
    }
  })
  return items.map(item => {
    const { ItemFileMappings, ItemTagMappings, ...rest } = item
    return {
      ...rest,
      // Files: ItemFileMappings.map(m => toFileInfo(m.FileModel)),
      Tags: ItemTagMappings.map(m => m.TagModel.TagName)
    }
  })
}