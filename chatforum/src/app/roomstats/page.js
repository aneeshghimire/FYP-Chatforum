"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout/Layout";
import { FaEye, FaTrash, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import getcsrftoken from "@/helpers/getcsrftoken";




export default function RoomStats() {
    const [rooms, setRooms] = useState([]);
    const [totalRooms, setTotalRooms] = useState(0);
    const [refreshKey, setrefreshKey] = useState(0)
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const router = useRouter()
    const [roomDetails, setroomDetails] = useState({
        name: "",
        description: ""
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setroomDetails((currval) => ({
            ...currval,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchRooms();
    }, [refreshKey]);


    const fetchRooms = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/getavailablerooms");
            setRooms(response.data.rooms);
            setTotalRooms(response.data.rooms.length);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const handleDelete = async (roomname) => {
        const csrftoken = await getcsrftoken()
        try {

            const response = await axios.get(`http://localhost:8000/api/deleterooms/${roomname}`,
                {
                    headers: { "X-CSRFToken": csrftoken.value },
                    withCredentials: true
                });
            if (response.data.status == "delete_successfull") {
                console.log("Data Deleted")
                // alert("Deleted Successfully")
                if (response.data.rooms.length === 0) {
                    setTotalRooms(0)
                    setRooms([]);
                } else {
                    setRooms(response.data.threads);
                }
                setrefreshKey((currentvalue) => currentvalue + 1)

            }

        } catch (err) {
            console.log(err.message)
        }
    }

    const handleRoomAdd = async () => {
        const csrftoken = await getcsrftoken()
        try {

            const response = await axios.post(`http://localhost:8000/api/addrooms/`,
                JSON.stringify(roomDetails)
                ,
                {
                    headers: { "X-CSRFToken": csrftoken.value, 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            if (response.data.status == "successful") {
                console.log("Room added")
                // alert("Deleted Successfully")
                setIsPopupOpen(false)
                setroomDetails({
                    name: "",
                    description: ""
                });
                setrefreshKey((currentvalue) => currentvalue + 1)


            }
        } catch (err) {
            console.log(err.message)
        }

    }

    const enterRoom = (roomname) => {
        router.push(`/roomstats/${roomname}`);
    }

    return (
        <Layout>
            <div className="min-h-screen p-4 md:p-8">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Total Rooms: {totalRooms}
                    </h1>

                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex text-center justify-center gap-2" onClick={() => setIsPopupOpen(true)}>
                        <FaPlus className="text-white mt-1"></FaPlus>Add Room
                    </button>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left text-gray-800">Room ID</th>
                                <th className="px-4 py-2 text-left text-gray-800">Room Name</th>
                                <th className="px-4 py-2 text-left text-gray-800">Created At</th>
                                <th className="px-4 py-2 text-left text-gray-800">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(rooms && rooms.length > 0 ? rooms : []).map((room, index) => (
                                <tr
                                    key={room.id}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                                >
                                    <td className="border px-4 py-2">{room.id}</td>
                                    <td className="border px-4 py-2">{room.name}</td>
                                    <td className="border px-4 py-2">{room.created_at}</td>
                                    <td className="border px-4 py-2 flex flex-row gap-2">
                                        <div className="min-h-full flex space-x-4 justify-center items-center">
                                            <button className="text-blue-500 hover:text-blue-700 inline-block w-4 h-6" onClick={() => enterRoom(room.name)}>
                                                <FaEye />
                                            </button>

                                            <button className="text-red-500 hover:text-red-700 inline-block w-4 h-6" onClick={() => handleDelete(room.name)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full p-2">
                        <h3 className="text-xl font-bold mb-4">Create a Room</h3>
                        <input
                            type="text"
                            name="name"
                            value={roomDetails.name}
                            onChange={handleInputChange}
                            className="border border-gray-300 p-3 m-2 w-full rounded-md focus:outline-none"
                            placeholder="Room Name"
                            required
                        />
                        <input
                            type="text"
                            name="description"
                            value={roomDetails.description}
                            onChange={handleInputChange}
                            className="border border-gray-300 p-3 m-2 w-full rounded-md focus:outline-none"
                            placeholder="Description "
                            required
                        />
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                onClick={() => {
                                    setIsPopupOpen(false);
                                    setroomDetails({
                                        name: "",
                                        description: ""
                                    });
                                }}
                            >
                                Cancel
                            </button>
                            <button className="bg-purple-600 text-white px-4 py-2 rounded-md" onClick={handleRoomAdd}>Add Room</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
