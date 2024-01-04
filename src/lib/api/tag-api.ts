import { prisma } from './prisma'
import { UnwrapPromise } from '@prisma/client/runtime/library'

export type GetTagsReturn = UnwrapPromise<ReturnType<typeof getTagsApi>>
export async function getTagsApi() {
  const tags = await prisma.tagModel.findMany()
  return { tags: tags.map(x => x.TagName) }
}
