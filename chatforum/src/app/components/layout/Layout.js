import React from 'react'
import Navbar from '../navbar/Navbar'
import axios from 'axios';
import Router, { useRouter } from 'next/navigation';

export default function Layout({children}) {
  const router= useRouter()
  const handlelogout = async () => {
    const response = await axios.get("/api/logout");
    console.log(response);
    if (response.data.status == "successful") {
      router.push("/");
    }
  };
  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-gray-100'>
        <Navbar handlelogout={handlelogout}/>
        <main className=" flex-1">{children}</main>
    </div>
  )
}
