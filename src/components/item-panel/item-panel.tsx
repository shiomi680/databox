'use client'
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import { ControlledTextField } from "./controlled-text-field"

export type ShipData = {
  ShipDate: Date,
  Title: string,
  ShippingInvoicePrice: number,
}

type ShippingFormProps = {
  initialData: ShipData,
  onSubmit: (data: ShipData) => void,
}

function ShippingForm({ initialData, onSubmit }: ShippingFormProps) {
  const { handleSubmit, control } = useForm<ShipData>({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ControlledTextField
        name="ShippingInvoicePrice"
        control={control}
        defaultValue={initialData.ShippingInvoicePrice}
        type="number"
        label="ShippingInvoicePrice"
      />
      <ControlledTextField
        name="Title"
        control={control}
        defaultValue={initialData.Title}
        type="text"
        label="ShippingInvoicePrice"
      />
      <ControlledTextField
        name="ShipDate"
        control={control}
        defaultValue={initialData.ShipDate}
        type="date"
        label="ShipDate"
      />

    </form>
  );
}

export default ShippingForm;