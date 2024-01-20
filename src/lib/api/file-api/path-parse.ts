// pages/api/file.js
import fs from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { globalConsts } from '@/consts'
import { File as FileModel } from '@/lib/data-handle/file/_file.model'


const STORAGE_DIR = globalConsts.localStorage.storageDir
const FULL_STORAGE_DIR = path.join(process.cwd(), STORAGE_DIR)
const DOWNLOAD_API = globalConsts.localStorage.downloadApi

export async function generateUniqueFilePath(fileName: string) {
  //重複しないファイルの保存先パスを生成する。
  //パスはフルパス
  const destinationDirPath = await _createSaveDirPath()

  const uniqueFileName = _generateUniqueFileName(destinationDirPath, fileName)

  const filePath = path.join(destinationDirPath, uniqueFileName)
  return filePath
}


/// STOREGE_DIRからの相対パスに変換する
export function absPathToRelPath(absPath: string) {
  return path.relative(FULL_STORAGE_DIR, absPath)
}
/// STOREGE_DIRからの相対パスに変換する
export function relPathToAbsPath(relPath: string) {
  return path.join(FULL_STORAGE_DIR, relPath)
}

export function generateUrl(fileModel: FileModel) {
  return path.join(DOWNLOAD_API, fileModel.FileId.toString())
}

//被らない名前を付ける
function _generateUniqueFileName(dir: string, name: string) {
  let uniqueFileName = name
  let counter = 1

  // Check if file exists, if it does, modify its name.
  while (existsSync(path.join(dir, uniqueFileName))) {
    const ext = path.extname(name)
    const nameWithoutExt = path.basename(name, ext)
    uniqueFileName = `${nameWithoutExt}_${counter}${ext}`
    counter++
  }
  return uniqueFileName
}

async function _createSaveDirPath() {
  // storage/2023/7/のようなディレクトリを作ってフルパスを返す

  const today = new Date()
  const yearPath = path.join(FULL_STORAGE_DIR, today.getFullYear().toString())
  const monthPath = path.join(yearPath, today.getMonth().toString())
  if (!existsSync(monthPath)) {
    await fs.mkdir(monthPath, { recursive: true })
  }
  return monthPath
}

