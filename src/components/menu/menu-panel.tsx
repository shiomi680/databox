'use client'

import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { ItemSelectorPanel } from '../selectors/menu-item-selector'
import { getShipping, ShippingListElement,getShippingList } from '@/lib/client/shipping-io'
type Item = {
  ItemID: number
  ItemName: string
  ItemDescription: string
  Cost: number
  SalePrice: number
  CategoryID: number
}

type Category = {
  CategoryID: number
  CategoryName: string
}

export const MenuPanel: React.FC = () => {
  const [items, setItems] = useState<ShippingListElement[]>([])
  
  useEffect(() => {
    const dataFetch = async () => {
      const newItemList = await getShippingList()
      setItems(newItemList)
    }
    dataFetch()
  }, [])
  return (
    <Box>
      <h1>Shipping List</h1>

      <ItemSelectorPanel
        modeLink={true} 
        onSelect= {f}
      />
    </Box>
  )
}

export default MenuPanel
const f= (x:any)=>{}

