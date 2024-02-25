import { Providers } from './providers'

// import './globals.css'

import type { Metadata } from 'next'
import DataboxAppBar from '@/components/layout/databox-appbar'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <DataboxAppBar />
          {children}</Providers>
      </body>
    </html>
  )
}
