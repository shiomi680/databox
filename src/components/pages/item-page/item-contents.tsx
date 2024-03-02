"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Container } from '@mui/material';
import path from 'path';

import { GeneralForm } from '../../features/general-form/general-form-panel';
import { ControlledTextField } from '@/components/features/general-form/atoms/controlled-text-field';
import TagsField from '../../features/tag-field';
import RevisionSelector from '../../features/revision-selector';
import AddToast, { toast } from '../../common/add-toast';
import { FileControlComponent } from '@/components/features/file-component/file-control-panel';

import { getItemAction, postItemAction } from '@/lib/data-handle/item/item-action';
import { getTagList } from '@/lib/data-handle/tag/tag-action';
import ItemHandle from '@/lib/data-handle/item/item-convert';

import { ItemFormData, itemFormDefault, itemComponentInfo } from '@/lib/data-handle/item/item-defines';

import { RevisionInfo } from "@/lib/db/revision/revision.model";
import { ControlledToggle } from '@/components/features/general-form/atoms/controlled-toggle';

import { globalConsts } from '@/consts';
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
  const [loading, setLoading] = useState<boolean>(true);
  const [revisions, setRevisions] = useState<RevisionInfo[]>([])
  const [tagOptions, setTagOptions] = useState<string[]>([])
  const [selectedRevisionId, setSelectedRevisionId] = useState<string | undefined>(revisionId);
  const { control, handleSubmit, reset, setValue } = useForm<InputForm>({
    defaultValues: {
      ...itemFormDefault,
      commitComment: ""
    }
  });



  const router = useRouter();

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

        if (apiData?.Revisions) {
          setRevisions(apiData.Revisions)
        }
      }
      setLoading(false)
      const tags = await getTagList()
      setTagOptions(tags)
    }
    fetchData();
  }, [itemId, revisionId]);


  const onSubmit: SubmitHandler<InputForm> = async (formData: InputForm) => {
    try {
      const creation = (isNew || copy)
      const postId = creation ? undefined : itemId
      const item = ItemHandle.toPostData(formData, postId)
      const updatedItem = await postItemAction(item, formData.commitComment)
      if (updatedItem?.Revisions) {
        setRevisions(updatedItem?.Revisions)
        setSelectedRevisionId(updatedItem.Revisions[0]?.Id);

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
            initialSelectId={selectedRevisionId}
          />
        </div>
        <GeneralForm
          fieldParams={itemComponentInfo}
          control={control}
        />

        <div style={{ marginTop: '20px' }}>
          <TagsField
            name='Tags'
            tagOptions={tagOptions}
            control={control}
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          <FileControlComponent control={control} name='Files' />
        </div>
        <ControlledToggle
          control={control}
          name='Deleted'
          label="Deleted"

        />
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