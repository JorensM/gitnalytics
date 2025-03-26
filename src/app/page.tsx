import { createClient } from '@/util/supabase/server';
import { revalidatePath } from 'next/cache';
import Image from "next/image";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';


export default async function Home() {

  // redirect('/login');

  return (
    <div>
      Hi :)
    </div>
  );
}
