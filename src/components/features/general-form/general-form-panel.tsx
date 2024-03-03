'use client'
import React, { useEffect } from 'react';
import { useForm, Control } from 'react-hook-form';
import { FieldParam, GridTextField } from "./molecules/grid-text-field"
// MUI imports
import { Container, Grid } from '@mui/material'


type GeneralFormProps = {
  fieldParams: FieldParam[]
  control: Control<any, any>

}

export type { FieldParam }

export const GeneralForm: React.FC<GeneralFormProps> = (
  { fieldParams, control }) => {
  return (
    <Grid container spacing={3}>
      {fieldParams.map((field: FieldParam) => (
        <GridTextField
          key={field.name}
          fieldParam={field}
          control={control}
        />
      ))}
    </Grid>
  );
}