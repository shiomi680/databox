"use client"
import React, { useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';

type Revision = {
  id: number;
  comment: string;
  createdAt: string;
}

interface RevisionSelectorProps {
  revisions: Revision[];

  onRevisionChange: (revisionId: number) => void;
  initialSelectId?: number;
}

const RevisionSelector: React.FC<RevisionSelectorProps> = ({ revisions, onRevisionChange, initialSelectId }) => {
  const selectedId = initialSelectId || (revisions.length > 0 ? revisions[0].id : null);

  const [selectedRevision, setSelectedRevision] = useState(selectedId);

  const handleRevisionChange = (event: SelectChangeEvent<number>) => {
    const revisionId = event.target.value as number;
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
        <MenuItem key={revision.id} value={revision.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ marginRight: '30px' }}>{revision.comment}</span>
          <span>{` ${revision.createdAt}`}</span>
        </MenuItem>
      ))}
    </Select>
  );
};

export default RevisionSelector;
export type { Revision }