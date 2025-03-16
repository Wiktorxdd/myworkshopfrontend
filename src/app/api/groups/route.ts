import { NextResponse } from 'next/server';
import communitydata from '@/communitydata.json';

export async function getGroups(page = 1) {
    const response = await fetch(`http://localhost:80/api/group?perPage=10&page=${page}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch groups")
    }

    const data = await response.json();

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

export async function createGroup(formData: FormData) {
    const response = await fetch(`http://localhost:80/api/group`, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${localStorage.getItem('token')}`,
        },
        body: formData
    })

    if (!response.ok) {
        throw new Error(`failed to create group: ${response.statusText}`)
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

export async function updateGroup(formData: FormData, id: any) {
    const response = await fetch(`http://localhost:80/api/group/${id}?_method=patch`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
    })

    if (!response.ok) {
        throw new Error("failed to update group")
    }

    const data = await response.json();
    return data;
}

export async function getGroupMembers(id: any) {
    const response = await fetch(`http://localhost:80/api/group/follow/${id}/count`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })

    if (!response.ok) {
        throw new Error("failed to fetch group members")
    }

    const data = await response.json();
    return data;
}

export async function followGroup(id:any) {
    const response = await fetch(`http://localhost:80/api/group/follow/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })

    if(!response.ok) {
        throw new Error("failed to follow group")
    }

    const data = await response.json()
    return data;
}

export async function isFollowingGroup(id:any) {
    const response = await fetch(`http://localhost:80/api/group/follow/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })

    if(!response.ok) {
        throw new Error("failed to follow group")
    }

    const data = await response.json()
    return data;
}