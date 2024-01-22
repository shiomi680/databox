import { Controller } from 'react-hook-form';
import { FileUploadComponent } from './file-panel';

type FileControlComponentProps = {
  name?: string,
  control: any
}

// Your form component
export const FileControlComponent: React.FC<FileControlComponentProps> = ({
  name = "files",
  control
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FileUploadComponent
          initialFiles={value}
          onChange={onChange}
        />
      )}
    />

  );
}