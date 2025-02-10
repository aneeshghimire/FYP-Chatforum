"use client"
import React from 'react'
import Layout from '../components/layout/Layout'
import getcsrftoken from '@/helpers/getcsrftoken'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ThreeDots } from 'react-loader-spinner'
import { FaTrash } from 'react-icons/fa'


export default function page() {
    const [isLoading, setIsLoading] = useState(false)
    const [threads, setThreads] = useState([])
    const [totalThreads, setTotalThreads] = useState(0)

    useEffect(() => {
        getThreads()
    }, [])

    const getThreads = async () => {
        const csrftoken = await getcsrftoken()
        try {
            setIsLoading(true)
            const response = await axios.get('http://localhost:8000/api/getadminthreads', {
                headers: {
                    "X-CSRFToken": csrftoken.value,
                },
                withCredentials: true,
            });
            if (response.data.status == 'successful') {
                console.log(response.data.threads)
                setThreads(response.data.threads);
                setTotalThreads(response.data.threads.length);
            }
            else {
                setThreads([])
                setTotalThreads(0)
            }
        } catch (err) {
            console.log(err.message)
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <Layout>
            <div className="min-h-screen p-4 md:p-8">
                {/* Heading Section */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    Total Threads : {totalThreads}
                </h1>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    {isLoading && <ThreeDots height="80" width="80" color="#4fa94d" radius="9" ariaLabel="three-dots-loading" />}
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left text-gray-800">Thread ID</th>
                                <th className="px-4 py-2 text-left text-gray-800">Thread Room</th>
                                <th className="px-4 py-2 text-left text-gray-800">Title</th>
                                <th className="px-4 py-2 text-left text-gray-800">Created By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {threads.map((thread, index) => (
                                <tr
                                    key={thread.id}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                                >
                                    <td className="border px-4 mx-3 py-2 ">{thread.id}</td>
                                    <td className="border px-4 mx-3 py-2 ">{thread.room.name}</td>
                                    <td className="border px-4 mx-3 py-2 ">{thread.title}</td>
                                    <td className="border px-4 mx-3 py-2 ">{thread.created_by.username}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    )
}
