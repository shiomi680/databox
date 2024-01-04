import { NextRequest } from 'next/server'
import { getItemListApi } from '@/lib/api/item-api'
import { errorHandledApi } from '@/lib/api/response-type'

export async function GET(req: NextRequest) {
  const x = req.url
  console.log(x)
  return await errorHandledApi(async () => await getItemListApi())
}
