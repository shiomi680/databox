'use client'
// External library imports
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {  FileModel } from '@prisma/client'

// Local imports
import {
  uploadFiles,
  getFileListbyItemId,
  deleteFile,
} from '@/lib/database-io-file'
// MUI imports
import {
  Button,
  List,
  ListItem,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export function FileUploadComponent({ itemId }: { itemId: string }) {
  const [uploadedFiles, setUploadedFiles] = useState<FileModel[]>([])
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [hoveredFile, setHoveredFile] = useState<number | null>(null)

  // Handler for file change (uploading)
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      console.log("tedset")
      setIsUploading(true)
      const filesArray = Array.from(event.target.files)
      const itemIdNum = parseInt(itemId, 10)

      const uploaded:FileModel[] = await uploadFiles(itemIdNum, filesArray)
      console.log(uploaded)
      setUploadedFiles([...uploadedFiles, ...uploaded])
      setIsUploading(false)
    }
  }
  // Effect to fetch already uploaded files when component mounts
  useEffect(() => {
    const fetchFiles = async () => {
      const files = await getFileListbyItemId(parseInt(itemId))
      setUploadedFiles(files)
    }
    fetchFiles()
  }, [itemId])

  // Handler for deleting a file
  const handleDelete = async (fileId: number) => {
    const result = await deleteFile(fileId, Number(itemId))
    if (!('error' in result)) {
      const newFiles = uploadedFiles.filter((file) => file.FileId !== fileId)
      setUploadedFiles(newFiles)
      // TODO: Handle post-delete actions like refreshing the file list.
    }
  }
  const [dragging, setDragging] = useState<boolean>(false)

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }

  // Handle Drag Leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
  }

  // Handle Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)

    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files)
      const itemIdNum = parseInt(itemId, 10)
      setIsUploading(true)
      const upload = async () => {
        const uploaded = await uploadFiles(itemIdNum, filesArray)
        setUploadedFiles([...uploadedFiles, ...uploaded])
        setIsUploading(false)
      }
      upload()
    }
  }

  return (
    <Container>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          padding: '20px',
          border: '2px dashed #cccccc',
          backgroundColor: dragging ? '#f0f0f0' : 'transparent',
          cursor: 'pointer',
        }}
      >
        <Button variant="contained" component="label">
          Upload File
          <input type="file" multiple hidden onChange={handleFileChange} />
        </Button>
        <div>Drag & Drop files</div>
        {isUploading && (
          <div style={{ marginTop: 20 }}>
            <CircularProgress />
            <Typography style={{ marginLeft: 10 }}>Uploading...</Typography>
          </div>
        )}
        <List style={{ marginTop: 20 }}>
          {uploadedFiles.map((file) => (
            <ListItem
              key={file.FileId}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor:
                  hoveredFile === file.FileId ? '#f9f9f9' : 'transparent',
              }}
              onMouseEnter={() => setHoveredFile(file.FileId)}
              onMouseLeave={() => setHoveredFile(null)}
            >
              <a
                href={file.FilePath||""}
                download
                style={{ flex: 1, display: 'flex', alignItems: 'center' }}
                onClick={(e) => {
                  e.preventDefault() // Prevent default behavior
                  if(file.FilePath){
                  window.location.href = file.FilePath // Manually redirecting to the file path to start the download
                  }
                }}
              >
                <Typography variant="body1" style={{ marginRight: 10 }}>
                  <span role="img" aria-label="file">
                    📄
                  </span>{' '}
                  {file.FileName}
                </Typography>
              </a>
              <Button
                startIcon={<DeleteIcon />}
                variant="outlined"
                color="secondary"
                onClick={() => handleDelete(file.FileId)}
              >
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
      </div>
    </Container>
  )
}
