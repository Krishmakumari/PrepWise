import React from 'react'
import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'

const Page = async () => {
  const user = await getCurrentUser();

  if (!user) return <p className="text-center mt-10">Please sign in to continue.</p>;

  return (
    <>
      <h3>Interview Generation</h3>
      <Agent userName={user.name} userId={user.id} type="generate" />
    </>
  );
};

export default Page;
