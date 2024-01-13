"use server"
import { ItemModel, ItemRevision } from '@prisma/client'
import { prisma } from '../../api/prisma'
import { toFileInfo } from '../../api/file-api/file-api'
import { UnwrapPromise } from '@prisma/client/runtime/library'

export type ItemReturn = UnwrapPromise<ReturnType<typeof getItemAction>>
export type UpdateItemReturn = UnwrapPromise<ReturnType<typeof createOrUpdateItem>>


type ItemRevisionSubset = Omit<ItemRevision, 'ItemRevisionId' | 'createdAt'>;

export type PostItemApiParams = Partial<
  ItemRevisionSubset & {
    Files: {
      FileId: number,
      Visible: boolean
    }[]
    Tags: string[]
  }
>
export async function getItemAction(Id: number, revisonId?: number) {

  const itemRevisions = await prisma.itemRevision.findMany({
    where: {
      ItemModelId: Id
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
  const targetRevision = revisonId || itemRevisions[0].ItemRevisionId
  const latest = await prisma.itemRevision.findUnique({
    where: {
      ItemRevisionId: targetRevision
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
  if (latest) {
    const { ItemFileMappings, ItemTagMappings, ...rest } = latest;
    const rtn = {
      ...rest,
      Files: ItemFileMappings.map(m => toFileInfo(m.FileModel, m.Visible)),
      Tags: ItemTagMappings.map(m => m.TagModel.TagName),
      Revisions: itemRevisions.map(rev => ({
        ItemRevisionId: rev.ItemRevisionId,
        createdAt: rev.createdAt,
        CommitComment: rev.CommitComment
      }))
    }
    return rtn
  } else {

  }
}


export async function createOrUpdateItem(item: PostItemApiParams) {
  const { ItemModelId, Files, Tags, CommitComment, ...inputData } = item

  let updatedItem: ItemModel;

  if (ItemModelId) {
    const foundItem = await prisma.itemModel.findUnique({
      where: { ItemModelId: ItemModelId }
    })
    if (foundItem) {
      updatedItem = foundItem
    }
    else {
      updatedItem = await prisma.itemModel.create({
        data: {
        }
      })
    }
  } else {
    updatedItem = await prisma.itemModel.create({
      data: {

      }
    })
  }
  // Create a new revision
  const newRevision = await prisma.itemRevision.create({
    data: {
      ...inputData,
      ItemModelId: updatedItem.ItemModelId,
      CommitComment: CommitComment || '',
    }
  });

  // Update file mappings
  const operations = [];
  if (newRevision && newRevision.ItemRevisionId) {
    if (Files) {
      const fileMappings = Files.map(file => ({
        ItemRevisionId: newRevision.ItemRevisionId,
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

    // Update tag mappings
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
            where: { ItemRevisionId_TagId: { ItemRevisionId: newRevision.ItemRevisionId, TagId: tagModel.TagId } },
            update: {},
            create: { ItemRevisionId: newRevision.ItemRevisionId, TagId: tagModel.TagId },
          })
        );
      }
    }

    await prisma.$transaction(operations);
  }
  return await getItemAction(updatedItem.ItemModelId)
}

export type ItemListReturn = UnwrapPromise<ReturnType<typeof getItemListAction>>
export type ItemListElement = ItemListReturn[number]

export async function getItemListAction() {
  const items = await prisma.itemModel.findMany({
    include: {
      ItemRevisions: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1,
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
      },
    }
  })
  return items.map(item => {
    const latestRevision = item.ItemRevisions[0];
    const { ItemFileMappings, ItemTagMappings, ...rest } = latestRevision;
    return {
      ...rest,
      Files: ItemFileMappings.map(m => toFileInfo(m.FileModel, m.Visible)),
      Tags: ItemTagMappings.map(m => m.TagModel.TagName)
    }
  })
}