"use client";

import { useState } from "react";
import Image from "next/image";
import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  userName: string;
}

const UserDropdown = ({ userName }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div className="relative">
      <div 
        className="flex items-center gap-2 text-light-100 text-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        Hi! {userName}
        <Image 
          src="/profile.svg" 
          alt="user profile" 
          width={32} 
          height={32} 
          className="rounded-full"
        />
      </div>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-dark-200 border border-gray-600 rounded-lg shadow-lg z-10">
          <button
            onClick={() => {
              router.push("/profile");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-light-100 hover:bg-dark-300 rounded-t-lg"
          >
            My Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-light-100 hover:bg-dark-300 rounded-b-lg"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;