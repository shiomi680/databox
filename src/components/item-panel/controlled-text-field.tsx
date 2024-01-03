"use client"
import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

type ControlledTextFieldProps = {
  name: string,
  control: any,
  defaultValue: any,
  type: string,
  label: string,
  onChangeValue: (value: string | number) => void,
}

export const ControlledTextField: React.FC<ControlledTextFieldProps> = ({ name, control, defaultValue, type, label, onChangeValue }) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    render={({ field }) => <TextField {...field} type={type} label={label} onChange={(e => {
      field.onChange(e)
      onChangeValue(e.target.value)
    })} />}
  />
);

