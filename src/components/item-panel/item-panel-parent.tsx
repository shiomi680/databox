"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ShippingForm, { ShipData } from './item-panel';
import { FileUploadComponent } from '../panels/file-panel';
import { FileInfo } from '@/lib/client/file-io';
import { Button } from '@mui/material';
import { getShipping, updateShipping, ShippingReturn } from '@/lib/client/shipping-io';
import ShipHandle from '@/lib/client/casts/ship-casts';
interface ParentComponentProps {
  shipId: string;
}

function ParentComponent({ shipId }: ParentComponentProps) {
  const router = useRouter();
  const isNew = shipId === 'new';
  const shipIdInt = parseInt(shipId)

  const [formData, setFormData] = useState<ShipData>();
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const { initFormData, initUploadedFiles, loading } = useFetchData(shipId, isNew)


  // const [initFormData, setInitFormData] = useState<ShipData>();
  // const [initUploadedFiles, setInitUploadedFiles] = useState<FileInfo[]>([]);
  // const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    setFormData(initFormData)
    setUploadedFiles(initUploadedFiles)
  }, [initFormData, initUploadedFiles]);

  const onSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (formData) {
      onSubmit(formData, uploadedFiles);
    }
  }

  const onSubmit = async (formData: ShipData, fileInfos: FileInfo[]) => {
    const fileIds = fileInfos.map(f => f.FileId);
    try {
      const data = {
        shipData: formData,
        id: isNew ? undefined : shipIdInt,
        files: fileIds
      }
      const x = await updateShipping(ShipHandle.toPostData(data))
    } catch (error) {
      console.log(error)
    }
  }

  if (loading || !initFormData) {
    return <div>Loading...</div>; // or a loading spinner
  }
  return (
    <form onSubmit={onSubmitForm}>
      <ShippingForm initialData={initFormData} onChange={setFormData} />
      <FileUploadComponent initialFiles={initUploadedFiles} onChange={setUploadedFiles} />
      <Button type="submit" variant="contained">Submit</Button>
    </form>
  );
}

// Define your custom hook
const useFetchData = (shipId: string, isNew: boolean) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [initFormData, setInitFormData] = useState<ShipData>();
  const [initUploadedFiles, setInitUploadedFiles] = useState<FileInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (isNew) {
        setLoading(false)
      } else {
        const apiData = await getShipping(parseInt(shipId));
        const data = ShipHandle.toFormData(apiData)
        setInitFormData(data)
        if (apiData?.Files) {
          setInitUploadedFiles(apiData.Files)
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [shipId, isNew]);

  return { initFormData, initUploadedFiles, loading };
};



export default ParentComponent;