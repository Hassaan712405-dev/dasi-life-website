import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ⚠️ Service Role Key zaroori hai (Sirf server-side use karein)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Admin API se Magic Link generate karein
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: normalizedEmail,
    });

    if (error) {
      console.error('Email login error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Token hash return karein (Client isay verify karke login hoga)
    return NextResponse.json({
      token_hash: data.properties.hashed_token,
      email: normalizedEmail,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}