'use client'
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ControlledTextField } from "./controlled-text-field"
import { ShipFormData, componentInfo } from '@/lib/client/casts/ship-casts';
// MUI imports
import { Container, Grid } from '@mui/material'


type ShippingFormProps = {
  initialData: ShipFormData,
  onChange: (data: ShipFormData) => void,
}

function ShippingForm({ initialData, onChange }: ShippingFormProps) {
  const { control, watch } = useForm<ShipFormData>({
    defaultValues: initialData
  });

  const handleFieldChange = (v: any) => {
    const data = watch()
    onChange(data);
  };

  return (
    <Container maxWidth="sm">
      <form >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ControlledTextField
              name="ShippingInvoicePrice"
              control={control}
              defaultValue={initialData.ShippingInvoicePrice}
              type="number"
              label="ShippingInvoicePrice"
              fullWidth
              onChangeValue={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
              name="Title"
              control={control}
              defaultValue={initialData.Title}
              type="text"
              label="Title"
              fullWidth
              onChangeValue={handleFieldChange}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
              name="ShipDate"
              control={control}
              defaultValue={initialData.ShipDate}
              type="date"
              label="ShipDate"
              fullWidth
              onChangeValue={handleFieldChange}
            />
          </Grid>
        </Grid>
      </form >

    </Container >
  );
}

export default ShippingForm;