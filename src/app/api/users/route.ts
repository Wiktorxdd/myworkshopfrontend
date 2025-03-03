import { NextResponse} from 'next/server'
import userdata from '@/userdata.json';

export async function usersGet() {
    return NextResponse.json({
        userdata
    });
}

export async function getCurrentUser() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost/api/user/current-user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error('Not authorized');
    }

    const user = await response.json();
    return user;
}
