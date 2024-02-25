"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GeneralForm } from '../../features/general-form/general-form-panel';
import { ShipFormData, componentInfo, shipFormDefault } from '@/lib/data-handle/ship/ship-defines';
import AddToast, { toast } from '../../common/add-toast';
import { getShippingAction, postShippingAction } from '@/lib/data-handle/ship/ship-actions';
import { globalConsts } from '@/consts';
import path from 'path';
import { toFormData, toPostData } from '@/lib/data-handle/ship/ship-convert';
import { FileControlComponent } from '@/components/features/file-component/file-control-panel';
import { ControlledTextField } from '@/components/features/general-form/atoms/controlled-text-field';
import { useForm, SubmitHandler } from 'react-hook-form';
import ShipHandle from '@/lib/data-handle/ship/ship-convert';
import { Button, Container } from '@mui/material';
import RevisionSelector from '../../features/revision-selector';
import { RevisionInfo } from "@/lib/db/revision/revision.model";


const SHIPPING_PAGE_URL = globalConsts.url.shippingPage

interface ParentComponentProps {
  shipId?: string;
  revisionId?: string;
  copy: boolean
}
type InputForm = ShipFormData & {
  commitComment: string
}

function ShipContents({ shipId, revisionId, copy = false }: ParentComponentProps) {
  const [selectedRevisionId, setSelectedRevisionId] = useState<string | undefined>(revisionId);
  const [loading, setLoading] = useState<boolean>(true);
  const [revisions, setRevisions] = useState<RevisionInfo[]>([])



  const { control, handleSubmit, reset } = useForm<InputForm>(
    {
      defaultValues: {
        ...shipFormDefault,
        commitComment: ""
      }
    }
  );
  const router = useRouter();
  const isNew = shipId === 'new';
  useEffect(() => {
    const fetchData = async () => {
      if (!isNew && shipId) {

        const apiData = await getShippingAction(shipId, revisionId);
        const data = ShipHandle.toFormData(apiData)
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
    }
    fetchData();
  }, [shipId, revisionId]);


  const onSubmit: SubmitHandler<InputForm> = async (formData: InputForm) => {
    try {
      const creation = (isNew || copy)
      const postId = creation ? undefined : shipId
      const postData = toPostData(formData, postId)
      const updatedItem = await postShippingAction(postData, formData.commitComment);
      toast.success("Successfully submitted!");
      if (updatedItem?.Revisions) {
        setRevisions(updatedItem.Revisions);
        setSelectedRevisionId(updatedItem.Revisions[0]?.Id.toString()); // Update the selectedRevisionId with the latest revision's ID
      }

      if (isNew && updatedItem?.Id) {
        router.push(path.join(SHIPPING_PAGE_URL, updatedItem.Id));
      }




    } catch (error) {
      console.log(error);
    }
  };

  const handleRevisionChange = (revisionId: string) => {
    if (shipId) {
      router.push(path.join(SHIPPING_PAGE_URL, shipId, revisionId))
    }
  };

  //表示内容
  if (loading) {
    return <div>Loading...</div>; // or a loading spinner
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
          fieldParams={componentInfo}
          control={control}
        />
        <div style={{ marginTop: '20px' }}>
          <FileControlComponent control={control} name="Files" />
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
      </Container>
    </AddToast>
  );
}





export default ShipContents;