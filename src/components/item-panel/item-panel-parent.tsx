"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import ShippingForm, { ShipData } from './item-panel';

function ParentComponent() {
  const [data, setData] = useState<ShipData | null>(null);

  useEffect(() => {
    // Replace this with your API call
    fetchInitialData().then(data => setData(data));
  }, []);

  const handleSubmit = (data: ShipData) => {
    // Call your API here
    console.log(data);
  };

  if (!data) {
    return null; // or a loading spinner
  }

  return (
    <div>
      <ShippingForm initialData={data} onSubmit={handleSubmit} />
      <Button type="submit" variant="contained" onClick={() => handleSubmit(data)}>Submit</Button>
    </div>
  );
}

async function fetchInitialData(): Promise<ShipData> {
  // Replace this with your API call
  return {
    ShipDate: new Date(),
    Title: 'Initial title',
    ShippingInvoicePrice: 100,
  };
}

export default ParentComponent;