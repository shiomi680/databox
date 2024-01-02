'use client'
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ControlledTextField } from "./controlled-text-field"

export type ShipData = {
  ShipDate: string,
  Title: string,
  ShippingInvoicePrice: number,
}

type ShippingFormProps = {
  initialData: ShipData,
  onChange: (data: ShipData) => void,
}

function ShippingForm({ initialData, onChange }: ShippingFormProps) {
  const { control, watch } = useForm<ShipData>({
    defaultValues: initialData
  });

  useEffect(() => {
    const data = watch();
    const parsedData = {
      ...data,
      ShippingInvoicePrice: parseFloat(data.ShippingInvoicePrice as unknown as string)
    };
    onChange(parsedData);
  }, [watch]);
  return (
    <form >
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
        label="Title"
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