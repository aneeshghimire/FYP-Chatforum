"use client";
import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import getcsrftoken from "@/helpers/getcsrftoken";
import Link from "next/link";
import Roomcard from "../components/roomcard/Roomcard";
import { ToastContainer, toast } from "react-toastify";

export default function Room() {

    const [searchQuery, setSearchQuery] = useState('');
    const [rooms, setRooms] = useState([]);



    useEffect(() => {
        getAvailableRooms();
    }, [])

    // Filter rooms based on search query
    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const getAvailableRooms = async () => {
        const csrftoken = await getcsrftoken();
        try {
            const response = await axios.get(
                "http://localhost:8000/api/getavailablerooms/",
                {
                    headers: {
                        "X-CSRFToken": csrftoken.value, // Include the CSRF token in the request headers
                    },
                    withCredentials: true,
                }
            );
            console.log(response)
            if (response.data.status == "successful") {
                console.log(response.data.rooms)
                setRooms(response.data.rooms)
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <Layout>
            <div className="bg-gray-100 p-8 min-h-screen">
                <h2 className="text-center text-4xl font-extrabold text-gray-900 mb-10">
                    Available Rooms
                </h2>

                <div className="mb-10 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        className="w-full max-w-lg p-3 rounded-lg shadow-md border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-8" >
                    {filteredRooms.length > 0 ? (
                        filteredRooms.map((room) => (

                            <Roomcard key={room.id} name={room.name} description={room.description} />


                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">
                            No rooms found.
                        </p>
                    )}
                </div>
            </div>
        </Layout>
    );
}