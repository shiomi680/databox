'use client'
import React from 'react'
import { Autocomplete, Chip, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'

export type TagsFieldProps = {
  tagOptions: string[]
  control: any
  name: string
}
export const TagsField: React.FC<TagsFieldProps> = ({
  tagOptions,
  control,
  name
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          multiple
          id="tags-filled"
          options={tagOptions}
          freeSolo
          value={value || []}
          onChange={(event, newValue) => {
            onChange(newValue);
          }}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params: any) => (
            <TextField
              {...params}
              variant="filled"
              label="tags"
              placeholder="Favorites"
            />
          )}
        />
      )}
    />
  )
}


export default TagsField
