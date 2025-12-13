// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    // read CLOUDINARY_URL or individual env vars
    // CLOUDINARY_URL looks like: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    if (!cloudinaryUrl) {
      return NextResponse.json({ error: 'CLOUDINARY_URL not set' }, { status: 500 });
    }

    // extract api_key, api_secret, cloud_name from CLOUDINARY_URL
    // safe parsing assuming format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
    const m = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (!m) {
      return NextResponse.json({ error: 'Invalid CLOUDINARY_URL format' }, { status: 500 });
    }
    const apiKey = m[1];
    const apiSecret = m[2];
    const cloudName = m[3];

    // generate timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    // For a simple signed upload we sign only timestamp (you can include other params if needed)
    const signatureBase = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureBase).digest('hex');

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName
    });
  } catch (err) {
    console.error('Error in upload signature route', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
