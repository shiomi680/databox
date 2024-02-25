"use client"
import React, { useEffect, useState } from 'react'; // Import useEffect
import { Select, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { RevisionInfo } from '@/lib/db/revision/revision.model';

interface RevisionSelectorProps {
  revisions: RevisionInfo[];
  onRevisionChange: (revisionId: string) => void;
  initialSelectId?: string;
}

const RevisionSelector: React.FC<RevisionSelectorProps> = ({ revisions, onRevisionChange, initialSelectId }) => {
  const [selectedRevision, setSelectedRevision] = useState<string | undefined>(initialSelectId || (revisions.length > 0 ? revisions[0].Id : undefined));

  // Update the selectedRevision state whenever the initialSelectId changes
  useEffect(() => {
    setSelectedRevision(initialSelectId || (revisions.length > 0 ? revisions[0].Id : undefined));
  }, [initialSelectId, revisions]);

  const handleRevisionChange = (event: SelectChangeEvent<string>) => {
    const revisionId = event.target.value;
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