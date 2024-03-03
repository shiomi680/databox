'use client'

import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { ItemSelectorPanel } from '../../features/menu-item-selector'
import { getShippingListAction, ShippingListElement } from '@/lib/data-handle/ship/ship-actions'
import { shipDefaultGridColumnVisibility, shipGridColumnsDef } from "@/lib/data-handle/ship/ship-defines"
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
        idName={"Id"}
        modeLink={true}
        items={items}
        defaultGridColumnVisibility={shipDefaultGridColumnVisibility}
        gridColumnsDef={shipGridColumnsDef}
      />
    </Box>
  )
}

export default ShipMenu

