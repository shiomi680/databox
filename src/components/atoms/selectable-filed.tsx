"use client"
import * as React from 'react';
import { Controller } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { SelectChangeEvent } from '@mui/material/Select';

type SelectableFieldProps = {
  name: string,
  label: string,
  control: any, // Add control prop for react-hook-form
  defaultValue: string,
  choices: string[],
  onChangeValue: (value: string) => void,
  fullWidth?: boolean;
}

export const SelectableField: React.FC<SelectableFieldProps> = ({ name, label, control, defaultValue, choices, onChangeValue, fullWidth }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormControl fullWidth={fullWidth}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            label={label}
            onChange={(event: SelectChangeEvent) => {
              field.onChange(event)
              onChangeValue(event.target.value)
            }}
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