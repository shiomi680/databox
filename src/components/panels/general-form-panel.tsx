'use client'
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FieldParam, GridTextField } from '../atom/gridTextField';
// MUI imports
import { Container, Grid } from '@mui/material'


type GeneralFormProps = {
  initialData: any,
  fieldParams: FieldParam[]
  onChange: (data: any) => void,

}

export type { FieldParam }

export function GeneralForm({ initialData, fieldParams, onChange }: GeneralFormProps) {
  const { control, watch } = useForm<any>({
    defaultValues: initialData
  });

  const handleFieldChange = (v: any) => {
    const data = watch()
    onChange(data);
  };

  return (
    <Container maxWidth="sm">
      <form >
        <Grid container spacing={3}>
          {fieldParams.map((field: FieldParam) => (
            <GridTextField
              key={field.name}
              fieldParam={field}
              control={control}
              handleFieldChange={handleFieldChange}
              initialData={initialData[field.name]}
            />
          ))}
        </Grid>
      </form >
    </Container >
  );
}