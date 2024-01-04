import { Providers } from './providers'

// import './globals.css'

import type { Metadata } from 'next'
import ButtonAppBar from '@/components/layout/app-bar'

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
          <ButtonAppBar />
          {children}</Providers>
      </body>
    </html>
  )
}
