'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ClipboardCopy } from 'lucide-react';

import { toast } from 'react-hot-toast';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { LinkType } from '@prisma/client';

const urlRegex =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9-./]*)?(\?[a-zA-Z0-9&%=._-]+)?$/;
const schema = z.object({
  link: z.string().regex(urlRegex, {
    message: 'Invalid URL format',
  }),
});

export default function CreateLink() {
  const [link, setLink] = useState('');

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      link: '',
    },
  });

  const createLink = async (data: z.infer<typeof schema>) => {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_ENV_BASE_URL}/api/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: LinkType.Link,
          payload: data.link,
        }),
      }
    );

    if (resp.ok) {
      const data = await resp.json();
      if (data.code !== 0) {
        throw new Error(data.message);
      }
      setLink(data.data);
      return data.data;
    }
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    toast.promise(createLink(data), {
      loading: 'Creating your short link...',
      success: 'Success!',
      error: (err: any) => {
        return `Error: ${err.message}`;
      },
    });
  };

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full"
        >
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">
                  Create a short link via sub-domain
                </FormLabel>
                <FormControl>
                  <div className="flex flex-row gap-2">
                    <Input placeholder="https://example.com" {...field} />
                    <Button className="ml-auto" type="submit">
                      Create
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  <FormMessage />
                  {form.formState.errors.link?.message === undefined &&
                    'Enter your URL'}
                </FormDescription>
              </FormItem>
            )}
          />
        </form>
      </Form>
      {link === '' ? null : (
        <div className="flex flex-col gap-2 mt-6">
          <p className="text-sm">Your short link:</p>
          <div className="flex flex-row gap-2">
            <Input value={link} readOnly />
            <Button
              className="pad-2"
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast.success('Copied to clipboard');
              }}
            >
              <ClipboardCopy className="text-xs" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
