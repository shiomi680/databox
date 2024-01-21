'use client'
import React from 'react'
import { DataGrid, GridToolbar, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid'
import Link from 'next/link'
import { Box } from '@mui/material'
import { useState, useEffect } from 'react'


type ColumnsDef = {
  field: string,
  headerName: string,
  link?: (formData: any) => string
}


type TablePartProps = {
  modeLink: boolean
  items: any[]
  idName: String

  defaultGridColumnVisibility: GridColumnVisibilityModel
  gridColumnsDef: ColumnsDef[]
  //選択中のCategoryID　子も含めて選択中にするなら全ての子のID
  selectedCategoryIds?: number[] | null
  onSelect?: (itemId: number) => void
}

export const ItemSelectorPanel: React.FC<TablePartProps> = ({
  modeLink,
  items,
  idName,
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
              {params.row[columnsDef.field]}
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
            onSelect ? onSelect(params.row[idName as keyof any]) : ''
          }
          getRowId={(row) => row[idName as keyof any]}
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
