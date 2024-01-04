import { NextRequest } from 'next/server'
import { getItemApi } from '@/lib/api/item-api'
import { errorHandledApi } from '@/lib/api/response-type'

export async function GET(
  req: NextRequest,
  context: { params: { Id: string } },
) {
  return await errorHandledApi(async () => {
    const x = req.url
    console.log(x)
    return await getItemApi(Number(context.params.Id))
  })
}
