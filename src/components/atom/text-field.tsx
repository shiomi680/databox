import { TextField, Grid } from '@mui/material'

type TextFieldComponentProps = {
  label: string
  initValue: string | undefined
  dataType: string
  onChange: (name: string, value: any) => void
}

export const TextFieldComponent: React.FC<TextFieldComponentProps> = ({
  label,
  initValue,
  dataType,
  onChange,
}) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatValue(event.target.value, dataType)
    onChange(label, value)
  }

  return (
    <Grid item xs={12}>
      <TextField
        fullWidth
        variant="outlined"
        label={label}
        value={initValue}
        type={dataType}
        onChange={handleChange}
        required
      />
    </Grid>
  )
}

function formatValue(value: string, dataType: string) {
  if (dataType == "number") {
    return new Number(value)
  } else if (dataType == "date") {
    return new Number(value)
  }
  else {
    return value
  }
}
