import React, { ReactNode } from 'react'
import { isAuthenticated, getCurrentUser } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import UserDropdown from '@/components/UserDropdown'

const RootLayout = async({children}:{children:ReactNode}) => {
  const isUserAuthenticated= await isAuthenticated();

  if(!isUserAuthenticated) redirect('/sign-in');
  
  const user = await getCurrentUser();
  
  return (
    <div className='root-layout'>
      <nav className='flex justify-between items-center'>
        <Link href='/' className='flex items-center gap-2'>
        <Image src='/logo.svg' alt="logo" width={38} height={32}/>
        <h2 className='text-primary-100'>PrepWise</h2> 
      </Link>
      <UserDropdown userName={user?.name || 'User'} />
      </nav>
      {children}
    </div>
  )
}

export default RootLayout