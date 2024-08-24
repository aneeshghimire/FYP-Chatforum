"use client"
import { useState,useEffect } from "react";
import React from 'react'

export default function Datafetch() {
    const [items, setItems] = useState([]);

    useEffect(() => {
      // Fetch data from Django API
      fetch('http://localhost:8000/api/items/')
        .then(response => response.json())
        .then(data => setItems(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);
  return (
    <div>
    <h1>Items List</h1>
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <h2>{item.name}</h2>
          <p>{item.description}</p>
        </li>
      ))}
    </ul>
  </div>
  )
}
