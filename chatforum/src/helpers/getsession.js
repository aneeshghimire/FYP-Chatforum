"use server"
import { cookies } from "next/headers"

export default async function getsession() {
    const cookieStore = cookies()
    const sessionid = cookieStore.get("sessionid");
    return sessionid;
}