"use server"
import { ItemModel, ItemRevision } from '@prisma/client'
import { prisma } from '../../api/prisma'
import { toFileInfo } from '../../api/file-api/file-api'
import { UnwrapPromise } from '@prisma/client/runtime/library'
import { readItemRevisions, readTargetRevisionData, createOrUpdateItem, findManyItemModel } from './item-crud'

export type ItemReturn = UnwrapPromise<ReturnType<typeof getItemAction>>
export type UpdateItemReturn = UnwrapPromise<ReturnType<typeof createOrUpdateItem>>


type ItemRevisionSubset = Omit<ItemRevision, 'ItemRevisionId' | 'createdAt' | "ItemModelId">;

export type PostItemApiParams =
  ItemRevisionSubset & {
    ItemModelId?: number,
    Files: {
      FileId: number,
      Visible: boolean
    }[]
    Tags: string[]
  }

export async function getItemAction(Id: number, revisonId?: number) {

  const itemRevisions = await readItemRevisions(Id)
  //リビジョンがなかったらItemが存在しない
  if (itemRevisions.length == 0) {
    return
  }
  //リビジョン指定があればそのリビジョンを取得。なければ最新
  const targetRevision = revisonId || itemRevisions[0].ItemRevisionId
  const latest = await readTargetRevisionData(targetRevision)

  //データのフォーマット変換
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


export async function postItem(item: PostItemApiParams) {
  const { ItemModelId, Files, Tags, ...inputData } = item
  const newRevision = await createOrUpdateItem(inputData, ItemModelId);

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
  return await getItemAction(newRevision.ItemModelId)
}

export type ItemListReturn = UnwrapPromise<ReturnType<typeof getItemListAction>>
export type ItemListElement = ItemListReturn[number]

export async function getItemListAction() {
  const items = await findManyItemModel();
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