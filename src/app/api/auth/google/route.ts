import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

export async function POST(req: NextRequest) {

    const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    )

    // console.log(req.headers.get('Authorization'));
    const tokenId = req.headers.get('Authorization') as string;
    const ticket = await client.verifyIdToken({
        idToken: tokenId.slice(7),
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // console.log(payload);
    if (!payload || payload.aud != process.env.GOOGLE_CLIENT_ID)
        return new NextResponse("Unauthorised", { status: 401 });
    const { email, name } = payload;
    const authToken = jwt.sign({ email, name }, process.env.SECRET);

    res.json({ authToken });
}