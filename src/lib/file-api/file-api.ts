// route.ts
import { NextRequest, NextResponse } from 'next/server'
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import {   FileModel } from '@prisma/client'
import { prisma } from '../api/prisma'

export async function post_file(file: File) {
  const destinationDirPath = path.join(process.cwd(), 'public/upload')
  const static_root_path = path.join(process.cwd(), 'public')
  const fileArrayBuffer = await file.arrayBuffer()

  if (!existsSync(destinationDirPath)) {
    await fs.mkdir(destinationDirPath, { recursive: true })
  }

  let uniqueFileName = file.name
  let counter = 1

  // Check if file exists, if it does, modify its name.
  while (existsSync(path.join(destinationDirPath, uniqueFileName))) {
    const ext = path.extname(file.name)
    const nameWithoutExt = path.basename(file.name, ext)
    uniqueFileName = `${nameWithoutExt}_${counter}${ext}`
    counter++
  }

  const filePath = path.join(destinationDirPath, uniqueFileName)
  await fs.writeFile(filePath, Buffer.from(fileArrayBuffer))

  const rel_path = path.relative(static_root_path, filePath)
  const fileTable: FileModel = await prisma.fileModel.create({
    data: {
      FileName: uniqueFileName,
      FilePath: '/' + rel_path,
    },
  })

  return fileTable
}