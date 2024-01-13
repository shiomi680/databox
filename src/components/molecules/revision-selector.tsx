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
}

const RevisionSelector: React.FC<RevisionSelectorProps> = ({ revisions, onRevisionChange }) => {
  const [selectedRevision, setSelectedRevision] = useState(revisions[revisions.length - 1].id);

  const handleRevisionChange = (event: SelectChangeEvent<number>) => {
    const revisionId = event.target.value as number;
    setSelectedRevision(revisionId);
    onRevisionChange(revisionId);
  };

  return (
    <Select


      value={selectedRevision}
      onChange={handleRevisionChange}
      style={{ marginRight: '10px' }}
    >
      {revisions.map((revision) => (
        <MenuItem key={revision.id} value={revision.id}>
          {`${revision.comment} (Created at: ${revision.createdAt})`}
        </MenuItem>
      ))}
    </Select>
  );
};

export default RevisionSelector;
export type { Revision }