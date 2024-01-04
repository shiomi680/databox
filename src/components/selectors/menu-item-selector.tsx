'use client'
import React from 'react'
import { DataGrid, GridToolbar, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid'
import Link from 'next/link'
import { Box } from '@mui/material'
import { useState, useEffect } from 'react'

type TablePartProps = {
  modeLink: boolean
  items: any[]

  defaultGridColumnVisibility: GridColumnVisibilityModel
  gridColumnsDef: any[]
  //選択中のCategoryID　子も含めて選択中にするなら全ての子のID
  selectedCategoryIds?: number[] | null
  onSelect?: (itemId: number) => void
}

export const ItemSelectorPanel: React.FC<TablePartProps> = ({
  modeLink,
  items,
  defaultGridColumnVisibility,
  gridColumnsDef,
  selectedCategoryIds,
  onSelect,
}) => {

  const [columnVisibility, setColumnVisibility] = useState<GridColumnVisibilityModel>(defaultGridColumnVisibility);
  const columns: GridColDef[] = gridColumnsDef.map(
    columnsDef => {
      const { link, ...rest } = columnsDef
      if (link && modeLink) {
        return {
          ...rest,
          renderCell: (params: any) => (
            <Link href={link(params.row)} >
              {params.row.Title}
            </Link >
          )
        }
      }
      else {
        return {
          ...rest,
        }
      }
    }
  )
  return (
    <Box>
      <div style={{ height: 1000, width: '100%' }}>
        <DataGrid
          columnVisibilityModel={columnVisibility}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibility(newModel)
          }
          rows={items}
          columns={columns}
          onRowClick={(params: any) =>
            onSelect ? onSelect(params.row.Id) : ''
          }
          getRowId={(row) => row.Id}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </div>
    </Box>
  )
}
