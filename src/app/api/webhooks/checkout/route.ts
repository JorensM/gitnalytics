import { NextResponse } from 'next/server';

// This webhook is called upon successful checkout of a 
// new user. It should create an account for the new user
// with the credentials based on the provided metadata in the request
// body
export async function POST() {
    console.log('webhook called');

    return new NextResponse();
}