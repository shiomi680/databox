"use client"
import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

type ControlledTextFieldProps = {
  name: string;
  control: any;
  type: string;
  rules?: any,
  label: string;
  fullWidth?: boolean;
  rows?: number;
};

export const ControlledTextField: React.FC<ControlledTextFieldProps> = ({
  name,
  control,
  type,
  rules,
  label,
  fullWidth = false,
  rows,
}) => {
  return (

    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          {...field}
          type={type}
          label={label}
          fullWidth={fullWidth}
          multiline={Boolean(rows && rows > 1)}
          rows={rows}

        />
      )}
    />
  );
};