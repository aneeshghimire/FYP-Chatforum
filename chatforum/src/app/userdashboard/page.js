"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import getcsrftoken from '@/helpers/getcsrftoken';



export default function UserDashboard() {
    const [profileurl, setProfileUrl]= useState('')
    const [profiledetails,setProfileDetails]= useState({})

  useEffect(()=>{
    getUserProfile()
  },[])

  const getUserProfile= async ()=>{

    const csrftoken = await getcsrftoken();
    const response= await axios.get("http://localhost:8000/api/getprofiledata/",
        {
            headers: {
                "X-CSRFToken": csrftoken.value, // Include the CSRF token in the request headers
              },
            withCredentials:true,
        }
    )  
    console.log("Hello")
    setProfileUrl(response.data.profile.profile_picture_url)
    setProfileDetails(response.data.user)
    console.log(response)
  }
  return (
    <div>
      <img src={profileurl} className=' w-32 h-32 rounded-full' alt="profile_picture"/>
      <div>Welcome <span>{profiledetails.username}</span></div>
    </div>
  )
}
