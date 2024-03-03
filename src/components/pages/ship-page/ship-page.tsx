"use client"
import ShipContents from "./ship-contents";
import { MenuBar } from "../../layout/menu-bar";
import ShipMenu from "./ship-menu";
import { Button, Link, Divider, Paper, Typography } from "@mui/material";
import { globalConsts } from "@/consts";
import path from "path";

const SHIP_PAGE_URL = globalConsts.url.shippingPage
interface ParentComponentProps {
  shipId: string;
  revisionId?: string;
  copy?: boolean;
}

const ShipPage: React.FC<ParentComponentProps> = ({ shipId, revisionId, copy = false }) => {
  return (<div style={{ display: 'flex' }}>
    <MenuBar>
      <ShipMenu></ShipMenu>
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
      {shipId !== "new" && (
        <Link href={path.join(SHIP_PAGE_URL, "copy", shipId)} >
          <div style={{ marginBottom: '20px' }} >
            <Button variant="contained" color="primary" >
              COPY
            </Button>
          </div>
        </Link>
      )}
      <ShipContents shipId={shipId != "new" ? shipId : undefined} revisionId={revisionId} copy={copy} />
    </Paper>

  </div>)

};



export default ShipPage;