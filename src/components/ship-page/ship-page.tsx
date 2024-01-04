"use client"
import ShipContents from "./ship-contents";
import { MenuBar } from "../organisms/menu-bar";
import ShipMenu from "./ship-menu";
import { Button, Link, Divider, Paper, Typography } from "@mui/material";
import { globalConsts } from "@/consts";
import path from "path";
const SHIPPING_PAGE_URL = globalConsts.url.shippingPage
interface ParentComponentProps {
  shipId: string;
}

function ShipPage({ shipId }: ParentComponentProps) {
  return (<div style={{ display: 'flex' }}>
    <MenuBar>
      <Link href={path.join(SHIPPING_PAGE_URL, "new")}>
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