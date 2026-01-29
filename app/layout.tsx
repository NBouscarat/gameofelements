import type { Metadata } from "next";
import { Itim } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { GlobalStateProvider } from "@/components/appStateContext";

const itim = Itim({
  variable: "--font-itim",
  weight: "400",
});


export const metadata: Metadata = {
  title: "GameOfElements",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Suspense>
      <GlobalStateProvider>
      <body className={itim.className}>
        {children}
      </body>
      </GlobalStateProvider>
      </Suspense>
    </html>
  );
}
