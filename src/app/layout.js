import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BookVise - AI-Powered Book Recommendations',
  description: 'Discover your next great read with AI-powered recommendations tailored to your emotions and goals.',
  keywords: 'books, AI recommendations, reading, book suggestions, personalized books',
  authors: [{ name: 'TweakAI' }],
  creator: 'TweakAI',
  openGraph: {
    title: 'BookVise - Find Your Next Great Read',
    description: 'Discover books that resonate with your emotions and align with your goals through our AI-powered recommendation system',
    url: 'https://tweakai.xyz',
    siteName: 'BookVise',
    images: [
      {
        url: 'public/icon.png',
        width: 1200,
        height: 630,
        alt: 'BookVise - AI-Powered Book Recommendations',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BookVise - Find Your Next Great Read',
    description: 'AI-powered book recommendations tailored to your emotions and goals',
    images: ['public/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}