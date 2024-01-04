"use client"
import ShipPage from "@/components/ship-page/ship-page"


export default function Page({ params }: { params: { Id: string } }) {
  return <ShipPage shipId={params.Id} />
}
