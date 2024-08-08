import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import murmur from 'murmurhash';

import prisma from '@/prisma';
import { LinkType } from '@prisma/client';

import { auth } from '@/auth';

const urlRegex =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9-./]*)?(\?[a-zA-Z0-9&%=._-]+)?$/;
const schema = z.object({
  link: z.string().regex(urlRegex, {
    message: 'Invalid URL format',
  }),
});

const maxTextLength = 1024;
const maxCreateCount = 32;
const maxTotalCount = 1024;

async function createLink(type: LinkType, link: string) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({
      code: -1,
      message: 'Please login',
      data: null,
    });
  }

  // Delete expired links
  await prisma.link.deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });

  const total_count = await prisma.link.count();
  if (total_count >= maxTotalCount) {
    return NextResponse.json({
      code: -1,
      message: `Database full, only allow ${maxTotalCount} active links`,
      data: null,
    });
  }

  const create_count = await prisma.link.count({
    where: {
      creator: session.user.email,
    },
  });
  if (create_count >= maxCreateCount) {
    return NextResponse.json({
      code: -1,
      message: `You can only create ${maxCreateCount} active links`,
      data: null,
    });
  }

  let short_link = '';

  try {
    if (type === 'Link') {
      schema.parse({ link });
    } else if (link.length > maxTextLength) {
      // This branch infers type === 'Text'
      throw new Error(`Text exceeds maximum length of ${maxTextLength}`);
    }
    const salt = Date.now();
    const hash = murmur.v3(link, salt).toString(16);
    const domain = `${hash}.` + process.env.NEXT_PUBLIC_ENV_DOMAIN;

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(now.getDate() + 30);

    // Create in database
    const created = await prisma.link.create({
      data: {
        short: domain,
        type: type,
        payload: link,
        expiresAt: expiresAt,
        creator: session.user.email,
      },
    });

    short_link = `${domain}`;
    console.log('Created:', created, short_link);
  } catch (error: any) {
    return NextResponse.json({
      code: -1,
      message: `Failed to create short link: ${error.message}`,
      data: null,
    });
  }

  return NextResponse.json({
    code: 0,
    message: 'success',
    data: short_link,
  });
}

interface CreateRequest {
  type: LinkType;
  payload: string;
}

export async function POST(req: NextRequest) {
  const { type, payload } = (await req.json()) as CreateRequest;
  if (type === 'Link' || type === 'Text') {
    return createLink(type, payload);
  } else {
    return NextResponse.json({
      code: -1,
      message: 'Invalid link type',
    });
  }
}
