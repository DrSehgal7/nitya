import "@fontsource-variable/manrope";
import "@fontsource/instrument-serif";
import "@fontsource/instrument-serif/400-italic.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/data/site";
import "./globals.css";

const themeScript = `
  (function () {
    try {
      var saved = localStorage.getItem('nitya-theme');
      var theme = saved === 'dark' || saved === 'light'
        ? saved
        : 'dark';
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (_) {
      document.documentElement.dataset.theme = 'dark';
    }
  })();
`;

export const metadata: Metadata = {
  metadataBase: new URL(`${site.siteUrl}/`),
  title: {
    default: "Nitya — a small daily mission",
    template: "%s — Nitya",
  },
  description:
    "Hritik Saroch's self-funded public project to help 100 people in practical, measurable ways.",
  openGraph: {
    type: "website",
    siteName: "Nitya",
    title: "Nitya — a small daily mission",
    description: "A self-funded public project to help 100 people in practical, measurable ways.",
    images: [
      {
        url: `${site.siteUrl}/social-card.png`,
        width: 1200,
        height: 630,
        alt: "Nitya — small things, done daily",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nitya — a small daily mission",
    description: "A self-funded public project to help 100 people in practical, measurable ways.",
    images: [`${site.siteUrl}/social-card.png`],
  },
  icons: { icon: `${site.siteUrl}/favicon.svg` },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f2eb" },
    { media: "(prefers-color-scheme: dark)", color: "#101418" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skipLink" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
