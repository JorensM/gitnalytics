"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLink() {
    const pathname = usePathname();

    if(pathname === '/') {
        return <Link href='/dashboard'>Dashboard</Link>
    } else {
        return null;
    }
}