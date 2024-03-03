"use client"
import ShipPage from "@/components/pages/ship-page/ship-page"

export default function Page({ params }: { params: { Id: string, revision: string } }) {
  return <ShipPage shipId={params.Id} revisionId={params.revision} />
}
