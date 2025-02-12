import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-signin-client_id" content="961657177961-62qmq2ojrg0quor18spps69iktv2pvp9.apps.googleusercontent.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}
      >
        <header className='flex p-4 h-[80px]'>
          <h1>Gitnalytics</h1>
        </header>
        <main className='flex flex-col flex-grow'>

          {children}
        </main>
      </body>
    </html>
  );
}
