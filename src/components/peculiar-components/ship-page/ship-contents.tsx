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

  //ハンドラー
  const onSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (formData) {
      onSubmit(formData, uploadedFiles);
    }
  }
  //送信処理
  const onSubmit = async (formData: ShipFormData, fileInfos: FileInfo[]) => {
    if (!formData.Title || formData.Title == "") {
      toast.error("tiltle is required")
      return
    }
    try {
      const data = {
        shipData: formData,
        id: isNew ? undefined : shipIdInt,
        files: fileInfos
      }
      const updatedItem = await updateShipping(ShipHandle.toPostData(data))
      toast.success(('successfully submitted!'))
      //新規作成時は作成されたアイテムの編集ページへリダイレクト
      if (isNew) {
        router.push(path.join(SHIPPING_PAGE_URL, updatedItem.Id.toString()))
      }
    } catch (error) {
      console.log(error)
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



export default ShipContents;