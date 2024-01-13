"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GeneralForm } from '../../organisms/general-form-panel';
import { FileUploadComponent } from '../../organisms/file-panel';
import { FileInfo } from '@/lib/client/file-io';
import { componentInfo } from "@/lib/client/data-handle/item-data"
import { Button } from '@mui/material';
import { getItemAction, ItemReturn, createOrUpdateItem } from '@/lib/actions/item-action';
import ItemHandle from '@/lib/client/data-handle/item-data';
import { ItemFormData } from '@/lib/client/data-handle/item-data';
import AddToast, { toast } from '../../molecules/add-toast';
import { globalConsts } from '@/consts';
import path from 'path';
import TagsField from '../../molecules/tag-field';
import { getTagList } from '@/lib/client/tag-io';
import { Container, Grid, Link } from '@mui/material'
import { TextField } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import RevisionSelector, { Revision } from '../../molecules/revision-selector';

const ITEM_PAGE_URL = globalConsts.url.itemPage

interface ParentComponentProps {
  itemId: string;
  revisionId?: string;
  copy: boolean
}

function ItemContents({ itemId, revisionId, copy = false }: ParentComponentProps) {
  const router = useRouter();
  const isNew = itemId === 'new';
  const itemIdInt = parseInt(itemId)
  const revisionIdInt = revisionId ? parseInt(revisionId) : undefined


  const [formData, setFormData] = useState<ItemFormData>();
  const [commitComment, setCommitComment] = useState<string>("")
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const [tags, setTags] = useState<string[]>([])
  const { initFormData, initUploadedFiles, initTags, tagOptions, revisions, loading } = useFetchData(itemId, isNew, revisionId)

  useEffect(() => {
    setFormData(initFormData)
    setUploadedFiles(initUploadedFiles)
    setTags(initTags)
  }, [initFormData, initUploadedFiles, initTags]);

  const onSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (formData) {
      try {
        const creation = isNew || copy
        const updatedItem = await postDataApi(formData, uploadedFiles, tags, commitComment, creation, itemIdInt);
        toast.success(("sucessfully submitted!"))
        if (creation && updatedItem) {
          router.push(path.join(ITEM_PAGE_URL, updatedItem.ItemModelId.toString()))
        }
      } catch (error) {
        console.log(error)
      }
    }
  }



  const handleRevisionChange = (revisionId: number) => {
    router.push(path.join(ITEM_PAGE_URL, itemId.toString(), revisionId.toString()))
    // router.push(Item)
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <AddToast>
      <Container maxWidth="lg">
        <RevisionSelector
          revisions={revisions}
          onRevisionChange={handleRevisionChange}
          initialSelectId={revisionIdInt}
        />
        <form onSubmit={onSubmitForm} action={(x: FormData) => {
          console.log(x)

        }}>
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

const useFetchData = (itemId: string, isNew: boolean, revisionId?: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [revisions, setRevisions] = useState<Revision[]>([])
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
        const revisionIdInt = revisionId ? parseInt(revisionId) : undefined
        const apiData = await getItemAction(parseInt(itemId), revisionIdInt);
        const data = ItemHandle.toFormData(apiData)
        setInitFormData(data)
        setInitTags(apiData?.Tags ? apiData?.Tags : [])
        if (apiData?.Files) {
          setInitUploadedFiles(apiData.Files)
        }
        if (apiData?.Revisions) {
          setRevisions(apiData.Revisions.map(revision => ({
            id: revision.ItemRevisionId,
            comment: revision.CommitComment,
            createdAt: revision.createdAt.toISOString(),
          })));
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
const postDataApi = async (formData: ItemFormData, fileInfos: FileInfo[], tags: string[], commitComment: string, createNew: boolean, id?: number) => {
  const data = {
    itemData: formData,
    id: createNew ? undefined : id,
    files: fileInfos,
    tags: tags,
    commitComment: commitComment
  }
  const updatedItem = await createOrUpdateItem(ItemHandle.toPostData(data))
  return updatedItem
}

export default ItemContents;