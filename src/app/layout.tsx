import { Providers } from './providers'

import './globals.css'
import { cn } from "@/lib/utils"
import type { Metadata } from 'next'
import DataboxAppBar from '@/components/peculiar-components/layout/databox-appbar'

import { Inter as FontSans } from 'next/font/google'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
export const metadata: Metadata = {
  title: 'Shipping List',

  description: 'Shipping List',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {/* <Providers> */}
        <DataboxAppBar />
        {children}
        {/* </Providers> */}
      </body>
    </html>
  )
}
