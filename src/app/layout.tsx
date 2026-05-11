import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ToasterProvider } from '@/components/providers/toaster-provider'
import { Navbar } from '@/components/dashboard/navbar'
import { getCurrentUser } from '@/lib/auth'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "TBML AML Dashboard",
  description: "Trade-Based Money Laundering detection and compliance dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Navbar user={user} />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <ToasterProvider />
      </body>
    </html>
  )
}