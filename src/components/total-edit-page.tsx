import ItemPage from '@/components/item-edit-page'
import { MenuBar } from './menu/menu-bar'
import { MenuPanel } from './menu/menu-panel'
export default function TotalEditPage({
  params,
}: {
  params: { shippingId: string }
}) {
  const itemId = params.shippingId ?? 'new'
  return (
    <div style={{ display: 'flex' }}>
      <MenuBar>
        <MenuPanel />
      </MenuBar>
      <ItemPage itemId={itemId}></ItemPage>
    </div>
  )
}

