import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer';
import Header from './components/Header';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "Kilala Eye - Tròng Kính Cận, Lens Chính Hãng, Kính Râm",
  description: "Chuyên cung cấp tròng kính cận, lens cao cấp, kính râm chính hãng. Đo mắt miễn phí, bảo hành 12 tháng, đổi trả 30 ngày.",
  keywords: "tròng kính, lens, kính cận, kính râm, đo mắt, lens đổi màu, lens cao cấp, kilala, miaxin, hoya",
  openGraph: {
    title: "Kilala Eye - Tròng Kính Chính Hãng",
    description: "Chuyên cung cấp tròng kính cận, lens cao cấp với chất lượng đảm bảo",
    type: "website",
    locale: "vi_VN",
    siteName: "Kilala Eye",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import AuthProvider from "./components/AuthProvider";
import { CartProvider } from "./context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} antialiased font-sans`}>
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
