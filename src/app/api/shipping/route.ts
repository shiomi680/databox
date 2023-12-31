import { NextRequest } from 'next/server'
import {
  PostShippingApiParams,
  createOrUpdateShipping,
  UpdateShippingReturn
} from '@/lib/api/shipping-api'
import { ErrorHandledResopnse, errorHandledApi } from '@/lib/api/response-type'

type UpdateItemResponse = ErrorHandledResopnse<UpdateShippingReturn>

export async function POST(req: NextRequest): Promise<UpdateItemResponse> {
  return await errorHandledApi(async () => {
    const param: PostShippingApiParams = await req.json()
    return await createOrUpdateShipping(param)
  })
}
