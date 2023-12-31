// route.ts
import { NextRequest,NextResponse } from 'next/server'
import { getFileMap, addFileMap,updateFileMap } from '@/lib/file-api/filemap-api'

export async function GET(req: NextRequest) {
  const itemID = req.nextUrl.searchParams.get('itemID')
  const fileList = await getFileMap(Number(itemID))
  return NextResponse.json({ fileList })
}

export async function PUT(req: NextRequest) {
  const param: { itemID: number; fileIdList: number[] } = await req.json()
  const rtn = await updateFileMap(param.itemID, param.fileIdList)
  return rtn
}
