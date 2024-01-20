// pages/api/file.js
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import { existsSync, createReadStream } from 'fs'
import path from 'path'
import { ReadableOptions } from 'stream'
import { UnwrapPromise } from '@prisma/client/runtime/library'
import { generateUniqueFilePath, absPathToRelPath, relPathToAbsPath, generateUrl } from './path-parse'
import { File as FileClass, FileAttachment } from '@/lib/db/file/file.model'
import { insertFileData, readFileData } from "@/lib/db/file/file.operation"


export type UploadResponse = FileClass & {
  Url: string;
}

export function toFileInfo(fileModel: FileClass, visible: boolean = true) {
  const rtn = {
    ...fileModel,
    Url: generateUrl(fileModel),
    Visible: visible
  }
  return rtn
}

export async function createDownloadResponse(fileId: string) {
  const fileModel = await readFileData(fileId)
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
  const fileInfo = await insertFileData(file.name, relPath)
  const rtn = {
    ...fileInfo,
    Url: generateUrl(fileInfo),
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


