import { NextResponse } from 'next/server';
import communitydata from '@/communitydata.json';

export async function getGroups() {
    const response = await fetch(`http://localhost:80/api/group?perPage=10&page=1`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch groups")
    }

    const data = await response.json();

    console.log(data);
    return data;
}

export async function getGroupById(id: any) {
    const response = await fetch(`http://localhost:80/api/group/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${localStorage.getItem('token')}`
        }
    })

    if (!response.ok){
        throw new Error("failed to fetch group")
    }

    const data = await response.json();

    return data;
}

export async function createGroup(catId: any, name: string, description: string) {
    const response = await fetch(`http://localhost:80/api/group`, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            catId,
            name,
            description
        })
    })

    if (!response.ok) {
        throw new Error("failed to create group")
    }

    const data = await response.json();
    return data;
}

export async function deleteGroup(id: any) {
    const response = await fetch(`http://localhost:80/api/group/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })

    if (!response.ok) {
        throw new Error("failed to delete group")
    }

    const data = await response.json();
    return data;
}

export async function updateGroup(id: any, catId: any, name: string, description: string) {
    const response = await fetch(`http://localhost:80/api/group/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            catId,
            name,
            description
        })
    })

    if (!response.ok) {
        throw new Error("failed to update group")
    }

    const data = await response.json();
    return data;
}