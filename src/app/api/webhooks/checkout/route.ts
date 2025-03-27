import { NextResponse } from 'next/server';

export async function POST() {
    console.log('webhook called');

    return new NextResponse();
}