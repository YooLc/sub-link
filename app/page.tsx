import { useTheme } from 'next-themes';
import { Link } from 'lucide-react';

import CreateLink from '@/components/cards/createLink';
import ProfileCard from '@/components/cards/profile/profile';
import { LoginButton, LogoutButton } from '@/components/loginButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col h-full items-center">
      <section className="flex flex-row items-center justify-center px-7 w-full h-16 gap-x-2 bg-gray-800">
        <Link color="white" />
        <p className="font-bold text-white text-xl">Sublink</p>
        <div className="text-white ml-auto">
          {session ? (
            <div className="flex flex-row items-center gap-2 pad-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={session.user?.image || ''} />
                <AvatarFallback>{session.user?.name}</AvatarFallback>
              </Avatar>
              <p className="text-md font-bold">
                {session.user?.name || session.user?.email}
              </p>
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </section>
      <section className="flex flex-col py-7 items-center w-full h-full">
        <Tabs
          defaultValue="create"
          className="w-full h-full flex flex-col items-center"
        >
          <TabsList className="grid w-full grid-cols-3 w-[400px]">
            <TabsTrigger value="my">My</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>
          <TabsContent value="my" className="w-full h-full py-7">
            <ProfileCard />
          </TabsContent>
          <TabsContent value="create" className="w-full h-full py-7">
            <CreateLink />
          </TabsContent>
          <TabsContent value="manage" className="w-full h-full py-7">
            Manage your account here.{' '}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
