"use client"
import ItemContents from "./item-contents";
import { MenuBar } from "../../layout/menu-bar";
import ItemMenu from "./item-menu";
import { Button, Link, Paper, Typography } from "@mui/material";
import { globalConsts } from "@/consts";
import path from "path";

const ITEM_PAGE_URL = globalConsts.url.itemPage

interface ParentComponentProps {
  itemId: string;
  revisionId?: string;
  copy?: boolean;
}

function ItemPage({ itemId, revisionId, copy = false }: ParentComponentProps) {
  return (
    <div style={{ display: 'flex' }}>
      <MenuBar>

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
        {itemId !== "new" && (
          <Link href={path.join(ITEM_PAGE_URL, "copy", itemId)} >
            <div style={{ marginBottom: '20px' }} >
              <Button variant="contained" color="primary" >
                COPY
              </Button>
            </div>
          </Link>
        )}

        <ItemContents itemId={itemId} revisionId={revisionId} copy={copy} />
      </Paper>
    </div>
  );
};

export default ItemPage;