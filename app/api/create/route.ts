import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import murmur from 'murmurhash';

import prisma from '@/prisma';
import { LinkType } from '@prisma/client';

const urlRegex =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9-./]*)?(\?[a-zA-Z0-9&%=._-]+)?$/;
const schema = z.object({
  link: z.string().regex(urlRegex, {
    message: 'Invalid URL format',
  }),
});

const maxTextLength = 1024;

async function createLink(type: LinkType, link: string) {
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
      },
    });

    short_link = `${domain}`;
    console.log('Created:', created, short_link);
  } catch (error) {
    return NextResponse.json({
      code: -1,
      message: 'Failed to create short link',
      data: error,
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
