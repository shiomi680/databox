"use client"
import ParentComponent from "@/components/item-panel/item-panel-parent"



export default function Page({ params }: { params: { shipId: string } }) {
  return <ParentComponent shipId={params.shipId} />
}
