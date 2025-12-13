// app/api/images/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY in env');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      public_id,
      url,
      prompt,
      tags = null,
      thumb_url = null,
      width = null,
      height = null
    } = body ?? {};

    if (!public_id || !url || !prompt) {
      return NextResponse.json({ error: 'Missing required fields: public_id, url, prompt' }, { status: 400 });
    }

    const insertPayload = {
      public_id,
      url,
      prompt,
      tags,
      thumb_url,
      width,
      height,
    };


    const { data, error } = await supabaseAdmin
      .from('images')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    console.error('Error in /api/images:', err);
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}
