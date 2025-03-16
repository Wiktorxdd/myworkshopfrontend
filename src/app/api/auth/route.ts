import { NextResponse} from 'next/server'

export async function logIN(email, password){
    const response = await fetch('http://localhost/api/log-in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error('Invalid credentials');
    }

    const data = await response.json();
    return data;
}

export async function logOut(){
    const token = localStorage.getItem("token");
    const response = await fetch('http://localhost:80/api/user/log-out', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
    
    return response;
}