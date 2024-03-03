"use client"
import React from 'react';
import ConfirmButton from "./confirm-button/confirm-button"
interface DeleteButtonProps {
  onConfirm: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onConfirm }) => {
  return (
    <ConfirmButton
      variant="contained"
      color="warning"
      onConfirm={onConfirm}
      title="Confirm Delete"
      description="Are you sure you want to delete this item?"
    >
      DELETE
    </ConfirmButton>
  );
};

export default DeleteButton;

