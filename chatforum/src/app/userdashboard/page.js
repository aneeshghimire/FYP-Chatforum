"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaSignOutAlt, FaClipboardList } from "react-icons/fa";
import getcsrftoken from "@/helpers/getcsrftoken";
import Navbar from "../components/navbar/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter()
  const [profileUrl, setProfileUrl] = useState("");
  const [profileDetails, setProfileDetails] = useState({});

  useEffect(() => {
    getUserProfile();
  }, []);

  const handlelogout = async () => {
    const response = await axios.get('/api/logout');
    console.log(response)
    if (response.data.status == "successful") {
      router.push('/')
    }
  }

  const getUserProfile = async () => {
    const csrftoken = await getcsrftoken();
    const response = await axios.get(
      "http://localhost:8000/api/getprofiledata/",
      {
        headers: {
          "X-CSRFToken": csrftoken.value,
        },
        withCredentials: true,
      }
    );
    setProfileUrl(response.data.profile.profile_picture_url);
    setProfileDetails(response.data.user);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gradient-to-b from-indigo-600 to-purple-600 text-white p-6 flex flex-col ">
        <div className="text-center mb-12 flex gap-x-3 items-center">
          <img src="/logo/logo.png" className=" w-14 h-14" alt="" />
          <h1 className="text-xl md:text-2xl font-bold">ChatForum</h1>
        </div>
        <nav>
          <ul className="flex flex-col gap-y-4">
            <li>
              <Link
                className="flex items-center text-base md:text-lg font-semibold hover:text-black hover:scale-105 transition"
                href={"/rooms"}
              >
                <FaClipboardList className="mr-3" /> Rooms
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center text-base md:text-lg font-semibold hover:text-black hover:scale-105 transition"
                href={"/JoinedThreads"}
              >
                <FaUsers className="mr-3" /> Joined Threads
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <button className="flex items-center text-base md:text-lg font-semibold hover:text-red-300 transition" onClick={handlelogout}>
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 md:p-8 rounded-3xl shadow-md mb-8">
          <div className="flex items-center space-x-4 md:space-x-6">
            <img
              src={profileUrl}
              className="rounded-full shadow-gray-600 shadow-lg w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40"
              alt="Profile"
            />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">
                {profileDetails.username}
              </h2>
              <p className="text-gray-500">
                Welcome back! Here’s your activity overview.
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="px-4 py-2 md:px-6 md:py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition">
              View Latest Notifications
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-2xl shadow-lg text-center text-white">
            <h3 className="text-3xl md:text-4xl font-bold">94</h3>
            <p className="mt-2 text-sm md:text-base">Threads Joined</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-2xl shadow-lg text-center text-white">
            <h3 className="text-3xl md:text-4xl font-bold">512</h3>
            <p className="mt-2 text-sm md:text-base">Contributions</p>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 rounded-2xl shadow-lg text-center text-white">
            <h3 className="text-3xl md:text-4xl font-bold">N/A</h3>
            <p className="mt-2 text-sm md:text-base">Achievements</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            Recent Activity
          </h2>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md">
            <p className="text-gray-600 text-sm md:text-base">
              You have no recent activities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
