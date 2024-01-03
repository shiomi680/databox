'use client'
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ControlledTextField } from "./controlled-text-field"

export type ShipData = {
  ShipDate: string,
  Title: string,
  ShippingInvoicePrice: string,
}

type ShippingFormProps = {
  initialData: ShipData,
  onChange: (data: ShipData) => void,
}

function ShippingForm({ initialData, onChange }: ShippingFormProps) {
  const { control, watch } = useForm<ShipData>({
    defaultValues: initialData
  });

  const handleFieldChange = (v: any) => {
    const data = watch()
    onChange(data);
  };

  return (
    <form >
      <ControlledTextField
        name="ShippingInvoicePrice"
        control={control}
        defaultValue={initialData.ShippingInvoicePrice}
        type="number"
        label="ShippingInvoicePrice"
        onChangeValue={handleFieldChange}
      />
      <ControlledTextField
        name="Title"
        control={control}
        defaultValue={initialData.Title}
        type="text"
        label="Title"
        onChangeValue={handleFieldChange}
      />
      <ControlledTextField
        name="ShipDate"
        control={control}
        defaultValue={initialData.ShipDate}
        type="date"
        label="ShipDate"
        onChangeValue={handleFieldChange}
      />
    </form>
  );
}

export default ShippingForm;