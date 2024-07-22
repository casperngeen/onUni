'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./store.provider";
import "@styles";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathName = usePathname();
  
  useEffect(() => {
    const checkAccessToken = () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken && pathName !== '/login') {
        router.push(`/login`);
      }
    };

    const interval = setInterval(checkAccessToken, 1000); // Check every second (adjust as needed)


    return () => clearInterval(interval);
  })

  return (
    <StoreProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </StoreProvider>
  );
}
