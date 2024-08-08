import { auth } from '@/auth';
import ProfileTable from './profileTable';

export default async function ProfileCard() {
  const session = await auth();

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="mt-7 text-lg font-bold">
          You need to login to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full px-10">
      <section className="flex flex-col items-center justify-center w-full">
        <p className="text-xl font-bold">{session.user.name}</p>
        <p className="text-md">{session.user.email}</p>
      </section>
      <ProfileTable />
    </div>
  );
}
