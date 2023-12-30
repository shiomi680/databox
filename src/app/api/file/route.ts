// route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/api/prisma'




export async function DELETE(req: NextRequest) {
  try {
    const fileID = req.nextUrl.searchParams.get('fileID')
    const itemId = req.nextUrl.searchParams.get('itemId')
    const rtn = await deleteFileApi(Number(fileID), Number(itemId))
    return NextResponse.json(rtn)
  } catch (e: any) {
    return NextResponse.json(e.message)
  }
}

const deleteFileApi = async (fileId: number, itemId: number) => {
  try {
    // Check if the mapping exists before trying to delete
    const existingMapping = await prisma.shippingFileMapping.findUnique({
      where: {
        ShippingId_FileId: {
          ShippingId: itemId,
          FileId: fileId,
        },
      },
    })

    // If the mapping doesn't exist, throw an error with a custom message
    if (!existingMapping) {
      throw new Error(
        'Mapping between the provided ItemID and FileID does not exist.',
      )
    }

    // If the mapping does exist, then delete it
    const deletedMapping = await prisma.shippingFileMapping.delete({
      where: {
        ShippingId_FileId: {
          ShippingId: itemId,
          FileId: fileId,
        },
      },
    })

    return deletedMapping
  } catch (error) {
    console.error('Error when trying to delete itemFileMapping:', error)
    throw error // Depending on your setup, you may want to throw this error or handle it differently
  }
}