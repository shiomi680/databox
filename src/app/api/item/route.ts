import { NextRequest } from 'next/server'
import { PostItemApiParams, createOrUpdateItem, UpdateItemReturn } from '@/lib/api/item-api'

import { ErrorHandledResopnse, errorHandledApi } from '@/lib/api/response-type'

type UpdateItemResponse = ErrorHandledResopnse<UpdateItemReturn>

export async function POST(req: NextRequest): Promise<UpdateItemResponse> {
  return await errorHandledApi(async () => {
    const param: PostItemApiParams = await req.json()
    return await createOrUpdateItem(param)
  })
}
