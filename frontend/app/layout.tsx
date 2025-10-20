import type { Metadata } from "next";
import { PT_Sans } from "next/font/google"; 
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { ServicesProvider } from "@/components/services-provider";

const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simple Quiz Service",
  description:
    "Simple AWS Quiz games to test and improve your knowledge of AWS services and icons.",
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
          <ServicesProvider>
            <Navbar />
            {children}
          </ServicesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
