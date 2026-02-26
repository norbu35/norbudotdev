import { NextResponse } from 'next/server';
import crypto from 'crypto';

// In production, this should be in an environment variable
const SERVER_SECRET =
  process.env.AXIOM_SERVER_SECRET || 'development-secret-key-32-bytes';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { operatorId, epochAtEntry = 0, depthOnEntry = 0 } = body;

    if (!operatorId) {
      return NextResponse.json(
        { error: 'operatorId is required' },
        { status: 400 },
      );
    }

    const sessionStart = Date.now();

    // Create JWT-like payload manually to avoid extra dependencies for now
    const payload = JSON.stringify({
      operatorId,
      sessionStart,
      depthOnEntry,
      epochAtEntry,
    });

    const signature = crypto
      .createHmac('sha256', SERVER_SECRET)
      .update(payload)
      .digest('hex');

    const sessionToken = `${Buffer.from(payload).toString('base64')}.${signature}`;

    return NextResponse.json({
      status: 'CONNECTION ESTABLISHED',
      message: 'Signature accepted.',
      token: sessionToken,
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request payload' },
      { status: 400 },
    );
  }
}
