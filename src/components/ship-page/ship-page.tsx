"use client"
import ShipContents from "./ship-contents";
import { MenuBar } from "../menu/menu-bar";
import ShipMenu from "./ship-menu";
import { Button, Link, Divider, Paper, Typography } from "@mui/material";

interface ParentComponentProps {
  shipId: string;
}

function ShipPage({ shipId }: ParentComponentProps) {
  return (<div style={{ display: 'flex' }}>
    <MenuBar>
      <Link href="/pages/item/new/edit">
        <Button variant="contained" color="primary">
          NEW
        </Button>
      </Link>
      <ShipMenu

      ></ShipMenu>
    </MenuBar>

    <Paper
      elevation={3}
      sx={{
        p: 2,
        width: '100%', // Set width to 100%
        maxWidth: '1200px', // Cap the maximum width (adjust this value as needed)
        mb: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Shipping form
      </Typography>
      <ShipContents shipId={shipId} />
    </Paper>

  </div>)

};



export default ShipPage;