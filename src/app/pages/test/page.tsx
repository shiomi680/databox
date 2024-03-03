'use client'
import React, { useState, useEffect } from 'react'
// MUI imports
import { Container, TextField, Button, Grid } from '@mui/material'


export default function Page({ params }: { params: { shipId: string } }) {



  return (
    <Container maxWidth="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          // handle form submission logic here if necessary
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Item Name"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Model Number"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Item Description"
              multiline
              rows={4}

            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Cost"
              type="number"
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Sale Price"
              type="number"
              required
            />
          </Grid>

        </Grid>
      </form>
    </Container >
  )
}

