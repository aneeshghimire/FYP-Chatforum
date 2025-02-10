"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import getcsrftoken from "@/helpers/getcsrftoken";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Discuss } from 'react-loader-spinner'
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

export default function Userform() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });
  const [isLoading, setIsLoading] = useState(false)

  // const handleChange = (e) => {
  //   setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  // };

  const onSubmit = async (data) => {

    try {
      setIsLoading(true)
      let csrftoken = await getcsrftoken()
      const response = await axios.post(
        "http://localhost:8000/api/register/",
        data
      );
      if (response.data.message == 'Email Already Exists') {
        setIsLoading(false)
        console.log("Email exists")
        toast.error("User with given email already exists", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
      }
      if (response.data.message == 'Username Already Exists') {
        setIsLoading(false)
        console.log("Username exists")
        toast.error("Username already exists. Select another one", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
      }
      if (response.data.status == "successful") {
        setIsLoading(false)
        console.log("Has entered successfull phase")
        router.push("/login");
      }

      // console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 overflow-hidden py-10">
      {/* Background Oval Design */}
      <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] bg-gradient-to-r from-purple-700 to-blue-700 rounded-full opacity-30 transform rotate-45 z-0"></div>
      <div className="absolute -top-40 -right-20 w-[700px] h-[700px] bg-gradient-to-r from-blue-700 to-purple-700 rounded-full opacity-30 transform rotate-45 z-0"></div>
      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">

        {isLoading && <Discuss color="purple" />}
        <div className="flex justify-center mb-6">
          <img
            src="/logo/logo.png"
            alt="ChatForum Logo"
            className=" w-20 h-20"
          />
        </div>
        <h2 className="text-4xl font-extrabold mb-2 text-center text-purple-700">
          Join ChatForum
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Connect, Share, and Engage with the Community!
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium">Username</label>
            <input
              type="text"
              {...register("username")}
              // onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              // onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              {...register("password")}
              // onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 text-white p-3 rounded-lg shadow-md hover:bg-purple-800 transition-colors duration-300"
          >
            Sign Up
          </button>
          <ToastContainer />
        </form>
        <div className="mt-6 text-center text-gray-600">
          Already have an account? {" "}
          <Link href="/login" className="text-purple-700 hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
