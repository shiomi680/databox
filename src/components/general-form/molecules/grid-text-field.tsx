'use client'
import { ControlledTextField } from "../atoms/controlled-text-field"

import { Grid } from '@mui/material'
import { Control } from "react-hook-form"
import { SelectableField } from "../atoms/selectable-filed"

export enum FieldType {
  date = "date",
  number = "number",
  text = "text",
  select = "select"
}
export type FieldParam = {
  name: string,
  type: string,
  gridSize: number,
  title?: string,
  choices?: string[]
  rows?: number
}
export type GridTextFieldParams = {
  fieldParam: FieldParam,
  control: Control<any, any>

}
export const GridTextField: React.FC<GridTextFieldParams> = (
  { fieldParam, control }) => {
  if (fieldParam.type == "select") {
    return (
      <Grid item xs={fieldParam.gridSize} key={fieldParam.name}>
        <SelectableField
          name={fieldParam.name}
          control={control}
          label={fieldParam.title ? fieldParam.title : fieldParam.name}
          choices={fieldParam.choices ? fieldParam.choices : []}
          fullWidth
        />
      </Grid>
    )
  } else {
    return (
      <Grid item xs={fieldParam.gridSize} key={fieldParam.name}>
        <ControlledTextField
          name={fieldParam.name}
          control={control}
          type={fieldParam.type}
          label={fieldParam.title ? fieldParam.title : fieldParam.name}
          fullWidth
          rows={fieldParam.rows}
        />
      </Grid>

    );
  }
}
