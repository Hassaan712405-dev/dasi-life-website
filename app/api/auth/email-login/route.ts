import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailSchema } from '@/lib/validators/auth';

// Admin client to bypass RLS and OTP for "instant" mode
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = emailSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_EMAIL', message: 'Invalid email format.' } },
        { status: 400 }
      );
    }

    const email = result.data.email;

    // Generate magic link via Admin API (Instant Login)
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    if (error) {
      console.error('Email login error:', error);
      return NextResponse.json(
        { ok: false, error: { code: 'AUTH_ERROR', message: 'Could not authenticate.' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      token_hash: data.properties.hashed_token,
      email,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: { code: 'SERVER_ERROR', message: 'Internal server error.' } },
      { status: 500 }
    );
  }
}