'use client'
/**
 * MenuBar コンポーネント
 *
 * MUI (Material-UI) ライブラリを使用してサイドメニューバーをレンダリングするNext.jsのコンポーネントです。
 *
 * 特徴:
 * - MUIのstyled-componentsアプローチを使用してスタイリングしています。
 * - "/pages/item/new/edit" ルートへのナビゲーションを許可するボタンが含まれています。
 * - ドロワーを開閉するためのアイコンボタンがあります。
 * - ドロワーの幅は、オープン状態と画面のブレークポイントに基づいて調整されます。
 * - 子コンポーネントや要素の注入をサポートしており、コンテンツの柔軟性があります。
 *
 * Props:
 * - children: トグルボタンの下にレンダリングされるReactのノード。
 *
 * 依存関係:
 * - MUI (UIコンポーネントとスタイリングのため)
 * - Next.js (ルーティングとLinkコンポーネントのため)
 * - React (状態管理とライフサイクルのため)
 **/

import { styled, createTheme } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Button } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',

    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}))
export function MenuBar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(true)
  const toggleDrawer = () => {
    setOpen(!open)
  }
  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <Link href="/pages/item/new/edit">
          <Button variant="contained" color="primary">
            NEW
          </Button>
        </Link>
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      {children}
    </Drawer>
  )
}
