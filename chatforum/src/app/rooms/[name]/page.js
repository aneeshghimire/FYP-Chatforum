"use client"
import React, { useEffect, useState } from 'react'
import ThreadCard from '@/app/components/threadcard/Threadcard'
import getcsrftoken from '@/helpers/getcsrftoken'
import axios from 'axios'
import Layout from '@/app/components/layout/Layout'


export default function RoomPage({ params }) {
    const [threads, setThreads] = useState([])


    useEffect(() => {
        getThreads()
    }, [])


    const getThreads = async () => {
        const csrftoken = await getcsrftoken()
        try {
            const response = await axios.get(`http://localhost:8000/api/${params.name}/getthreads`,
                {
                    headers: {
                        "X-CSRFToken": csrftoken.value,
                    },
                    withCredentials: true,
                });
            if (response.data.status == "successfull") {
                console.log(response.data)
                setThreads(response.data.threads)
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    return (
        <Layout>
            <div className="flex-1 p-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">{params.name} Threads</h2>
                <div className="space-y-4">
                    {threads.map(thread => (
                        <ThreadCard key={thread.id} thread={thread} />
                    ))}
                </div>
            </div>
        </Layout>

    )

}
