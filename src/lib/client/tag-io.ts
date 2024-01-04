import { fetchData, postData } from './data-io'
import {
  GetTagsReturn
} from '../api/tag-api'
import { UnwrapPromise } from '@prisma/client/runtime/library'
import { globalConsts } from '@/consts'
import path from 'path'

const TAGS_URL = globalConsts.url.tags
export async function getTagList(): Promise<string[]> {
  const data = await fetchData<GetTagsReturn>(`${TAGS_URL}`)
  return data.tags
}

export type { GetTagsReturn }