"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GeneralForm } from '../../organisms/general-form-panel';
import { FileAttachment } from '@/lib/db/file/file.model';
import { FileUploadComponent } from '../../organisms/file-panel';
import { itemComponentInfo } from '@/lib/data-handle/item/item-defines';
import { Button, Container, TextField } from '@mui/material';
import { getItemAction, postItemAction } from '@/lib/data-handle/item/item-action';
import ItemHandle from '@/lib/data-handle/item/item-convert';
import { ItemFormData } from '@/lib/data-handle/item/item-defines';
import AddToast, { toast } from '../../molecules/add-toast';
import { globalConsts } from '@/consts';
import path from 'path';
import TagsField from '../../molecules/tag-field';
import { getTagList } from '@/lib/data-handle/tag/tag-action';
import RevisionSelector from '../../molecules/revision-selector';
import { RevisionInfo } from '@/lib/db/item/item.operation';
import { Item, ItemInput } from '@/lib/db/item/item.model';

const ITEM_PAGE_URL = globalConsts.url.itemPage

interface ParentComponentProps {
  itemId?: string;
  revisionId?: string;
  copy: boolean
}

function ItemContents({ itemId, revisionId, copy = false }: ParentComponentProps) {
  const [formData, setFormData] = useState<ItemFormData>();
  const [commitComment, setCommitComment] = useState<string>("")
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>([]);
  const [tags, setTags] = useState<string[]>([])
  const { initFormData, initUploadedFiles, initTags, tagOptions, revisions, loading } = useFetchData(itemId, revisionId)
  const isNew = itemId ? false : true;
  const router = useRouter();

  useEffect(() => {
    setFormData(initFormData)
    setUploadedFiles(initUploadedFiles)
    setTags(initTags)
  }, [initFormData, initUploadedFiles, initTags]);


  const onSubmitForm = async (event: React.FormEvent) => {

    event.preventDefault();
    if (formData) {
      try {
        const creation = (isNew || copy)
        const postId = creation ? undefined : itemId
        const updatedItem = await postDataApi(formData, uploadedFiles, tags, commitComment, postId);
        toast.success(("sucessfully submitted!"))
        if (creation && updatedItem && updatedItem.id) {
          router.push(path.join(ITEM_PAGE_URL, updatedItem.id.toString()))
        }
      } catch (error) {
        console.log(error)
      }
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
      <Container maxWidth="lg">
        <div style={{ marginBottom: "20px" }}>
          <RevisionSelector
            revisions={revisions}
            onRevisionChange={handleRevisionChange}
            initialSelectId={revisionId}
          />
        </div>
        <form onSubmit={onSubmitForm} >
          <GeneralForm
            fieldParams={itemComponentInfo}
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
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
            <TextField label="Update message" style={{ marginRight: '10px' }} onChange={(e) => {
              setCommitComment(e.target.value)
            }} />
            <Button type="submit" variant="contained">Submit</Button>
          </div>
        </form>
      </Container >
    </AddToast >
  );
}



const useFetchData = (itemId?: string, revisionId?: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [revisions, setRevisions] = useState<RevisionInfo[]>([])
  const [initFormData, setInitFormData] = useState<ItemFormData>();
  const [initUploadedFiles, setInitUploadedFiles] = useState<FileAttachment[]>([]);
  const [initTags, setInitTags] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([])
  const isNew = itemId ? false : true
  useEffect(() => {
    const fetchData = async () => {
      if (isNew || !itemId) {
        const data = ItemHandle.toFormData(null)
        setInitFormData(data)
        setLoading(false)
      } else {
        const apiData = await getItemAction(itemId, revisionId);
        const data = ItemHandle.toFormData(apiData)
        setInitFormData(data)
        setInitTags(apiData?.Tags ? apiData?.Tags : [])
        if (apiData?.Files) {
          setInitUploadedFiles(apiData.Files)
        }
        if (apiData?.Revisions) {
          setRevisions(apiData.Revisions)
        }
        setLoading(false);
      }
      const tags = await getTagList()
      setTagOptions(tags)
    }
    fetchData();
  }, [itemId, isNew]);

  return { initFormData, initUploadedFiles, initTags, tagOptions, revisions, loading };
};
const postDataApi = async (formData: ItemFormData, fileInfos: FileAttachment[], tags: string[], commitComment: string, id?: string) => {
  const item: ItemInput = {
    id: id,
    Cost: parseFloat(formData.Cost),
    ItemName: formData.ItemName,
    SalePrice: parseFloat(formData.SalePrice),
    ModelNumber: formData.ModelNumber,
    ItemDescription: formData.ItemDescription,
    Files: fileInfos,
    Tags: tags
  }

  const updatedItem = await postItemAction(item, commitComment)
  return updatedItem
}

export default ItemContents;