import { prisma } from '../../api/prisma'
import { readTagList } from './tag-crud'

export async function getTagList() {
  const tags = await readTagList()
  return tags.map(x => x.TagName)
}