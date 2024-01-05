import React, { useState, useEffect } from 'react';
import { FileInfo } from '@/lib/client/file-io';
import { Button, List, ListItem, CircularProgress, Container, Typography, IconButton, Switch } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { uploadFiles } from '@/lib/client/file-io';
import { useDropzone } from 'react-dropzone';
type FileUploadProps = {
  initialFiles: FileInfo[],
  onChange: (files: FileInfo[]) => void,
}

export function FileUploadComponent({ initialFiles, onChange }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>(initialFiles);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const [showAllFiles, setShowAllFiles] = useState<boolean>(false); // New state for show all toggle


  // visbleボタンを押したとき
  const toggleFileVisibility = (fileId: number) => {
    const newFiles = uploadedFiles.map(file =>
      file.FileId === fileId ? { ...file, Visible: !file.Visible } : file
    );
    setUploadedFiles(newFiles);
    onChange(newFiles);
  };


  // // ファイルアップロード
  const uploadFileHandle = async (files: File[]) => {
    try {
      setIsUploading(true);
      const comingFiles: FileInfo[] = await Promise.all(files.map(async f => await uploadFiles(f)))
      if (comingFiles) {
        const newFiles = [...uploadedFiles, ...comingFiles];
        setUploadedFiles(newFiles);
        onChange(newFiles);
      }
    } catch (error) {
      console.error("Upload failed", error);
      // Handle the error state in the UI
    } finally {
      setIsUploading(false);
    }
  };

  //アップロードボタンを押したときのハンドラー
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      return await uploadFileHandle(filesArray)
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
    onDrop: async (acceptedFiles) => {
      await uploadFileHandle(acceptedFiles)
      setDragging(false)
    },
    onDragEnter: (event) => {
      setDragging(true)
    },
    onDragLeave: (event) => {
      setDragging(false)
    },
    noClick: true

  });

  return (
    <div {...getRootProps()}
      style={{
        padding: '20px',
        border: '2px dashed #cccccc',
        backgroundColor: dragging ? '#f0f0f0' : 'transparent',
        cursor: 'pointer',
      }}>
      <Button variant="contained" component="label" style={{
        marginBottom: "2px"
      }}>
        Upload File
        <input type="file"
          multiple
          style={{ display: 'none' }} // hide the input
          onChange={handleFileChange}
        />
      </Button>
      <Switch
        checked={showAllFiles}
        onChange={() => setShowAllFiles((prevShowAllFiles) => !prevShowAllFiles)}
        color="primary"
        name="showAllFilesSwitch"
        inputProps={{ 'aria-label': 'Toggle file visibility' }}
      />
      Show all
      <input {...getInputProps()} />
      <Container>
        {isUploading && <CircularProgress />}
        <List style={{ marginTop: 20 }}>
          {uploadedFiles.filter(file => showAllFiles || file.Visible).map((file) => (
            <ListItem
              key={file.FileId}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid #f0f0f0',
              }}>
              <IconButton onClick={() => toggleFileVisibility(file.FileId)}>
                {file.Visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
              <a
                href={file.Url}
                download
                style={{ flex: 1, display: 'flex', alignItems: 'center', }}
              >
                <Typography variant="body1" style={{ marginRight: 10 }}>
                  <span role="img" aria-label="file">
                    📄
                  </span>{' '}
                  {file.FileName}
                </Typography>
              </a>
              <Button startIcon={<DeleteIcon />}
                variant="outlined"
                color="secondary"
                onClick={() => handleDelete(file.FileId)}>
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
      </Container>
    </div>
  )
}