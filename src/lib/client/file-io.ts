
import { globalConsts } from '@/consts'
import { FileInfo } from "../api/file-api/file-api";
const UPLOAD_URL = globalConsts.localStorage.uploadApi

export async function uploadFiles(file: File): Promise<FileInfo> {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData
    });
    const rtn: FileInfo = await response.json()
    return rtn
  } catch (error) {
    console.error(error);
    throw error
  }
}

export type { FileInfo }