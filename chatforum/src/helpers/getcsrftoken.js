"use server"
import axios from "axios";
import { cookies } from 'next/headers';

export default async function getcsrftoken() {
    const cookieStore = cookies()
    const token = cookieStore.get('csrftoken')
    console.log('Token:', token);

    return token
}