import React from "react";
import Link from "next/link";
export default function Navbar() {
  return (
    <div>
      <nav className="bg-purple-700 p-4 flex justify-between items-center shadow-lg">
        <Link href={'/'}>
          <div className="flex items-center space-x-4">
            <img
              src="/logo/logo.png"
              alt="ChatForum Logo"
              className="w-12 h-12"
            />
            <span className="text-xl font-bold">ChatForum</span>
          </div>
        </Link>
        <div className="space-x-6">
          <Link
            href="/rooms"
            className="hover:text-gray-300 transition duration-200"
          >
            Rooms
          </Link>
          <Link
            href="/threads"
            className="hover:text-gray-300 transition duration-200"
          >
            Joined Threads
          </Link>
          <Link
            href="/logout"
            className="hover:text-gray-300 transition duration-200"
          >
            Logout
          </Link>
        </div>
      </nav>
    </div>
  );
}
