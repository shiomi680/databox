import React, { useState, useEffect } from 'react';
import { FileInfo } from '@/lib/client/file-io';
import { Button, List, ListItem, CircularProgress, Container, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { uploadFiles } from '@/lib/client/file-io';
import { useDropzone } from 'react-dropzone';

type FileUploadProps = {
  initialFiles: FileInfo[],
  onChange: (files: FileInfo[]) => void,
}

export function FileUploadComponent({ initialFiles, onChange }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>(initialFiles);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // // ファイルアップロード
  const uploadFileHandle = async (file: File) => {
    setIsUploading(true);
    const uploaded: FileInfo = await uploadFiles(file);

    if (uploaded && 'FileId' in uploaded) { // Check if uploaded is a FileModel
      const newFiles = [...uploadedFiles, uploaded];
      setUploadedFiles(newFiles)
      onChange(newFiles)
    }
    setIsUploading(false);
  }

  //アップロードボタンを押したときのハンドラー
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      return await uploadFileHandle(filesArray[0])
    }
  };
  //ファイル削除
  const handleDelete = async (fileId: number) => {
    const newFiles = uploadedFiles.filter((file) => file.FileId !== fileId);
    setUploadedFiles(newFiles)
    onChange(newFiles)
  }

  //D&D設定
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      uploadFileHandle(acceptedFiles[0])
    },
    noClick: true

  });



  return (
    <div>
      <Button variant="contained" component="label">
        Upload File
        <input type="file"
          style={{ display: 'none' }} // hide the input
          onChange={handleFileChange}
        />
      </Button>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Container>
          {isUploading && <CircularProgress />}
          <List>
            {uploadedFiles.map((file) => (
              <ListItem key={file.FileId}>
                <a href={file.Url} download>{file.FileName}</a>
                <Button startIcon={<DeleteIcon />}
                  variant="outlined"
                  color="secondary"
                  onClick={(event: any) => {
                    event.stopPropagation();
                    event.preventDefault();
                    handleDelete(file.FileId);
                  }}>
                  Delete
                </Button>
              </ListItem>
            ))}
          </List>
        </Container>
      </div>
    </div>
  );
}