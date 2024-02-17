import React, { useState, useEffect } from 'react';
import { FileAttachment, File as FileClass } from '@/lib/db/file/file.model';
import { Button, CircularProgress, Container, IconButton, Switch } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { uploadFiles } from '@/lib/client/file-io';
import { useDropzone } from 'react-dropzone';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';

type FileUploadProps = {
  initialFiles: FileAttachment[],
  onChange: (files: FileAttachment[]) => void,
}

export function FileUploadTableComponent({ initialFiles, onChange }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>(initialFiles);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const [showAllFiles, setShowAllFiles] = useState<boolean>(false); // New state for show all toggle


  // visbleボタンを押したとき
  const toggleFileVisibility = (fileId: string) => {
    const newFiles = uploadedFiles.map(file =>
      file.Id === fileId ? { ...file, Visible: !file.Visible } : file
    );
    setUploadedFiles(newFiles);
    onChange(newFiles);
  };


  // // ファイルアップロード
  const uploadFileHandle = async (files: File[]) => {
    try {
      setIsUploading(true);
      const comingFiles = await Promise.all(files.map(async f => await uploadFiles(f)))
      if (comingFiles) {
        const attachedFiles: FileAttachment[] = comingFiles.map(f => ({
          ...f,
          Id: f.Id,
          Visible: true
        }))
        const newFiles = [...uploadedFiles, ...attachedFiles];
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
  const handleDelete = async (fileId: string) => {
    const newFiles = uploadedFiles.filter((file) => file.Id !== fileId);
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

  const columns: GridColDef[] = [
    {
      field: 'Visible',
      headerName: 'Visible',
      renderCell: (params) => (
        <IconButton onClick={() => toggleFileVisibility(params.row.Id)}>
          {params.row.Visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      ),
    },
    {
      field: 'FileName',
      headerName: 'File Name',
      renderCell: (params) => (
        <a href={params.row.Url} download>
          <span role="img" aria-label="file">
            📄
          </span>{' '}
          {params.row.FileName}
        </a>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      renderCell: (params) => (
        <Button startIcon={<DeleteIcon />}
          variant="outlined"
          color="secondary"
          onClick={() => handleDelete(params.row.Id)}>
          Delete
        </Button>
      ),
    },
  ];


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
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={uploadedFiles.filter(file => showAllFiles || file.Visible)}
            columns={columns}
            getRowId={(row) => row.Id}
            slots={{ toolbar: GridToolbar }}
          />
        </div>
      </Container>
    </div>
  )
}