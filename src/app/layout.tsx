import '@/styles/globals.css'
import { AnalyticsWrapper } from '@/components/analytics'
import { ThemeProvider } from '@/components/themeProvider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Verbalizy',
    template: '%s | Verbalizy',
  },
  description: 'A simple way to train your GPT-3 model',
  twitter: {
    title: 'Verbalizy',
    card: 'summary_large_image',
  },
  icons: {
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Verbalizy',
    siteName: 'Verbalizy',
    description: 'A simple way to train your GPT-3 model',
    url: 'https://verbalizy.vercel.app/',
    type: 'website',
    locale: 'pt-BR',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang='en'
      className={inter.className}
    >
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
        >
          {children}
        </ThemeProvider>
        <AnalyticsWrapper />
      </body>
    </html>
  )
}
