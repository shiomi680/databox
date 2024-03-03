"use client"
import React, { useState } from 'react';
import { Button, ButtonProps } from '@mui/material';
import ConfirmDialog from './molecular/confirm-dialog'; // Adjust the import path as necessary

interface ConfirmButtonProps extends Omit<ButtonProps, 'onClick'> {
  onConfirm: () => void;
  title: string;
  description: string;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ onConfirm, title, description, ...buttonProps }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = async () => {
    await onConfirm(); // Assuming onConfirm might be asynchronous
    handleClose(); // Close the dialog after confirming
  };
  return (
    <>
      <Button {...buttonProps} onClick={handleOpen}>
        {buttonProps.children}
      </Button>
      <ConfirmDialog
        open={open}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={title}
        description={description}
      />
    </>
  );
};

export default ConfirmButton;