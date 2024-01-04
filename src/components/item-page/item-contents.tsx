"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GeneralForm } from '../organisms/general-form-panel';
import { FileUploadComponent } from '../organisms/file-panel';
import { FileInfo } from '@/lib/client/file-io';
import { componentInfo } from "@/lib/client/data-handle/item-data"
import { Button } from '@mui/material';
import { getItem, updateItem, ItemReturn } from '@/lib/client/item-io';
import ItemHandle from '@/lib/client/data-handle/item-data';
import { ItemFormData } from '@/lib/client/data-handle/item-data';
import AddToast, { toast } from '../molecules/add-toast';
import { globalConsts } from '@/consts';
import path from 'path';

const ITEM_PAGE_URL = globalConsts.url.itemPage

interface ParentComponentProps {
  itemId: string;
}

function ItemContents({ itemId }: ParentComponentProps) {
  const router = useRouter();
  const isNew = itemId === 'new';
  const itemIdInt = parseInt(itemId)

  const [formData, setFormData] = useState<ItemFormData>();
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const { initFormData, initUploadedFiles, loading } = useFetchData(itemId, isNew)

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

  const onSubmit = async (formData: ItemFormData, fileInfos: FileInfo[]) => {

    const fileIds = fileInfos.map(f => f.FileId);
    try {
      const data = {
        itemData: formData,
        id: isNew ? undefined : itemIdInt,
        files: fileIds
      }
      const updatedItem = await updateItem(ItemHandle.toPostData(data))
      toast.success(('successfully submitted!'))
      if (isNew) {
        router.push(path.join(ITEM_PAGE_URL, updatedItem.Id.toString()))
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <AddToast>
      <form onSubmit={onSubmitForm}>

        <GeneralForm
          fieldParams={componentInfo}
          initialData={initFormData}
          onChange={setFormData}
        ></GeneralForm>
        <div style={{ marginTop: '20px' }}>
          <FileUploadComponent initialFiles={initUploadedFiles} onChange={setUploadedFiles} />
        </div>
        <div style={{ marginTop: '20px' }}>
          <Button type="submit" variant="contained">Submit</Button>
        </div>
      </form>
    </AddToast>
  );
}

const useFetchData = (itemId: string, isNew: boolean) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [initFormData, setInitFormData] = useState<ItemFormData>();
  const [initUploadedFiles, setInitUploadedFiles] = useState<FileInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (isNew) {
        const data = ItemHandle.toFormData(null)
        setInitFormData(data)
        setLoading(false)
      } else {
        const apiData = await getItem(parseInt(itemId));
        const data = ItemHandle.toFormData(apiData)
        setInitFormData(data)
        if (apiData?.Files) {
          setInitUploadedFiles(apiData.Files)
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [itemId, isNew]);

  return { initFormData, initUploadedFiles, loading };
};

export default ItemContents;