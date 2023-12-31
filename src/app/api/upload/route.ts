// route.ts
import { NextRequest, NextResponse } from 'next/server'

import { post_file } from '@/lib/file-api/file-api'
import { addFileMap } from '@/lib/file-api/filemap-api'



export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const f = formData.get('file')
  const file = f as File
  const fileTable = await post_file(file)
  const itemId = parseInt(formData.get('itemId') as string, 10)

  const response = await addFileMap(itemId, [fileTable.FileId])

  return NextResponse.json({
    size: file.size,
    lastModified: new Date(file.lastModified),
    FileModel:fileTable,
  })
}
