// app/api/images/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

// GET: Fetch single image
export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    if (!id || !isUUID(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const { data, error } = await supabaseAdmin
        .from('images')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
}

// PUT: Update details
export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    if (!id || !isUUID(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    try {
        const body = await req.json();
        const { prompt, tags } = body;

        const { data, error } = await supabaseAdmin
            .from('images')
            .update({ prompt, tags })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ message: 'Updated successfully', data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Remove image
export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    if (!id || !isUUID(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    try {
        const { error } = await supabaseAdmin
            .from('images')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}