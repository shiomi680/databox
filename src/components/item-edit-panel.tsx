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
  ShipDate: string | null | undefined
  ShipFrom: string | null | undefined
  ShipTo: string | null | undefined
  Title: string | undefined
  ShippingInvoicePrice: string | null | undefined
  ShippingInvoiceCurrency: string | null | undefined
  TradeTerm: string | null | undefined
  AcquisitionDate: string | null | undefined
  AcquisitionPrice: string | null | undefined
  BookValue: string | null | undefined
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
    ShipTo: initialItem?.ShipTo,
    Title: initialItem?.Title,
    ShippingInvoicePrice: initialItem?.ShippingInvoicePrice,
    ShippingInvoiceCurrency: initialItem?.ShippingInvoiceCurrency,
    TradeTerm: initialItem?.TradeTerm,
    AcquisitionDate: initialItem?.AcquisitionDate,
    AcquisitionPrice: initialItem?.AcquisitionPrice,
    BookValue: initialItem?.BookValue,
    Defrayer: initialItem?.Defrayer,
    Comment: initialItem?.Comment,
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
              type="date"
              // value={values.ShipDate}
              defaultValue={values.ShipDate}
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
          <Grid item xs={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="単位"
              value={values.ShippingInvoiceCurrency}
              onChange={(e) => handleInputChange('ShippingInvoiceCurrency', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              fullWidth
              variant="outlined"
              label="本体価格"

              type="number"
              value={values.ShippingInvoicePrice}
              onChange={(e) => handleInputChange('ShippingInvoicePrice', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="貿易条件"
              value={values.TradeTerm}
              onChange={(e) => handleInputChange('TradeTerm', e.target.value)}
              required
            />

          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="取得日"
              type="date"
              value={values.AcquisitionDate}
              onChange={(e) => handleInputChange('AcquisitionDate', e.target.value)}
              required
            />

          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="取得金額 [円]"

              type="number"
              value={values.AcquisitionPrice}
              onChange={(e) => handleInputChange('AcquisitionPrice', e.target.value)}
              required
            />

          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="簿価 [円]"

              type="number"
              value={values.BookValue}
              onChange={(e) => handleInputChange('BookValue', e.target.value)}
              required
            />

          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="有償/無償"
              value={values.Defrayer}
              onChange={(e) => handleInputChange('Defrayer', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Invoice No"
              value={values.InvoiceNo}
              onChange={(e) => handleInputChange('InvoiceNo', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="輸送手段"
              value={values.Carrier}
              onChange={(e) => handleInputChange('Carrier', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="AWB No"
              value={values.AwbNo}
              onChange={(e) => handleInputChange('AwbNo', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="輸出許可"
              value={values.ExportPermission}
              onChange={(e) => handleInputChange('ExportPermission', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="備考"
              value={values.Comment}
              onChange={(e) => handleInputChange('Comment', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="取得に関する備考"
              value={values.CommentAboutAcquisition}
              onChange={(e) => handleInputChange('CommentAboutAcquisition', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="販売に関する備考"
              value={values.CommentAboutSale}
              onChange={(e) => handleInputChange('CommentAboutSale', e.target.value)}
              required
            />
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}
