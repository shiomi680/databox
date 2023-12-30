'use client'
import React, { useState, useEffect } from 'react'
import { ShippingModel } from '@prisma/client'

// MUI imports
import { Container, TextField, Button, Grid } from '@mui/material'

type ItemEditPanelParams = {
  initialItem: ShippingFormVlues | null | undefined
  handleFormChange: (values: ShippingFormVlues) => void
}

export type ShippingFormVlues = {
  ShipDate: Date | null | undefined
  ShipFrom: string | null | undefined
  ShipTo: string | null | undefined
  Title: string | undefined
  ShippingInvoicePrice: number | null | undefined
  ShippingInvoiceCurrency: string | null | undefined
  TradeTerm: string | null | undefined
  AcquisitionDate: Date | null | undefined
  AcquisitionPrice: number | null | undefined
  BookValue: number | null | undefined
  Defrayer: string | null | undefined
  Comment: string | null | undefined
  CommentAboutSale: string | null | undefined
  Gx: string | null | undefined
  CommentAboutAcquisition: string | null | undefined
  InvoiceNo: string | null | undefined
  Carrier: string | null | undefined
  AwbNo: string | null | undefined
  ExportPermission: string | null | undefined
}


export function ItemEditPanel({
  initialItem,
  handleFormChange,
}: ItemEditPanelParams) {
  const [values, setValues] = useState<ShippingFormVlues>({
    ShipDate: initialItem?.ShipDate,
    ShipFrom: initialItem?.ShipFrom,
    ShipTo:initialItem?.ShipTo,
    Title: initialItem?.Title,
    ShippingInvoicePrice: initialItem?.ShippingInvoicePrice,
    ShippingInvoiceCurrency: initialItem?.ShippingInvoiceCurrency,
    TradeTerm: initialItem?.TradeTerm,
    AcquisitionDate: initialItem?.AcquisitionDate,
    AcquisitionPrice: initialItem?.AcquisitionPrice,
    BookValue:initialItem?.BookValue,
    Defrayer: initialItem?.Defrayer,
    Comment:initialItem?.Comment,
    CommentAboutSale: initialItem?.CommentAboutSale,
    Gx: initialItem?.Gx,
    CommentAboutAcquisition: initialItem?.CommentAboutAcquisition,
    InvoiceNo: initialItem?.InvoiceNo,
    Carrier: initialItem?.Carrier,
    AwbNo: initialItem?.AwbNo,
    ExportPermission: initialItem?.ExportPermission
  })

  const [openDialog, setOpenDialog] = useState<boolean>(false)


  const handleInputChange = (
    name: keyof ShippingFormVlues,
    value: string | number,
  ) => {
    const updatedValues = {
      ...values,
      [name]: value,

    }
    setValues(updatedValues)
    handleFormChange(updatedValues)
  }



  return (
    <Container maxWidth="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          // handle form submission logic here if necessary
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Title"
              value={values.Title}
              onChange={(e) => handleInputChange('Title', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="出荷日"
              value={values.ShipDate}
              onChange={(e) => handleInputChange('ShipDate', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="出荷元"
              value={values.ShipFrom}
              onChange={(e) => handleInputChange('ShipFrom', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="出荷先"
              value={values.ShipTo}
              onChange={(e) => handleInputChange('ShipTo', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="単位"
              value={values.ShippingInvoiceCurrency}
              onChange={(e) => handleInputChange('ShippingInvoiceCurrency', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={9}>
            <TextField
              fullWidth
              variant="outlined"
              label="本体価格"
              value={values.ShippingInvoicePrice}
              onChange={(e) => handleInputChange('ShippingInvoicePrice', e.target.value)}
              required
            />
          </Grid>





        </Grid>
      </form>
    </Container>
  )
}
