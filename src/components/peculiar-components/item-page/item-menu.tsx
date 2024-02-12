import React, { useState, useEffect } from 'react'
import { ItemSelectorPanel } from '../../organisms/menu-item-selector'
import { getItemListAction } from '@/lib/data-handle/item/item-action'
import { Item } from '@/lib/db/item/item.model'
import { gridColumnsDef, defaultGridColumnVisibility } from '@/lib/data-handle/item/item-defines'
import { Button, Link, Box } from "@mui/material";
import { globalConsts } from '@/consts';
import path from 'path'
const ITEM_PAGE_URL = globalConsts.url.itemPage

export const ItemMenu: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])

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