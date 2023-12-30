import { FileModel } from '@prisma/client'

export const uploadFiles = async (itemId: number, files: File[]) => {
  const rtnList: FileModel[] = []
  for (const file of files) {
    if (!file) {
      continue
    }
    const formData = new FormData()
    formData.append('file', file)
    formData.append('itemId', itemId.toString())
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    const data: any = await response.json()
    rtnList.push(data.FileModel)
  }
  return rtnList
}

export type UpdateFileMapInput = {
  itemID: number
  fileIdList: number[]
}

export async function updateFileMap(params: UpdateFileMapInput) {
  try {
    const response = await fetch(`/api/filemap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error('Error updating BOM:', error)
    return { error: error.message }
  }
}

type ResponseFileMap = {
  fileList: ({
    FileModel: {
      FileID: number
      FileName: string | null
      FilePath: string | null
      UploadTimestamp: Date
    }
  } & { ItemID: number; FileID: number })[]
}

export async function getFileListbyItemId(itemId: number) {
  const response = await fetch(`/api/filemap?itemID=${itemId}`)
  const data: ResponseFileMap = await response.json()

  const fileList = data.fileList.map((file) => file.FileModel)
  return fileList
}

export async function deleteFile(fileId: number, itemId: number) {
  try {
    const response = await fetch(
      `/api/file?fileID=${fileId}&itemId=${itemId}`,
      {
        method: 'DELETE',
      },
    )
    const data = await response.json()
    return data
  } catch (error: any) {
    console.error('Error deleting file:', error)
    return { error: error.message }
  }
}
