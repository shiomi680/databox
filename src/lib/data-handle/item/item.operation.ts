import { dataSource } from "../data-connection";
import { Item, ItemRevision } from "./item.model";

export async function addNewItem(item: Item, commitComment: string) {
  const repo = dataSource.getRepository(Item)
  const rtn = await repo.save(item)

  //リビジョン追加
  const revisionRepo = dataSource.getRepository(ItemRevision)
  const revision = new ItemRevision()
  revision.Item = rtn
  revision.TargetId = rtn.ItemId.toString()
  revision.CreateAt = (new Date()).toISOString()
  revision.CommitComment = commitComment
  revisionRepo.save(revision)
  return rtn
}

export async function updateItem(id: string, item: Item, commitComment: string) {
  const repo = dataSource.getRepository(Item)
  await repo.update(id, item)
  const rtn = await repo.findOne(id as any)
  if (!rtn) {
    return null
  }

  const revRepo = dataSource.getRepository(ItemRevision)
  const revision = new ItemRevision()
  revision.CommitComment = commitComment
  revision.CreateAt = (new Date()).toISOString()
  revision.TargetId = id
  revision.Item = rtn
  await revRepo.save(revision)
}


export async function readItemList() {
  const repo = dataSource.getRepository(Item)
  const items = await repo.find()
  return items
}
export async function readItemData(id: string) {

  const repo = dataSource.getRepository(Item)
  const revisionRepo = dataSource.getRepository(ItemRevision)
  const item = await repo.findOne(id as any)
  const revisions = await revisionRepo.find({
    where: {
      TargetId: id
    },
    select: ["RevisionId", "CommitComment", "CreateAt"]
  })
  return {
    ...item,
    Revisions: revisions
  }
}