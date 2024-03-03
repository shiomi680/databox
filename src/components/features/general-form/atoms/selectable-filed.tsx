"use client"
import * as React from 'react';
import { Controller } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

type SelectableFieldProps = {
  name: string,
  label: string,
  control: any,
  choices: string[],
  fullWidth?: boolean;
}

export const SelectableField: React.FC<SelectableFieldProps> = (
  { name, label, control, choices, fullWidth }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth={fullWidth}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            label={label}
          >
            {choices.map((c, index) => (
              <MenuItem key={index} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
}