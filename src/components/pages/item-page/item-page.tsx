"use client"
import ItemContents from "./item-contents";
import { MenuBar } from "../../layout/menu-bar";
import ItemMenu from "./item-menu";
import { Button, Grid, Link, Paper, Typography, Box } from "@mui/material";
import { globalConsts } from "@/consts";
import { deleteItemAction } from "@/lib/data-handle/item/item-action";
import path from "path";
import DeleteButton from "@/components/features/delete-button"
import { useRouter } from 'next/navigation';
const ITEM_PAGE_URL = globalConsts.url.itemPage

interface ParentComponentProps {
  itemId: string;
  revisionId?: string;
  copy?: boolean;
}

function ItemPage({ itemId, revisionId, copy = false }: ParentComponentProps) {
  const router = useRouter()
  const deleteButtonHandler = async () => {
    await deleteItemAction(itemId)
    router.push(path.join(ITEM_PAGE_URL, "new"))
  }

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
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item>
              <Link href={path.join(ITEM_PAGE_URL, "copy", itemId)} >
                <Button variant="contained" color="primary" >
                  COPY
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <DeleteButton onConfirm={deleteButtonHandler} />
            </Grid>
          </Grid>

        )}
        <ItemContents itemId={itemId != "new" ? itemId : undefined} revisionId={revisionId} copy={copy} />
      </Paper>
    </div >
  );
};

export default ItemPage;