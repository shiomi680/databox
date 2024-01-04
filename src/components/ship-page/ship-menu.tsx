'use client'

import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { ItemSelectorPanel } from '../selectors/menu-item-selector'
import { getShipping, ShippingListElement, getShippingList } from '@/lib/client/shipping-io'
import { gridColumnsDef, defaultGridColumnVisibility } from '@/lib/client/data-handle/ship-data'
export const ShipMenu: React.FC = () => {
  const [items, setItems] = useState<ShippingListElement[]>([])

  //データ取得
  useEffect(() => {
    const dataFetch = async () => {
      const newItemList = await getShippingList()
      setItems(newItemList)
    }
    dataFetch()
  }, [])

  //表示
  return (
    <Box>
      <h1>Shipping List</h1>

      <ItemSelectorPanel
        modeLink={true}
        items={items}
        defaultGridColumnVisibility={defaultGridColumnVisibility}
        gridColumnsDef={gridColumnsDef}
      />
    </Box>
  )
}

export default ShipMenu

