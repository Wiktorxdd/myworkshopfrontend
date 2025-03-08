import { NextResponse} from 'next/server'


export async function getUserId(id: any) {
    console.log(id);
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost/api/user/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const user = await response.json();
    return user;
}

export async function EditUser(id: any, name: string, email: string, password: string, password_confirmation: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost/api/user/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

export async function Deleteuser(id: any ){
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost/api/user/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}
