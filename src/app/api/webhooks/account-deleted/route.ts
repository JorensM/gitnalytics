import { afterDeleteAccount } from '@/util/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { old_record: _user } = await req.json();

    const user = {
        ..._user,
        user_metadata: _user.raw_user_metadata
    }

    const deleted = await afterDeleteAccount(user);

    return new NextResponse(null, {
        status: deleted ? 200 : 500
    });
}