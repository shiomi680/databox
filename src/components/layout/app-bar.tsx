"use client"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/navigation';

export type MenuParams = {
  title: string
  url: string
}

export type ButtonAppBarProperties = {
  title: string
  menuParams: MenuParams[]
}

export default function ButtonAppBar({ title, menuParams }: ButtonAppBarProperties) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const route = useRouter()

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const menuClickGenerate = (url: string) => {
    return () => {
      route.push(url)
      handleClose()

    }
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {menuParams.map(p =>
            (<MenuItem
              onClick={menuClickGenerate(p.url)}
            >
              {p.title}
            </MenuItem>)
            )}
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}