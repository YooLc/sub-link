import { NextRequest, NextResponse, userAgent } from 'next/server';
import { useParams } from 'next/navigation';
import prisma from '@/prisma';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  const session = await auth();
  const page = Number(req.nextUrl.searchParams.get('page')) || 1;
  const limit = Number(req.nextUrl.searchParams.get('limit')) || 10;

  if (!session?.user?.email) {
    return NextResponse.json(
      {
        code: -1,
        message: 'Unauthorized',
        data: 'You need to login to view your profile.',
      },
      {
        status: 403,
      }
    );
  }

  try {
    const total = await prisma.link.count({
      where: {
        creator: session.user.id,
      },
    });

    const links = await prisma.link.findMany({
      where: {
        creator: session.user.id,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        id: 'desc',
      },
    });

    return NextResponse.json({
      code: 0,
      message: 'Success',
      data: {
        total: total,
        links: links,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        code: -1,
        message: 'Failed to query short links',
        data: error.message,
      },
      {
        status: 502,
      }
    );
  }
}
