import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { ItemSelectorPanel } from '../selectors/menu-item-selector'
import { getItem, ItemListElement, getItemList } from '@/lib/client/item-io'
import { gridColumnsDef, defaultGridColumnVisibility } from '@/lib/client/data-handle/item-data'
import { Button, Link, Divider, Paper, Typography } from "@mui/material";
import { globalConsts } from '@/consts';
import path from 'path'
const ITEM_PAGE_URL = globalConsts.url.itemPage

export const ItemMenu: React.FC = () => {
  const [items, setItems] = useState<ItemListElement[]>([])

  useEffect(() => {
    const dataFetch = async () => {
      const newItemList = await getItemList()
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
        defaultGridColumnVisibility={defaultGridColumnVisibility}
        gridColumnsDef={gridColumnsDef}
      />
    </Box>
  )
}

export default ItemMenu