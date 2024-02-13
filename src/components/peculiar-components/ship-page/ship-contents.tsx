"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GeneralForm } from '../../general-form/general-form-panel';
import { ShipFormData, componentInfo, shipFormDefault } from '@/lib/data-handle/ship/ship-defines';
import AddToast, { toast } from '../../molecules/add-toast';
import { getShippingAction, postShippingAction } from '@/lib/data-handle/ship/ship-actions';
import { globalConsts } from '@/consts';
import path from 'path';
import { toFormData, toPostData } from '@/lib/data-handle/ship/ship-convert';
import { FileControlComponent } from '@/components/file-component/file-control-panel';
import { ControlledTextField } from '@/components/general-form/atoms/controlled-text-field';
import { useForm, SubmitHandler } from 'react-hook-form';
import ShipHandle from '@/lib/data-handle/ship/ship-convert';
import { Button, Container } from '@mui/material';
import RevisionSelector from '../../molecules/revision-selector';
import { RevisionInfo } from "@/lib/db/common/revision.model";



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
  const router = useRouter();
  const isNew = shipId === 'new';
  const { control, handleSubmit, reset } = useForm<InputForm>(
    {
      defaultValues: {
        ...shipFormDefault,
        commitComment: ""
      }
    }
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [revisions, setRevisions] = useState<RevisionInfo[]>([])

  // const [formData, setFormData] = useState<ShipFormData>();
  // const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>([]);
  // const { initFormData, initUploadedFiles, loading } = useFetchData(shipId, isNew)

  //初期化が終わったらformDataとuploadedFilesを設定
  //formが変更されるまでformDataに値が入っていないと、onSubmit時にデータがない
  // useEffect(() => {
  //   setFormData(initFormData)
  //   setUploadedFiles(initUploadedFiles)
  // }, [initFormData, initUploadedFiles]);

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
  }, [shipId]);

  const handleRevisionChange = (revisionId: string) => {
    if (shipId) {
      router.push(path.join(SHIPPING_PAGE_URL, shipId, revisionId))
    }
  };

  //送信処理
  // const onSubmitForm = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   if (formData) {
  //     try {
  //       const updatedItem = await postDataApi(formData, uploadedFiles, isNew, "", shipId);
  //       toast.success(("sucessfully submitted!"))
  //       if (isNew && updatedItem?.id) {
  //         router.push(path.join(SHIPPING_PAGE_URL, updatedItem.id))
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  // }
  const onSubmit: SubmitHandler<InputForm> = async (formData: InputForm) => {
    try {
      const creation = (isNew || copy)
      const postId = creation ? undefined : shipId
      const postData = toPostData(formData, postId)
      const updatedItem = await postShippingAction(postData, formData.commitComment);
      toast.success("Successfully submitted!");
      if (isNew && updatedItem?.Id) {
        router.push(path.join(SHIPPING_PAGE_URL, updatedItem.Id));
      }



    } catch (error) {
      console.log(error);
    }
  };


  //表示内容
  if (loading) {
    return <div>Loading...</div>; // or a loading spinner
  }
  // return (
  //   <AddToast>
  //     <form onSubmit={handleSubmit(onSubmitForm)}>
  //       <GeneralForm
  //         fieldParams={componentInfo}
  //         initialData={initFormData}
  //         onChange={setFormData}
  //       ></GeneralForm>
  //       <div style={{ marginTop: '20px' }}>
  //         <FileUploadComponent initialFiles={initUploadedFiles} onChange={setUploadedFiles} />
  //       </div>
  //       <div style={{ marginTop: '20px' }}>
  //         <Button type="submit" variant="contained">Submit</Button>
  //       </div>
  //     </form>
  //   </AddToast>
  // );
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
        {/* <Button type="submit" variant="contained">Submit</Button> */}
      </Container>
    </AddToast>
  );
}





export default ShipContents;