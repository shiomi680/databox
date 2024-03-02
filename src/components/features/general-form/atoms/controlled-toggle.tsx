"use client"
import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, FormControlLabel, Switch } from '@mui/material';

type ControlledTextFieldProps = {
  name: string;
  control: any;
  label: string;
};

export const ControlledToggle: React.FC<ControlledTextFieldProps> = ({
  name,
  control,
  label,
}) => {
  return (

    <Controller
      name={name}
      control={control}

      render={({ field }) => (
        <FormControlLabel control={
          <Switch {...field}
            checked={field.value}
          />
        }
          label={label}
        />
      )}
    />
  );
};