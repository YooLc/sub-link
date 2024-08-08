'use client';

import { Pagination } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ProfileTable() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({
    total: 0,
    links: [],
  });
  const limit = 5;

  const fetchLinks = async (page: number) => {
    const res = await fetch(`/api/list?page=${page}&limit=${limit}`, {
      cache: 'force-cache',
    });
    const json = await res.json();
    setData(json.data);
  };

  useEffect(() => {
    fetchLinks(page);
  }, [page]);

  return (
    <section className="flex flex-col items-center justify-center w-full h-full mt-4 gap-2">
      <div className="w-full h-full overflow-x-auto">
        <Table className="h-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/6">ID</TableHead>
              <TableHead className="w-1/3">Short</TableHead>
              <TableHead className="text-right w-1/2">Payload</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.links.map((link: any) => (
              <TableRow key={link.id}>
                <TableCell className="w-1/6">{link.id}</TableCell>
                <TableCell className="w-1/3">{link.short}</TableCell>
                <TableCell className="max-w-[200px] text-right overflow-hidden whitespace-nowrap overflow-ellipsis">
                  {link.payload}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="w-full flex justify-center mt-4">
        <Pagination
          isCompact
          showControls
          total={Math.ceil(data.total / limit)}
          initialPage={1}
          page={page}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>
    </section>
  );
}
