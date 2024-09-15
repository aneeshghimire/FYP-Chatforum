import { NextResponse } from 'next/server';
import getsession from './helpers/getsession';
import { redirect } from 'next/dist/server/api-utils';


export async function middleware(request) {
    const session = await getsession()
    const path = request.nextUrl.pathname
    const isPublicPath = path === '/login' || path === '/'
    const isPrivatePath = path === '/userdashboard' || path === 'uploadprofilepicture' || path === '/rooms' || path === '/adminpanel'
    if (isPublicPath && session) {
        return NextResponse.redirect(new URL('/userdashboard', request.url))
    }


    if (isPrivatePath && !session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

}

export const config = {
    matcher: ['/', '/login', '/uploadprofilepicture', '/userdashboard', '/adminpanel'],
};
