
import { FileModel, File } from "./file.model";

import { connectDB } from "../db-connect";

export async function insertFileData(fileName: string, relPath: string) {
  await connectDB()
  const file = new FileModel({ FileName: fileName, FilePath: relPath })
  const savedFile = await file.save();
  return savedFile;
}

export async function readFileData(id: string) {
  await connectDB()
  const file = await FileModel.findById(id);
  const data = file?.toJSON();
  return data
}
