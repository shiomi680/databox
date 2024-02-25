import ButtonAppBar, { MenuParams } from "@/components/layout/app-bar"
import { globalConsts } from "@/consts"
export default function DataboxAppBar() {
  const menus: MenuParams[] = [
    {
      title: "Item",
      url: globalConsts.url.itemPage
    },
    {
      title: "Shipping",
      url: globalConsts.url.shippingPage

    }
  ]
  return (
    <ButtonAppBar
      menuParams={menus}
      title={"Data box"}

    />
  )
}