import type { Metadata, Viewport } from "next";
import { Roboto } from 'next/font/google';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/utils/theme";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import '../styles/globals.css'

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ['latin'],
  variable: '--font-roboto',
  });

export const metadata: Metadata = {
  title: "Kleros RPS App",
  description: "Amazing Stuff At Kleros",
  icons: `https://kleros.io/favicon.svg?v=bcd0ce169f2a262c60ec2cbca43166ee`
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.variable}>
      <InitColorSchemeScript attribute="class" />
      <AppRouterCacheProvider>
      <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline />
      {children}
      </ThemeProvider>
      </AppRouterCacheProvider>
      </body>
    </html>
  );
}
