import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kính Lily - Kính Mắt Chính Hãng, Kính Râm, Kính Trẻ Em",
  description: "Chuyên cung cấp kính mắt chính hãng, kính râm cao cấp, kính trẻ em với chất lượng đảm bảo. Miễn phí đo mắt, đổi trả 30 ngày, giao hàng toàn quốc.",
  keywords: "kính mắt, kính râm, kính cận, kính trẻ em, kính thời trang, rayban, oakley, gucci, tom ford",
  openGraph: {
    title: "Kính Lily - Kính Mắt Chính Hãng",
    description: "Chuyên cung cấp kính mắt chính hãng với chất lượng đảm bảo",
    type: "website",
    locale: "vi_VN",
    siteName: "Kính Lily",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} antialiased font-sans`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
