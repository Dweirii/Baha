import type React from "react"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Privacy Policy | Al-Baha store",
  description: "Privacy Policy for Al-Baha store",
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen w-full bg-white`}>
        <main className="min-h-screen w-full flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
