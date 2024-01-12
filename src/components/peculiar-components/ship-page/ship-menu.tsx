'use client'

import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { ItemSelectorPanel } from '../../selectors/menu-item-selector'
import { getShippingListAction, ShippingListElement } from '@/lib/actions/ship-actions'
import { gridColumnsDef, defaultGridColumnVisibility } from '@/lib/client/data-handle/ship-data'
import { Button, Link, Divider, Paper, Typography } from "@mui/material";
import { globalConsts } from '@/consts';
import path from 'path'
const SHIPPING_PAGE_URL = globalConsts.url.shippingPage

export const ShipMenu: React.FC = () => {
  const [items, setItems] = useState<ShippingListElement[]>([])

  //データ取得
  useEffect(() => {
    const dataFetch = async () => {
      const newItemList = await getShippingListAction()
      setItems(newItemList)
    }
    dataFetch()
  }, [])

  //表示
  return (
    <Box>
      <h1>Shipping List</h1>
      <Link href={path.join(SHIPPING_PAGE_URL, "new")}>
        <div style={{ marginBottom: '10px' }}>

          <Button variant="contained" color="primary">
            NEW
          </Button>
        </div>
      </Link>
      <ItemSelectorPanel
        idName={"ShippingModelId"}
        modeLink={true}
        items={items}
        defaultGridColumnVisibility={defaultGridColumnVisibility}
        gridColumnsDef={gridColumnsDef}
      />
    </Box>
  )
}

export default ShipMenu

