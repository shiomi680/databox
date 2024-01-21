import React, { useState, useCallback, useMemo } from 'react';
import { FileAttachment } from '@/lib/db/file/file.model';
import { Button, List, CircularProgress, Container, Switch } from '@mui/material';

import { uploadFiles } from '@/lib/client/file-io';
import { useDropzone } from 'react-dropzone';
import FileItem from './molecules/file-item';
import FileUploadIcon from '@mui/icons-material/FileUpload';

type FileUploadProps = {
  initialFiles: FileAttachment[],
  onChange: (files: FileAttachment[]) => void,
}

export function FileUploadComponent({ initialFiles, onChange }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>(initialFiles);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const [showAllFiles, setShowAllFiles] = useState<boolean>(false);

  const visibleFiles = useMemo(() => uploadedFiles.filter(file => showAllFiles || file.Visible), [uploadedFiles, showAllFiles]);

  const toggleFileVisibility = useCallback((fileId: string) => {
    const newFiles = uploadedFiles.map(file =>
      file.id === fileId ? { ...file, Visible: !file.Visible } : file
    );
    setUploadedFiles(newFiles);
    onChange(newFiles);
  }, [uploadedFiles, onChange]);

  const handleDelete = useCallback((fileId: string) => {
    const newFiles = uploadedFiles.filter((file) => file.id !== fileId);
    setUploadedFiles(newFiles)
    onChange(newFiles)
  }, [uploadedFiles, onChange]);

  const uploadFileHandle = useCallback(async (files: File[]) => {
    try {
      setIsUploading(true);
      const comingFiles = await Promise.all(files.map(uploadFiles))
      if (comingFiles) {
        const attachedFiles: FileAttachment[] = comingFiles.map(f => ({
          ...f,
          id: f.id,
          Visible: true
        }))
        const newFiles = [...uploadedFiles, ...attachedFiles];
        setUploadedFiles(newFiles);
        onChange(newFiles);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  }, [uploadedFiles, onChange]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      return await uploadFileHandle(filesArray)
    }
  }, [uploadFileHandle]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: uploadFileHandle,
    onDragEnter: () => setDragging(true),
    onDragLeave: () => setDragging(false),
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
      <Button
        startIcon={<FileUploadIcon />}
        variant="contained" component="label" style={{ marginBottom: "2px" }}>
        open...
        <input type="file"
          multiple
          style={{ display: 'none' }}
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
          {visibleFiles.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              onToggleVisibility={toggleFileVisibility}
              onDelete={handleDelete}
            />
          ))}
        </List>
      </Container>
    </div>
  )
}
