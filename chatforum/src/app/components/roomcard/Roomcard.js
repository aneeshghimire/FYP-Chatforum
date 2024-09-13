import React from 'react'

export default function Roomcard({ name, description }) {
    return (
        <div className="group relative bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col">
            <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-yellow-300">
                {name}
            </h3>
            <p className="text-sm mb-4 text-gray-200 group-hover:text-white">
                {description}
            </p>
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium transition duration-300 ease-in-out transform hover:bg-indigo-500 hover:text-white hover:scale-105">Join Room</button>
        </div>
    );
}
