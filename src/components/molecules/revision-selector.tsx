"use client"
import React, { useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { RevisionInfo } from '@/lib/db/revision/revision.model';


interface RevisionSelectorProps {
  revisions: RevisionInfo[];

  onRevisionChange: (revisionId: string) => void;
  initialSelectId?: string;
}

const RevisionSelector: React.FC<RevisionSelectorProps> = ({ revisions, onRevisionChange, initialSelectId }) => {
  const selectedId = initialSelectId || (revisions.length > 0 ? revisions[0].Id : undefined);

  const [selectedRevision, setSelectedRevision] = useState(selectedId);

  const handleRevisionChange = (event: SelectChangeEvent<string>) => {
    const revisionId = event.target.value as string;
    setSelectedRevision(revisionId);
    onRevisionChange(revisionId);
  };
  if (!selectedRevision) {
    return <div></div>;
  }
  return (
    <Select
      value={selectedRevision}
      onChange={handleRevisionChange}
      style={{ marginRight: '10px' }}
    >
      {revisions.map((revision) => (
        <MenuItem key={revision.Id} value={revision.Id} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ marginRight: '30px' }}>{revision.CommitComment}</span>
          <span>{` ${revision.CreateAt}`}</span>
        </MenuItem>
      ))}
    </Select>
  );
};

export default RevisionSelector;
export type { RevisionInfo }