
import { ShipMenu } from '@/components/peculiar-components/ship-page/ship-menu'
import { Button } from '@/components/atoms/button'
export default function Home() {
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <ShipMenu></ShipMenu>
      </main>
    </div>
  )
}
