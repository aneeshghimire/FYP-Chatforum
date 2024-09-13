"use client"
import Layout from '@/app/components/layout/Layout';
import React, { useEffect, useState } from 'react';
import ThreadCard from '@/app/components/threadcard/Threadcard';
import axios from 'axios';
import getcsrftoken from '@/helpers/getcsrftoken';

export default function RoomPage({params}) {
  // Example data for threads
//   const threads = [
//     {
//       id: 1,
//       title: 'How do you handle errors in Go?',
//       description: 'Discuss various methods for error handling in Go.',
//     },
//     {
//       id: 2,
//       title: 'What are the benefits of using Go over other languages?',
//       description: 'Explore why Go might be chosen over other programming languages.',
//     },
//     {
//       id: 3,
//       title: 'How to implement concurrency in Go?',
//       description: 'Learn about goroutines and channels for concurrency in Go.',
//     },
//   ];

const [threads,setThreads]= useState([])

useEffect(()=>{
    getThreads()
},[])

const getThreads= async()=>{
const csrftoken= await getcsrftoken();
try{
const response = await axios.get(`http://localhost:8000/api/${params.name}/getthreads/`,
    {
        headers: {
          "X-CSRFToken": csrftoken.value,
        },
        withCredentials: true,
      }
)
console.log(response)
if(response.data.status=="successful"){
    setThreads(response.data.threads)
}
}catch(err){
console.log(err.message)
}
}

  return (
    <Layout>
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">GoLang Threads</h2>
        <div className="space-y-4">
          {threads.map(thread => (
            <ThreadCard key={thread.id} id={thread.id} title={thread.title} description={thread.description}  />
          ))}
        </div>
      </div>
    </Layout>
    
  );
}
