"use client"
import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/style/theme'
// import { ApolloProvider } from '@apollo/client';
// import { client } from '@/graphql/gqlclient';
interface Props {
  children: React.ReactNode
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
export default Providers
