import type { Metadata } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';

export const metadata: Metadata = {
  title: 'StadiumMind AI — FIFA World Cup 2026',
  description:
    'The AI Operating System for FIFA World Cup 2026. AI-powered stadium operations, fan experience, and accessibility — powered by Google Gemini.',
  keywords: [
    'FIFA World Cup 2026',
    'AI Stadium',
    'Smart Stadium',
    'Google Gemini',
    'StadiumMind',
  ],
  authors: [{ name: 'StadiumMind AI Team' }],
  openGraph: {
    title: 'StadiumMind AI — FIFA World Cup 2026',
    description:
      'The AI Operating System for FIFA World Cup 2026.',
    type: 'website',
  },
};

import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
      </head>
      <body className="antialiased">
        <AccessibilityProvider>
          {/* Accessibility: Skip to content */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          {/* Screen reader live region for dynamic announcements */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            id="a11y-announcer"
          />

          <main id="main-content">{children}</main>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
