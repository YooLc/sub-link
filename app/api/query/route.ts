import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/prisma';

const urlRegex =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9-./]*)?$/;
const schema = z.object({
  link: z.string().regex(urlRegex, {
    message: 'Invalid URL format',
  }),
});

export async function GET(req: NextRequest) {
  // Delete expired links
  await prisma.link.deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });

  const link = req.nextUrl.searchParams.get('link');

  try {
    schema.parse({ link });
    const record = await prisma.link.findUnique({
      where: {
        short: link || '',
      },
    });

    let target = record?.payload;
    if (
      target &&
      !(target.startsWith('http:') || target.startsWith('https:'))
    ) {
      target = `https://${target}`;
    }
    return NextResponse.redirect(
      target || process.env.NEXT_PUBLIC_ENV_BASE_URL || '',
      {
        status: 302,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        code: -1,
        message: 'Failed to query short link',
        data: error.message,
      },
      {
        status: 404,
      }
    );
  }
}
