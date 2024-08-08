import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'lucide-react';
import CreateLink from '@/components/cards/createLink';

export default function Home() {
  return (
    <div className="flex flex-col h-full items-center">
      <section className="flex flex-row items-center px-7 w-full h-16 gap-x-2 bg-gray-800">
        <Link color="white" />
        <p className="font-bold text-white text-xl">Sublink</p>
        <Button className="ml-auto">Log in</Button>
      </section>
      <section className="flex flex-col py-7 items-center w-full h-full">
        <Tabs defaultValue="create" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my">My</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>
          <TabsContent value="my">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="create" className="py-7">
            <CreateLink />
          </TabsContent>
          <TabsContent value="manage">Manage your account here. </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
