'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import Layout from '../components/layout/Layout';
import { IoIosCreate } from 'react-icons/io';
import getcsrftoken from '@/helpers/getcsrftoken';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Separate schemas for username and password validation
const usernameSchema = z.object({
    username: z.string().min(5, "Username must be atleast 5 characters").max(100, "Username is too long"),
});

const passwordSchema = z.object({
    oldpassword: z.string().min(6, "Old password must be at least 6 characters"),
    newpassword: z.string().min(6, "New password must be at least 6 characters"),
});

export default function page() {
    const router = useRouter();
    const [profileUrl, setProfileUrl] = useState("");
    const [profileDetails, setProfileDetails] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editPasswordPopup, setEditPasswordPopup] = useState(false);
    const [editUsernamePopup, setEditUsernamePopup] = useState(false);

    // Separate form handling for username and password
    const usernameForm = useForm({
        resolver: zodResolver(usernameSchema),
    });

    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
    });

    useEffect(() => {
        getUserProfile();
    }, []);

    const handleEditUsername = () => {
        setEditUsernamePopup(true);
    };

    const handleChangePassword = () => {
        setEditPasswordPopup(true);
    };

    const onUsernameSubmit = async (data) => {
        if (!data.username || data.username === profileDetails.username) {
            toast.error("Username is same as previous username", {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const csrftoken = await getcsrftoken();

            const response = await axios.post("http://localhost:8000/api/updateInfo/", {
                type: "username",
                username: data.username,
            }, {
                headers: { "X-CSRFToken": csrftoken.value },
                withCredentials: true,
            });

            if (response.data.status === 'successful') {
                toast.success("Username changed successfully", {
                    position: "top-right",
                    autoClose: 3000,
                });
                getUserProfile(); // Refresh profile after successful update
                setEditUsernamePopup(false); // Close the popup
                usernameForm.reset(); // Reset the form
            } else {
                toast.error(response.data.message || "Failed to update username", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error('Error updating username:', error);
            toast.error("An error occurred while updating the username", {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const onPasswordSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const csrftoken = await getcsrftoken();

            const response = await axios.post("http://localhost:8000/api/updateInfo/", {
                type: "password",
                data
            }, {
                headers: { "X-CSRFToken": csrftoken.value },
                withCredentials: true,
            });

            if (response.data.status === 'successful') {
                toast.success("Password changed successfully. Redirecting to login...", {
                    position: "top-right",
                    autoClose: 3000,
                });

                // Short delay before logout to show the success message
                setTimeout(async () => {
                    await axios.get("/api/logout", { withCredentials: true });
                    router.push('/login');
                }, 3000);
            } else {
                toast.error("Old password doesn't match", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error("An error occurred while updating the password", {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getUserProfile = async () => {
        try {
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

            setProfileUrl(response.data.profile?.profile_picture_url);
            setProfileDetails(response.data.user);
        } catch (error) {
            console.error('Error fetching profile data:', error);
            toast.error("Failed to load profile data", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    return (
        <Layout>
            <div className="min-h-screen flex flex-col">
                <div className="p-4 md:p-8">
                    <div className="flex flex-col items-center bg-white p-6 md:p-8 rounded-3xl shadow-md mb-8">
                        <div className="relative">
                            <img
                                src={profileUrl ? profileUrl : '/noprofileimage/npc.png'}
                                className="rounded-full shadow-gray-600 shadow-lg w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
                                alt="Profile"
                            />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize mt-4">
                            {profileDetails.username}
                        </h2>
                        <Link href="/uploadprofilepicture" className="text-blue-600 p-3">
                            Choose another profile
                        </Link>
                    </div>

                    <div className="mt-8 space-y-2">
                        <div className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center mx-auto max-w-md">
                            <label className="text-gray-800 text-lg font-semibold">
                                Username
                            </label>
                            <div className="flex items-center">
                                <span className="ml-4 text-gray-600">
                                    {profileDetails.username}
                                </span>
                                <button
                                    className="ml-2 text-indigo-600 flex items-center"
                                    onClick={handleEditUsername}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center mx-auto max-w-md">
                            <span className="text-gray-800 text-lg font-semibold">Password</span>
                            <button
                                className="text-indigo-600 flex items-center"
                                onClick={handleChangePassword}
                            >
                                Change your password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {editPasswordPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-11/12 max-w-lg">
                        <h3 className="text-xl font-semibold mb-6 text-center">Change Password</h3>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-gray-800 text-lg font-semibold mb-2">Old Password</label>
                                <input
                                    {...passwordForm.register("oldpassword")}
                                    type="password"
                                    placeholder="Enter your current password"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                                {passwordForm.formState.errors.oldpassword && (
                                    <span className='text-red-500'>{passwordForm.formState.errors.oldpassword.message}</span>
                                )}

                                <label className="block text-gray-800 text-lg font-semibold mt-4 mb-2">New Password</label>
                                <input
                                    {...passwordForm.register("newpassword")}
                                    type="password"
                                    placeholder="Enter your new password"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                                {passwordForm.formState.errors.newpassword && (
                                    <span className='text-red-500'>{passwordForm.formState.errors.newpassword.message}</span>
                                )}
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                    onClick={() => {
                                        setEditPasswordPopup(false);
                                        passwordForm.reset();
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className={`px-6 py-3 bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-800 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editUsernamePopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-11/12 max-w-lg">
                        <h3 className="text-xl font-semibold mb-6 text-center">Edit Username</h3>
                        <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-gray-800 text-lg font-semibold mb-2">Username</label>
                                <input
                                    {...usernameForm.register("username")}
                                    type="text"
                                    defaultValue={profileDetails.username}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                                {usernameForm.formState.errors.username && (
                                    <span className='text-red-500'>{usernameForm.formState.errors.username.message}</span>
                                )}
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                    onClick={() => {
                                        setEditUsernamePopup(false);
                                        usernameForm.reset();
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className={`px-6 py-3 bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-800 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <ToastContainer />
        </Layout>
    );
}