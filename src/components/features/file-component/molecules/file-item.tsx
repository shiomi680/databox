import React, { useCallback } from 'react';
import { FileAttachment } from '@/lib/db/file/file.model';
import { Button, ListItem, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

type FileItemProps = {
  file: FileAttachment,
  onToggleVisibility: (id: string) => void,
  onDelete: (id: string) => void,
}

const listItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #f0f0f0',
};

const linkStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
};

export const FileItem: React.FC<FileItemProps> = ({ file, onToggleVisibility, onDelete }) => {
  const handleToggleVisibility = useCallback(() => {
    onToggleVisibility(file.Id);
  }, [file.Id, onToggleVisibility]);

  const handleDelete = useCallback(() => {
    onDelete(file.Id);
  }, [file.Id, onDelete]);

  return (
    <ListItem key={file.Id} style={listItemStyle}>
      <IconButton onClick={handleToggleVisibility}>
        {file.Visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </IconButton>
      <a href={file.Url} download style={linkStyle}>
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
        onClick={handleDelete}>
        Delete
      </Button>
    </ListItem>
  );
};

export default FileItem;