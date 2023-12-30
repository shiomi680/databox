'use client'
// External dependencies
import { useState, useEffect, DragEventHandler } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ShippingModel } from '@prisma/client'
import { PostShippingApiParams,ShippingReturn, updateShipping,getShipping } from '@/lib/client/shipping-io'

//MUI
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'

// Components
import { ItemEditPanel,ShippingFormVlues } from '@/components/item-edit-panel'
import { FileUploadComponent } from './file-upload-panel'

export default function ItemPage({ itemId }: { itemId: string }) {
  const {
    imagePath,
    setImagePath,
    item,
    setItem,
    initItem,
    isLoading,
    imageId
  } = useStateForItemPage(itemId)

  const is_item_new = itemId === 'new'
  

  //送信ボタンを押したとき
  const onSubmit = async (values: any) => {
    if (item) {
      const id = is_item_new ? undefined : Number(itemId)
      const inputData: PostShippingApiParams = formItemToApiItem(item, id)
      const newItem = await updateShipping(inputData)
      toast.success('Item successfully submitted!')
    }
  }


  const handleItemFormChange = (values: any) => {
    setItem(values)
  }

  if (isLoading) return <div>Loading...</div>
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        m: 4,
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Typography variant="h4" gutterBottom>
        {is_item_new ? 'Create New Item' : ` ${initItem?.Title} ...`}
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          width: '100%', // Set width to 100%
          maxWidth: '1200px', // Cap the maximum width (adjust this value as needed)
          mb: 3,
        }}
      >

        <ItemEditPanel
          initialItem={initItem}
          handleFormChange={handleItemFormChange}
        />
        <Divider sx={{ my: 2 }} />

        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          sx={{
            mt: 2,
          }}
        >
          Save
        </Button>
      </Paper>
      <Divider sx={{ my: 2 }} />
      <FileUploadComponent itemId={itemId} />
    </Box>
  )
}

function useStateForItemPage(itemId: string) {
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [item, setItem] = useState<ShippingFormVlues>()
  const [initItem, setInitItem] = useState<ShippingFormVlues>()
  const [isLoading, setLoading] = useState(true)
  const [imageId, setImageId] = useState<number | null>(null)

  const is_item_new = itemId === 'new'

  //初期値をGETする
  const initializeData = async () => {
    if (!is_item_new) {
      const x = await getShipping(Number(itemId))

      const data = apiItemToformItem(x)
      setInitItem(data)
      setItem(data)

    }
    setLoading(false)
  }


  useEffect(() => {
    initializeData()
  }, [itemId])
  return {
    imagePath,
    setImagePath,
    item,
    setItem,
    initItem,
    isLoading,
    imageId,
  }
  
}
function formItemToApiItem(item: ShippingFormVlues, shippingId: number | undefined) {
  const rtn: PostShippingApiParams = {
    ...item,
    ShippingId: shippingId
  }
  return rtn
}
function apiItemToformItem(item: ShippingReturn) {
  const rtn: ShippingFormVlues = item
  return rtn
}
