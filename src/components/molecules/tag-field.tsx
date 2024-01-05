'use client'
import React from 'react'
import { Autocomplete, Chip, TextField } from '@mui/material'

export type TagsFieldProps = {
  tagOptions: string[]
  initialTags?: string[]
  onTagsChange: (tags: string[]) => void
}

export const TagsField: React.FC<TagsFieldProps> = ({
  tagOptions,
  initialTags = [],
  onTagsChange,
}) => {
  return (
    <Autocomplete
      multiple
      id="tags-filled"
      options={tagOptions}
      onChange={(event, newValue) => onTagsChange(newValue)}
      defaultValue={initialTags}
      freeSolo
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
  )
}

export default TagsField
