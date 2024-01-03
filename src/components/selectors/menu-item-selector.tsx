'use client'
import React from 'react'
import { DataGrid, GridToolbar, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid'
import Link from 'next/link'
import { Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { getShipping, getShippingList, ShippingListElement, ShippingListReturn } from '@/lib/client/shipping-io'


type TablePartProps = {
  modeLink: boolean
  onSelect?: (itemId: number) => void
  //選択中のCategoryID　子も含めて選択中にするなら全ての子のID
  selectedCategoryIds?: number[] | null
}

export const ItemSelectorPanel: React.FC<TablePartProps> = ({
  modeLink,
  onSelect,
}) => {
  const [items, setItems] = useState<ShippingListElement[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const newItemList = await getShippingList()
      setItems(newItemList)
    }
    fetchData()
  }, [])

  const [columnVisibility, setColumnVisibility] = useState<GridColumnVisibilityModel>({
    ShipDate: true,
    ShipFrom: false,
    ShipTo: false,
    Title: true,
    ShippingInvoicePrice: false,
    ShippingInvoiceCurrency: false,
    TradeTerm: false,
    AcquisitionDate: false,
    AcquisitionPrice: false,
    BookValue: false,
    Defrayer: false,
    Comment: false,
    CommentAboutSale: false,
    Gx: false,
    CommentAboutAcquisition: false,
    InvoiceNo: false,
    Carrier: false,
    AwbNo: false,
    ExportPermission: false,
  });

  const columns: GridColDef[] = [

    {
      field: "ShipDate",
      headerName: "発送日",

    },
    {
      field: 'Title',
      headerName: 'Title',
      width: 200,
      renderCell: (params: any) => {
        if (modeLink) {
          return (
            <Link href={`/pages/shipping/${params.row.Id}`}>
              {params.row.Title}
            </Link>
          )
        } else {
          return <div>{params.row.Title}</div>
        }
      },
    },
    {
      field: "ShipFrom",
      headerName: "発送会社",
    },
    {
      field: "ShipTo",
      headerName: "宛先会社",
    },

    {
      field: 'ShippingInvoiceCurrency',
      headerName: 'Invoice価格単位',
    },
    {
      field: 'ShippingInvoicePrice',
      headerName: 'Invoice価格',
    },
    {
      field: 'TradeTerm',
      headerName: '貿易条件',
    },
    {
      field: 'AcquisitionDate',
      headerName: '取得日',
    },
    {
      field: 'AcquisitionPrice',
      headerName: '取得価格',
    },
    {
      field: 'BookValue',
      headerName: '簿価',
    },
    {
      field: 'Gx',
      headerName: 'Gx',
    },
    {
      field: 'CommentAboutAcquisition',
      headerName: '取得に関する備考',
    },
    {
      field: 'InvoiceNo',
      headerName: 'Invoice No',
    },
    {
      field: 'Carrier',
      headerName: '輸送方法',
    },
    {
      field: 'AwbNo',
      headerName: 'AWB No',
    },
    {
      field: 'ExportPermission',
      headerName: '輸出許可',
    },

  ]

  return (
    <Box>
      <div style={{ height: 400, width: '100%' }}>
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
