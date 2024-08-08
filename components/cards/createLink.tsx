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

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      link: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const response = await fetch(
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
      if (response.ok) {
        console.log('Link created');
      }
    } catch (error) {
      console.error('Failed to create link', error);
    }
  };

  return (
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
  );
}
