import MailLink from '@/components/buttons/MailLink';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<>
    <main className='flex flex-col flex-grow'>
        {children}
    </main>
    <footer className='py-8 px-5 border-t border-t-neutral-700 flex items-start gap-8'>
      <div>
        <span className='text-lg'>Contact</span>
        <ul>
          <li><MailLink/></li>
        </ul>
      </div>
      <div>
        <span className='text-lg'>
          About
        </span>
        <ul>
          <a className='text-blue-400' href='/terms'>Privacy Policy</a>
        </ul>
      </div>
    </footer>
  </>
  );
}
