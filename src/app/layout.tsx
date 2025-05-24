import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./style.css";
import SignOutButton from '@/components/buttons/SignOutButton';
import { createClient } from '@/util/supabase/server';
import AuthButtons from '@/components/layout/header/AuthButtons';
import DashboardLink from '@/components/layout/header/DashboardLink';
import Link from 'next/link';
import { getSubscriptionStatus, getSubscriptionStatusMessage } from '@/util/stripe';
import Script from 'next/script';
import MailLink from '@/components/buttons/MailLink';
import { cookies } from 'next/headers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gitnalytics",
  description: "Analytics for your commits",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const loggedIn = !!user;

  const subscriptionStatus = loggedIn ? await getSubscriptionStatus() : undefined;

  const collectData = false;//(await cookies()).get('disable-stats')?.value !== 'true';

  return (
    <html lang="en">
      <head>
        <meta name="google-signin-client_id" content="961657177961-62qmq2ojrg0quor18spps69iktv2pvp9.apps.googleusercontent.com" />
        <meta name="google-site-verification" content="RqhEfADoIZofqXSGw9vHoh2AIaq45u-2iHEdhhV8ns8" />
        {/* Google Tag (Google Analytics) */}
        {collectData ? 
          <>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-GXM4YEPGPR"></script>
            <Script
              id='g-tag'
            >
              {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              
              gtag('js', new Date());

              gtag('config', 'G-GXM4YEPGPR', { 'cookie_flags': 'SameSite=None; Secure' });`}
            </Script>
          </>
        : null}
        
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col h-screen`}
      >
        <header className='flex py-4 px-5 border-b border-neutral-800 items-center leading-none justify-between'>
          <div>
            <h1 className='text-xl'><Link href='/'>Gitnalytics</Link></h1>
            {subscriptionStatus?.isCancelled ?
              <span className='text-sm text-orange-500'>{await getSubscriptionStatusMessage()}</span>
            : null}
          </div>
          <div className='w-fit flex gap-4 items-center'>
            {loggedIn ? <SignOutButton /> : null}
            {!loggedIn ? 
              <AuthButtons/>
            : <DashboardLink/>}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
