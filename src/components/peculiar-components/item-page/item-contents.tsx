"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GeneralForm } from '../../general-form/general-form-panel';
import { FileAttachment } from '@/lib/db/file/file.model';
import { FileUploadComponent } from '../../file-component/file-panel';
import { itemComponentInfo } from '@/lib/data-handle/item/item-defines';
import { Button, Container } from '@mui/material';
import { getItemAction, postItemAction } from '@/lib/data-handle/item/item-action';
import ItemHandle from '@/lib/data-handle/item/item-convert';
import { ItemFormData, itemFormDefault } from '@/lib/data-handle/item/item-defines';
import AddToast, { toast } from '../../molecules/add-toast';
import { globalConsts } from '@/consts';
import path from 'path';
import TagsField from '../../molecules/tag-field';
import { getTagList } from '@/lib/data-handle/tag/tag-action';
import RevisionSelector from '../../molecules/revision-selector';
import { RevisionInfo, updateItem } from '@/lib/db/item/item.operation';
import { ControlledTextField } from '@/components/general-form/atoms/controlled-text-field';
import { useForm, SubmitHandler } from 'react-hook-form';

const ITEM_PAGE_URL = globalConsts.url.itemPage

interface ParentComponentProps {
  itemId?: string;
  revisionId?: string;
  copy: boolean
}

type InputForm = ItemFormData & {
  commitComment: string
}

function ItemContents({ itemId, revisionId, copy = false }: ParentComponentProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [revisions, setRevisions] = useState<RevisionInfo[]>([])
  const [tagOptions, setTagOptions] = useState<string[]>([])
  const { control, handleSubmit, reset, setValue } = useForm<InputForm>({
    defaultValues: {
      ...itemFormDefault,
      commitComment: ""
    }
  });

  const isNew = itemId ? false : true
  useEffect(() => {
    const fetchData = async () => {
      if (!isNew && itemId) {
        const apiData = await getItemAction(itemId, revisionId);
        const data = ItemHandle.toFormData(apiData)
        const formData: InputForm = {
          ...data,
          commitComment: ""
        }
        reset(formData)
        if (apiData?.Files) {
          setUploadedFiles(apiData.Files)
        }
        if (apiData?.Revisions) {
          setRevisions(apiData.Revisions)
        }
      }
      setLoading(false)
      const tags = await getTagList()
      setTagOptions(tags)
    }
    fetchData();
  }, [itemId]);



  const router = useRouter();

  const onSubmit: SubmitHandler<InputForm> = async (formData: InputForm) => {
    try {
      const creation = (isNew || copy)
      const postId = creation ? undefined : itemId
      const item = ItemHandle.toPostData(formData, postId)
      item.Files = uploadedFiles
      const updatedItem = await postItemAction(item, formData.commitComment)
      if (updatedItem?.Revisions) {
        setRevisions(updatedItem?.Revisions)
      }
      toast.success(("sucessfully submitted!"))
      if (creation && updatedItem && updatedItem.Id) {
        router.push(path.join(ITEM_PAGE_URL, updatedItem.Id.toString()))
      }
    } catch (error) {
      console.log(error)
    }
  }


  const handleRevisionChange = (revisionId: string) => {
    if (itemId) {
      router.push(path.join(ITEM_PAGE_URL, itemId, revisionId))
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <AddToast>
      <Container maxWidth="lg" component="form" onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "20px" }}>
          <RevisionSelector
            revisions={revisions}
            onRevisionChange={handleRevisionChange}
            initialSelectId={revisionId}
          />
        </div>
        <GeneralForm
          fieldParams={itemComponentInfo}
          control={control}
        />

        <div style={{ marginTop: '20px' }}>
          <TagsField
            name='tags'
            tagOptions={tagOptions}
            control={control}
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          {/* <FileUploadTableComponent initialFiles={uploadedFiles} onChange={setUploadedFiles} /> */}
          <FileUploadComponent initialFiles={uploadedFiles} onChange={setUploadedFiles} />
        </div>
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
          <ControlledTextField
            control={control}
            label={"Update message"}
            name='commitComment'
            type='text'
          />
          <Button type="submit" variant="contained">Submit</Button>
        </div>
      </Container >
    </AddToast >
  );
}



export default ItemContents;