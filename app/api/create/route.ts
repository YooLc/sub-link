import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import murmur from 'murmurhash';

const urlRegex =
  /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+([\/?].*)?$/;
const schema = z.object({
  link: z.string().regex(urlRegex, {
    message: 'Invalid URL format',
  }),
});

export async function POST(req: NextRequest) {
  const { link } = await req.json();

  let short_link = '';
  try {
    schema.parse({ link });
    const salt = Date.now();
    const hash = murmur.v3(link, salt).toString(36);
    const domain = `${hash}.` + process.env.NEXT_PUBLIC_ENV_DOMAIN;

    // Create in database
  } catch (error) {
    return NextResponse.json({
      code: -1,
      message: 'Invalid URL format',
      data: error,
    });
  }

  return NextResponse.json({
    code: 0,
    message: 'success',
    data: short_link,
  });
}
