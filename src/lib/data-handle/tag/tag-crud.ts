"use server"
import { prisma } from '../../api/prisma'

export async function readTagList() {
  const tags = await prisma.tagModel.findMany()
  return tags
}