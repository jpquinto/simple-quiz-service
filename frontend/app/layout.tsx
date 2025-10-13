import type { Metadata } from "next";
import { PT_Sans } from "next/font/google"; 
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AWS Quiz Game",
  description:
    "Test your knowledge of AWS services with this fun and interactive quiz game!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ptSans.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
