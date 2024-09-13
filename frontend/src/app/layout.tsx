import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Flex } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Secure Share",
  description: "Share sensitive data securely with strict access controls.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Flex direction="column" minHeight="100vh" bg="purple.50">
            <Navbar />
            {children}
            <Footer />
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
