import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '科普漫步 - 智能科普服务平台',
  description: '展览路街道"四层一体"智能科普服务体系',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
