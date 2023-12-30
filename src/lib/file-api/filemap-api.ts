import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/api/prisma'

export const getFileMap = async (itemId: number) => {
  const fileList = await prisma.shippingFileMapping.findMany({
    where: { ShippingId: itemId },
    include: {
      FileModel: true,
    },
  })
  return fileList
}
export const addFileMap = async (itemID: number, fileIdList: number[]) => {
  try {
    const createPromises = fileIdList.map((fileId) => {
      return prisma.shippingFileMapping.create({
        data: {
          ShippingId: itemID,
          FileId: fileId,
        },
      })
    })

    // Wait for all promises to resolve
    await Promise.all(createPromises)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message })
  }
}
export const updateFileMap = async (itemID: number, fileIdList: number[]) => {
  try {
    await prisma.shippingFileMapping.deleteMany({
      where: {
        ShippingId: itemID,
        FileId: {
          notIn: fileIdList,
        },
      },
    })
    const rtn = await prisma.shippingFileMapping.updateMany({
      data: fileIdList.map((fileId) => ({
        ShippingId: itemID,
        FileId: fileId,
      })),
    })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message })
  }
}
