'use client'
import { ControlledTextField } from "../atom/controlled-text-field"

import { Grid } from '@mui/material'
import { Control } from "react-hook-form"


export type FieldParam = {
  name: string,
  type: string,
  gridSize: number
}
export type GridTextFieldParams = {
  fieldParam: FieldParam,
  initialData: string,
  handleFieldChange: (v: any) => void,
  control: Control<any, any>

}

export function GridTextField({ fieldParam, initialData, handleFieldChange, control }: GridTextFieldParams) {

  return (
    <Grid item xs={fieldParam.gridSize} key={fieldParam.name}>
      <ControlledTextField
        name={fieldParam.name}
        control={control}
        defaultValue={initialData}
        type={fieldParam.type}
        label={fieldParam.name}
        fullWidth
        onChangeValue={handleFieldChange}
      />
    </Grid>

  );
}
