// pages/api/file.js
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import { existsSync, createReadStream } from 'fs'
import path from 'path'
import { FileModel } from '@prisma/client'
import { ReadableOptions } from 'stream'
import { prisma } from '../prisma'
import { UnwrapPromise } from '@prisma/client/runtime/library'
import { generateUniqueFilePath, absPathToRelPath, relPathToAbsPath, generateUrl } from './path-parse'


export type FileInfo = UnwrapPromise<ReturnType<typeof saveFile>>

export function toFileInfo(fileModel: FileModel) {
  const rtn: FileInfo = {
    ...fileModel,
    Url: generateUrl(fileModel)
  }
  return rtn
}

export async function createDownloadResponse(fileId: number) {
  const fileModel = await prisma.fileModel.findUnique({
    where: {
      FileId: fileId
    }
  })
  if (!fileModel || !fileModel.FilePath) {
    return NextResponse.json({ error: 'file is not found' })
  }
  const filePath = relPathToAbsPath(fileModel?.FilePath)

  const stats = await fs.stat(filePath)

  // Get the file size
  const data: ReadableStream<Uint8Array> = _streamFile(filePath);                      // Stream the file with a 1kb chunk
  const res = new NextResponse(data, {                                            // Create a new NextResponse for the file with the given stream from the disk
    status: 200,                                                                    //STATUS 200: HTTP - Ok
    headers: new Headers({                                                          //Headers
      "content-disposition": `attachment; filename=${fileModel.FileName}`,           //State that this is a file attachment
      "content-type": "application/iso",                                              //Set the file type to an iso
      "content-length": stats.size + "",                                              //State the file size
    }),
  });

  return res;
}

export async function saveFile(file: File) {
  //ファイルを適切な名前で保存してFileModelを登録する

  const fileArrayBuffer = await file.arrayBuffer()
  const filePath = await generateUniqueFilePath(file.name)

  await fs.writeFile(filePath, Buffer.from(fileArrayBuffer))

  const relPath = absPathToRelPath(filePath)

  const fileTable = await prisma.fileModel.create({
    data: {
      FileName: file.name,
      FilePath: relPath,
    },
  })
  const rtn = {
    ...fileTable,
    Url: generateUrl(fileTable)
  }

  return rtn
}





function _streamFile(
  path: string,
  options?: ReadableOptions,
): ReadableStream<Uint8Array> {
  const downloadStream = createReadStream(path, options)

  return new ReadableStream({
    start(controller) {
      downloadStream.on('data', (chunk: Buffer) =>
        controller.enqueue(new Uint8Array(chunk)),
      )
      downloadStream.on('end', () => controller.close())
      downloadStream.on('error', (error: NodeJS.ErrnoException) =>
        controller.error(error),
      )
    },
    cancel() {
      downloadStream.destroy()
    },
  })
}


