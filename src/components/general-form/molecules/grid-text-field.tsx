'use client'
import { ControlledTextField } from "./controlled-text-field"

import { Grid } from '@mui/material'
import { Control } from "react-hook-form"
import { SelectableField } from "./selectable-filed"

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
  initialData: string,
  handleFieldChange: (v: any) => void,
  control: Control<any, any>

}

export function GridTextField({ fieldParam, initialData, handleFieldChange, control }: GridTextFieldParams) {
  if (fieldParam.type == "select") {
    return (
      <Grid item xs={fieldParam.gridSize} key={fieldParam.name}>
        <SelectableField
          name={fieldParam.name}
          control={control}
          defaultValue={initialData}
          label={fieldParam.title ? fieldParam.title : fieldParam.name}
          choices={fieldParam.choices ? fieldParam.choices : []}
          onChangeValue={handleFieldChange}
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
          defaultValue={initialData}
          type={fieldParam.type}
          label={fieldParam.title ? fieldParam.title : fieldParam.name}
          fullWidth
          onChangeValue={handleFieldChange}
          rows={fieldParam.rows}

        />
      </Grid>

    );
  }
}
