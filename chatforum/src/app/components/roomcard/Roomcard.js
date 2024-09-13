import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import getcsrftoken from "@/helpers/getcsrftoken";
import axios from "axios";

export default function Roomcard({ name, description}) {
  const router= useRouter()
  const joinroom = async () => {
    const room_name = name;
    try {
      let csrftoken = await getcsrftoken()
      const response = await axios.get(
        `http://localhost:8000/api/${room_name}/joinroom/`,
        {
          headers: {
            "X-CSRFToken": csrftoken.value, // Include the CSRF token in the request headers
          },
          withCredentials: true,
        }
      );
      if (response.data.status == "successful") {
        router.push(`/rooms/${name}`)
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className="group relative bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col">
      <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-yellow-300">
        {name}
      </h3>
      <p className="text-sm mb-4 text-gray-200 group-hover:text-white">
        {description}
      </p>
      <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium transition duration-300 ease-in-out transform hover:bg-indigo-500 hover:text-white hover:scale-105" onClick={joinroom}>Join Room</button>
    </div>
  );
}
