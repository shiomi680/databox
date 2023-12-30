import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/api/prisma'

export async function GET(
  request: NextRequest,
  context: { params: { fileID: string } },
) {
  try {
    const { fileID } = context.params
    return await getFileApi(Number(fileID))
  } catch (error) {
    return NextResponse.json({ error: 'itemId error' })
  }
}
const getFileApi = async (fileId: number) => {
  const file = await prisma.fileModel.findUnique({
    where: { FileId: fileId },
  })
  return NextResponse.json(file)
}
