"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ShippingForm, { ShipData } from './item-panel';
import { FileUploadComponent } from '../file-panel';
import { FileInfo } from '@/lib/client/file-io';
import { useGetShipQuery, useCreateShipMutation, useUpdateShipMutation } from '@/generated/graphql';
import { Button } from '@mui/material';

interface ParentComponentProps {
  shipId: string;
}

function ParentComponent({ shipId }: ParentComponentProps) {
  const router = useRouter();
  const isNew = shipId === 'new';
  const { data, loading, error } = useGetShipQuery({ variables: { Id: shipId }, skip: isNew });
  const [createShip] = useCreateShipMutation();
  const [updateShip] = useUpdateShipMutation();
  const xx = data?.getShip
  const initialData: ShipData = isNew || !data || !data.getShip ? {
    ShipDate: "",
    ShippingInvoicePrice: 0,
    Title: ""
  } : {
    ShipDate: data.getShip.ShipDate || "",
    ShippingInvoicePrice: data.getShip.ShippingInvoicePrice || 0,
    Title: data.getShip.Title || ""
  };

  const initialFiles: FileInfo[] = isNew || !data || !data.getShip ? [] :
    (data.getShip.Files || []).map(file => ({
      ...file,
      FileId: parseInt(file?.FileId || '0'),
      UploadTimestamp: file?.UploadTimestamp ? new Date(file.UploadTimestamp) : new Date(),
    }));
  const [formData, setFormData] = useState<ShipData>(initialData);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>(initialFiles);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const onSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData, uploadedFiles);
  }

  const onSubmit = async (formData: ShipData, files: FileInfo[]) => {
    const fileIds = files.map(file => file.FileId);
    try {
      if (isNew) {
        const response = await createShip({ variables: { ShipDate: formData.ShipDate, Title: formData.Title, ShippingInvoicePrice: formData.ShippingInvoicePrice, FileIds: fileIds } });
        // Redirect after creation
        router.push(`/pages/ship/${response.data?.createShip.Id}`)
      } else {
        await updateShip({ variables: { Id: shipId, ShipDate: formData.ShipDate, Title: formData.Title, ShippingInvoicePrice: formData.ShippingInvoicePrice, FileIds: fileIds } });
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return <div>Loading...</div>; // or a loading spinner
  }


  return (
    <form onSubmit={onSubmitForm}>
      <ShippingForm initialData={initialData} onChange={setFormData} />
      <FileUploadComponent initialFiles={initialFiles} onChange={setUploadedFiles} />
      <Button type="submit" variant="contained">Submit</Button>
    </form>
  );
}

export default ParentComponent;