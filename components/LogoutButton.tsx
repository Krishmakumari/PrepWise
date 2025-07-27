"use client";

import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <Button 
      onClick={handleLogout}
      className="w-full bg-red-600 hover:bg-red-700 px-4 py-3 font-bold text-white rounded-lg"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;