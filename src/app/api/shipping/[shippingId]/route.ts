import { NextRequest } from 'next/server'
import { getShippingApi } from '@/lib/api/shipping-api'
import { errorHandledApi } from '@/lib/api/response-type'

export async function GET(
  req: NextRequest,
  context: { params: { shippingId: string } },
) {
  return await errorHandledApi(async () => {
    const x = req.url
    console.log(x)
    return await getShippingApi(Number(context.params.shippingId))
  })
}
