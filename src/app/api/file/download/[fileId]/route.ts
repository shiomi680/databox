import { NextRequest, NextResponse } from "next/server";
import { createDownloadResponse } from "@/lib/api/file-api/file-api";


export async function GET(
  request: NextRequest,
  context: { params: { fileId: string } },
): Promise<NextResponse> {
  const res = await createDownloadResponse(context.params.fileId)
  return res
}