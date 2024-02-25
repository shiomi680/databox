"use client"
import ItemPage from "@/components/pages/item-page/item-page"

export default function Page({ params }: { params: { Id: string } }) {
  return <ItemPage itemId={params.Id} />
}
