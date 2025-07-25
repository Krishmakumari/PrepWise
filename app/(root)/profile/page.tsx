import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import InterviewCard from "@/components/InterviewCard";
import LogoutButton from "@/components/LogoutButton";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";

const ProfilePage = async () => {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/");
  }

  const userInterviews = await getInterviewsByUserId(user.id);
  const hasInterviews = userInterviews && userInterviews.length > 0;

  return (
    <div className="flex min-h-screen gap-8 text-light-100 py-8">
      {/* Left Side - Profile */}
      <div className="flex flex-col gap-6 w-1/4 ml-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        
        <div className="bg-dark-200 rounded-lg p-6 border border-gray-600">
          <div className="flex flex-col items-center gap-4 mb-6">
            <Image 
              src="/profile.svg" 
              alt="user profile" 
              width={80} 
              height={80} 
              className="rounded-full"
            />
            <h2 className="text-2xl font-semibold text-center">{user.name}</h2>
            <p className="text-gray-400 text-center">{user.email}</p>
          </div>
          
          <div className="border-t border-gray-500 my-4"></div>
          
          <div className="space-y-4">
            <Link href="/interview" className="text-gray-400 text-center underline hover:text-gray-300 block">
              Create Your Interview
            </Link>
            
            <ChangePasswordDialog 
              trigger={
                <button className="text-gray-400 text-center underline hover:text-gray-300 block w-full">
                  Change Your Password
                </button>
              }
            />
            
            <Button asChild className="w-full bg-dark-200 hover:text-dark-500 hover:bg-light-200 p-4 font-bold text-light-200 rounded-lg border-2 border-light-200">
              <Link href="/">Back to Dashboard</Link>
            </Button>
            
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Right Side - Interviews */}
      <div className="flex flex-col gap-6 flex-1">
        <h2 className="text-3xl font-bold">Your Interviews</h2>
        
        {hasInterviews ? (
          <div className="space-y-4">
            {userInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            You haven't taken any interviews yet
          </p>
        )}
      </div>

    </div>
  );
};

export default ProfilePage;