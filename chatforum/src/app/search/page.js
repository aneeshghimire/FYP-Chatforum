"use client";
import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import getcsrftoken from "@/helpers/getcsrftoken";
import { IoSearchSharp } from "react-icons/io5";
import { MagnifyingGlass } from 'react-loader-spinner'
import ThreadCard from "../components/threadcard/Threadcard";

export default function Room() {

    const [threadquery, setThreadQuery] = useState({
        query: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [threads, setThreads] = useState([])
    const [embeddings, setEmbeddings] = useState({})
    const [showModal, setShowModal] = useState(false); // Modal state


    useEffect(() => {

    }, [])


    const handleSubmitThreadQueries = async () => {
        try {
            setThreads([])
            setIsLoading(true)
            const csrftoken = await getcsrftoken()
            const response = await axios.post(`http://localhost:8000/api/getallthreads/`, threadquery, {
                headers: { "X-CSRFToken": csrftoken.value },
                withCredentials: true,
            })
            setThreads(response.data.threads)
            setEmbeddings(response.data.embeddings)
            console.log(response.data)
            console.log(response.data.embeddings)
            console.log(embeddings.oop)
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <Layout>
            <div className="bg-gray-100 p-8 min-h-screen">
                <h2 className="text-center text-4xl font-extrabold text-gray-900 mb-10">
                    Available Rooms
                </h2>

                <div className="mb-10 flex justify-center">
                    <div className="bg-white w-1/2 flex justify-center items-center p-2 rounded-md gap-x-3 shadow-gray-500 shadow-sm">
                        <IoSearchSharp className=" text-xl" />
                        <input name="query" type="search" className="outline-none w-full" placeholder="Search Specific Threads" onChange={(e) => setThreadQuery({ [e.target.name]: e.target.value })} />
                        <button className=" text-gray-600" onClick={handleSubmitThreadQueries}>Search</button>
                    </div>
                </div>

                {Object.keys(embeddings).length > 0 && (
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md shadow-md transition duration-200"
                        onClick={() => setShowModal(true)}
                    >
                        Show Result
                    </button>
                )}

                {isLoading && <MagnifyingGlass />}
                <div className="space-y-4 mt-10">
                    {threads && threads.length > 0 ? (
                        threads.map((thread) => (
                            <div key={thread.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                                <p className="text-sm text-gray-600 font-semibold">
                                    Room: {thread.roomname}
                                </p>
                                <ThreadCard
                                    id={thread.id}
                                    title={thread.title}
                                    description={thread.description}
                                    roomname={thread.roomname}
                                    created_by={thread.created_by['username'] || thread.created_by}
                                    basepath={"/rooms"}
                                />
                                <p className="text-sm text-gray-600 font-semibold">
                                    Similarity Score: {thread.similarity_score.toFixed(2)}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No threads found</p>
                    )}
                </div>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-auto relative">
                            <h3 className="text-xl font-bold mb-4">Top related words and their Embeddings</h3>

                            {/* Close Button */}
                            <button
                                className="absolute top-4 right-4 text-gray-500 text-xl hover:text-gray-700"
                                onClick={() => setShowModal(false)}
                            >
                                ✖
                            </button>

                            {/* Scrollable Word List */}
                            <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
                                {Object.entries(embeddings).map(([word, vector]) => (
                                    <div key={word} className="p-3 border rounded-md shadow-sm bg-gray-50">
                                        <p className="font-semibold text-gray-800">{word}</p>

                                        {/* Scrollable Vector Section */}
                                        <div className="bg-gray-100 p-2 rounded-md max-h-[200px] overflow-auto text-sm text-gray-600">
                                            <pre className="whitespace-pre-wrap break-all">{JSON.stringify(vector, null, 2)}</pre>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </Layout>
    );
}