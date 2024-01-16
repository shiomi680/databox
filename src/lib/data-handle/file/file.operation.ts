import { File } from "./file.model";
import { dataSource } from "../data-connection";

export async function insertFileData(fileName: string, relPath: string) {
  const file = new File(fileName, relPath)
  const repo = dataSource.getRepository(File)
  const rtn = await repo.save(file)
  return rtn
}

export async function readFileData(id: string) {
  const repo = dataSource.getRepository(File)
  const file = await repo.findOne({ where: { Id: id } })
  return file
}