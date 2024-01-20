import React, { useState, useEffect } from 'react'
import { ItemSelectorPanel } from '../../selectors/menu-item-selector'
import { getItemListAction, ItemListElement } from '@/lib/data-handle/item/item-action'
import { gridColumnsDef, defaultGridColumnVisibility } from '@/lib/data-handle/item/item-defines'
import { Button, Link, Box } from "@mui/material";
import { globalConsts } from '@/consts';
import path from 'path'
const ITEM_PAGE_URL = globalConsts.url.itemPage

export const ItemMenu: React.FC = () => {
  const [items, setItems] = useState<ItemListElement[]>([])

  useEffect(() => {
    const dataFetch = async () => {
      const newItemList = await getItemListAction()
      setItems(newItemList)
    }
    dataFetch()
  }, [])

  return (
    <Box>
      <h1>Item List</h1>
      <Link href={path.join(ITEM_PAGE_URL, "new")}>
        <div style={{ marginBottom: '10px' }}>

          <Button variant="contained" color="primary">
            NEW
          </Button>
        </div>
      </Link>
      <ItemSelectorPanel
        modeLink={true}
        items={items}
        idName={"id"}
        defaultGridColumnVisibility={defaultGridColumnVisibility}
        gridColumnsDef={gridColumnsDef}
      />
    </Box>
  )
}

export default ItemMenu