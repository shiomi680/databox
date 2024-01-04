import { NextRequest } from 'next/server'
import { errorHandledApi } from '@/lib/api/response-type'
import { getTagsApi } from '@/lib/api/tag-api'

export async function GET(req: NextRequest) {
  const x = req.url
  console.log(x)
  return await errorHandledApi(async () => await getTagsApi())
}
