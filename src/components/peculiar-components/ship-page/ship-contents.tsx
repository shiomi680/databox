"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GeneralForm } from '../../organisms/general-form-panel';
import { FileUploadComponent } from '../../organisms/file-panel';
import { FileInfo } from '@/lib/client/file-io';
import { componentInfo } from "@/lib/client/data-handle/ship-data"
import { Button } from '@mui/material';
import { getShipping, updateShipping, ShippingReturn } from '@/lib/client/shipping-io';
import ShipHandle from '@/lib/client/data-handle/ship-data';
import { ShipFormData } from '@/lib/client/data-handle/ship-data';
import AddToast, { toast } from '../../molecules/add-toast';
import { globalConsts } from '@/consts';
import path from 'path';

const SHIPPING_PAGE_URL = globalConsts.url.shippingPage

interface ParentComponentProps {
  shipId: string;
}

function ShipContents({ shipId }: ParentComponentProps) {
  const router = useRouter();
  const isNew = shipId === 'new';
  const shipIdInt = parseInt(shipId)

  const [formData, setFormData] = useState<ShipFormData>();
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
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
        const updatedItem = await postDataApi(formData, uploadedFiles, isNew, shipIdInt);
        toast.success(("sucessfully submitted!"))
        if (isNew) {
          router.push(path.join(SHIPPING_PAGE_URL, updatedItem.ShippingModelId.toString()))
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
  const [initUploadedFiles, setInitUploadedFiles] = useState<FileInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (isNew) {
        const data = ShipHandle.toFormData(null)
        setInitFormData(data)
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
const postDataApi = async (formData: ShipFormData, fileInfos: FileInfo[], createNew: boolean, id?: number) => {
  const data = {
    shipData: formData,
    id: createNew ? undefined : id,
    files: fileInfos
  }
  const updatedItem = await updateShipping(ShipHandle.toPostData(data))
  return updatedItem
}



export default ShipContents;