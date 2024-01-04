import { MenuPanel } from '@/components/menu/menu-panel'
import { ShiipMenu } from '@/components/ship-page/ship-menu'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ShiipMenu></ShiipMenu>
    </main>
  )
}
