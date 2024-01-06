"use client"
import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

type ControlledTextFieldProps = {
  name: string;
  control: any;
  defaultValue: any;
  type: string;
  label: string;
  onChangeValue: (value: string | number) => void;
  fullWidth?: boolean;
  rows?: number;
};

export const ControlledTextField: React.FC<ControlledTextFieldProps> = ({
  name,
  control,
  defaultValue,
  type,
  label,
  onChangeValue,
  fullWidth = false,
  rows,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value, ref } }) => (
        <TextField
          value={value}
          type={type}
          label={label}
          fullWidth={fullWidth}
          multiline={Boolean(rows && rows > 1)}
          rows={rows}
          inputRef={ref}
          onChange={(e) => {
            onChange(e); // Call the method from react-hook-form
            onChangeValue(e.target.value); // Call the custom method
          }}
        />
      )}
    />
  );
};