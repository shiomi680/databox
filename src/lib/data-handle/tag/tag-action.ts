"use server"
import { readTagList } from "@/lib/db/tag/tag.operation"

export async function getTagList() {
  const tags = await readTagList()
  return tags
}