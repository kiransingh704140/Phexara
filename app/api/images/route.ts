// app/api/images/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Default to Page 1, Limit 20
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Calculate range for Supabase
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabaseAdmin
      .from('images')
      .select('*', { count: 'exact' }) // Get total count too
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
        data, 
        metadata: {
            page,
            limit,
            total: count,
            hasMore: count ? end < count - 1 : false
        }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST remains the same...
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { public_id, url, prompt, tags = null, width = null, height = null } = body ?? {};

    if (!public_id || !url || !prompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('images')
      .insert({ public_id, url, prompt, tags, width, height })
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}