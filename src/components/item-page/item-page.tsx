"use client"
import ItemContents from "./item-contents";
import { MenuBar } from "../organisms/menu-bar";
import ItemMenu from "./item-menu";
import { Button, Link, Paper, Typography } from "@mui/material";
import { globalConsts } from "@/consts";
import path from "path";

const ITEM_PAGE_URL = globalConsts.url.itemPage

interface ParentComponentProps {
  itemId: string;
}

function ItemPage({ itemId }: ParentComponentProps) {
  return (
    <div style={{ display: 'flex' }}>
      <MenuBar>
        <Link href={path.join(ITEM_PAGE_URL, "new")}>
          <Button variant="contained" color="primary">
            NEW
          </Button>
        </Link>
        <ItemMenu />
      </MenuBar>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          width: '100%',
          maxWidth: '1200px',
          mb: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Item form
        </Typography>
        <ItemContents itemId={itemId} />
      </Paper>
    </div>
  );
};

export default ItemPage;