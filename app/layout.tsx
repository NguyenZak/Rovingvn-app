import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google"; // Use Be Vietnam Pro
import "./globals.css";
import { generateMetadata, generateJsonLd, generateViewport } from "@/lib/metadata";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Generate metadata using the new metadata generator
export const metadata: Metadata = generateMetadata();
export const viewport: Viewport = generateViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate JSON-LD structured data for SEO
  const organizationSchema = generateJsonLd("organization");
  const websiteSchema = generateJsonLd("website");

  return (
    <html lang="vi">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${beVietnamPro.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
