// route.ts
import { NextRequest, NextResponse } from 'next/server'
import { saveFile } from '@/lib/api/file-api/file-api'



export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const f = formData.get('file')
  const file = f as File
  const fileTable = await saveFile(file.stream(), file.name)
  return NextResponse.json(fileTable)

}
