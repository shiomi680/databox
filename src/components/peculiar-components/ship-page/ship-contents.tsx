"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GeneralForm } from '../../general-form/general-form-panel';
import { FileUploadComponent } from '../../file-component/file-panel';
import { File as FileInfo, FileAttachment } from '@/lib/db/file/file.model';
import { Button } from '@mui/material';
import { ShipFormData, componentInfo } from '@/lib/data-handle/ship/ship-defines';
import AddToast, { toast } from '../../molecules/add-toast';
import { getShippingAction, postShippingAction } from '@/lib/data-handle/ship/ship-actions';
import { globalConsts } from '@/consts';
import path from 'path';
import { toFormData, toPostData } from '@/lib/data-handle/ship/ship-convert';


const SHIPPING_PAGE_URL = globalConsts.url.shippingPage

interface ParentComponentProps {
  shipId: string;
}

function ShipContents({ shipId }: ParentComponentProps) {
  const router = useRouter();
  const isNew = shipId === 'new';
  const shipIdInt = parseInt(shipId)

  const [formData, setFormData] = useState<ShipFormData>();
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>([]);
  const { initFormData, initUploadedFiles, loading } = useFetchData(shipId, isNew)


  //初期化が終わったらformDataとuploadedFilesを設定
  //formが変更されるまでformDataに値が入っていないと、onSubmit時にデータがない
  useEffect(() => {
    setFormData(initFormData)
    setUploadedFiles(initUploadedFiles)
  }, [initFormData, initUploadedFiles]);


  //送信処理
  const onSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (formData) {
      try {
        const updatedItem = await postDataApi(formData, uploadedFiles, isNew, "", shipId);
        toast.success(("sucessfully submitted!"))
        if (isNew && updatedItem?.id) {
          router.push(path.join(SHIPPING_PAGE_URL, updatedItem.id))
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  //表示内容
  if (loading) {
    return <div>Loading...</div>; // or a loading spinner
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

//初期化用の値を取得
const useFetchData = (shipId: string, isNew: boolean) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [initFormData, setInitFormData] = useState<ShipFormData>();
  const [initUploadedFiles, setInitUploadedFiles] = useState<FileAttachment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (isNew) {
        const data = toFormData(null)
        setInitFormData(data)
        setLoading(false)
      } else {
        const apiData = await getShippingAction(shipId);
        const data = toFormData(apiData)
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
const postDataApi = async (formData: ShipFormData, fileInfos: FileAttachment[], createNew: boolean, commitComment: string, id?: string) => {
  const data = {
    shipData: formData,
    id: createNew ? undefined : id,
    files: fileInfos
  }
  const updatedItem = await postShippingAction(toPostData(data), commitComment)
  return updatedItem
}



export default ShipContents;