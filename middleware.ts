import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

const base_domain = process.env.NEXT_PUBLIC_ENV_DOMAIN ?? 'localhost:3000';

export function routeSubdomain(req: NextRequest) {
  const host = req.headers.get('host');

  if (host !== base_domain) {
    return NextResponse.redirect(
      `https://${base_domain}/api/query?link=${host}`
    );
  }

  return NextResponse.next();
}

const middlewares = [routeSubdomain, auth];

export function middleware(request: NextRequest) {
  for (const middleware of middlewares) {
    const response = middleware(request);
    if (response !== NextResponse.next()) {
      return response;
    }
  }

  return NextResponse.next();
}
