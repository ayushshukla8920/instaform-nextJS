import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Reacts from 'react';

const Page = async() => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if(!token){
    redirect('/login');
  }
  return (
    <div className='bg-black text-white text-3xl font-semibold w-full min-h-screen'>
      This website is under Maintenance 
    </div>
  )
}

export default Page
