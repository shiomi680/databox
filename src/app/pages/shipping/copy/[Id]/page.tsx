"use client"
import ShipPage from "@/components/pages/ship-page/ship-page"

export default function Page({ params }: { params: { Id: string } }) {
  return <ShipPage shipId={params.Id} copy={true} />
}




