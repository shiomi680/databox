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
import TagsField from '../molecules/tag-field';
import { getTagList } from '@/lib/client/tag-io';
import { Container, Grid } from '@mui/material'


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
  const [tags, setTags] = useState<string[]>([])
  const { initFormData, initUploadedFiles, initTags, tagOptions, loading } = useFetchData(itemId, isNew)

  useEffect(() => {
    setFormData(initFormData)
    setUploadedFiles(initUploadedFiles)
    setTags(initTags)
  }, [initFormData, initUploadedFiles, initTags]);

  const onSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (formData) {
      onSubmit(formData, uploadedFiles);
    }
  }

  const onSubmit = async (formData: ItemFormData, fileInfos: FileInfo[]) => {

    try {
      const data = {
        itemData: formData,
        id: isNew ? undefined : itemIdInt,
        files: fileInfos.map(f => f.FileId),
        tags: tags
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
      <Container maxWidth="lg">
        <form onSubmit={onSubmitForm}>
          <GeneralForm
            fieldParams={componentInfo}
            initialData={initFormData}
            onChange={setFormData}
          />

          <div style={{ marginTop: '20px' }}>
            <TagsField

              tagOptions={tagOptions}
              initialTags={initTags}
              onTagsChange={setTags}
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <FileUploadComponent initialFiles={initUploadedFiles} onChange={setUploadedFiles} />
          </div>
          <div style={{ marginTop: '20px' }}>
            <Button type="submit" variant="contained">Submit</Button>
          </div>
        </form>
      </Container >
    </AddToast >
  );
}

const useFetchData = (itemId: string, isNew: boolean) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [initFormData, setInitFormData] = useState<ItemFormData>();
  const [initUploadedFiles, setInitUploadedFiles] = useState<FileInfo[]>([]);
  const [initTags, setInitTags] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([])

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
        setInitTags(apiData.Tags)
        if (apiData?.Files) {
          setInitUploadedFiles(apiData.Files)
        }
        setLoading(false);
      }
      const tags = await getTagList()
      setTagOptions(tags)
    }
    fetchData();
  }, [itemId, isNew]);

  return { initFormData, initUploadedFiles, initTags, tagOptions, loading };
};

export default ItemContents;