import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tea Garden Survey.",
  description: "A Digital Portal for Health-Care & Empowering Tea Garden Workers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#8576FF" // Custom color
          initialPosition={0.08} // Start position
          crawlSpeed={200} // Speed of progress bar
          height={4} // Height of the progress bar
          crawl={true} // Enables crawling
          showSpinner={false} // Hides spinner
          speed={200} // Animation speed
          easing="ease"
        />
        {children}
      </body>
    </html>
  );
}
