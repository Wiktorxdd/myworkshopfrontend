import { NextResponse} from 'next/server'


export async function getPosts() {
    const response = await fetch('http://localhost/api/post', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    return data;
    
}


export async function getPost(id: any) {
    const response = await fetch(`http://localhost/api/post/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    console.log(id);
    if (!response.ok) {
        throw new Error('Failed to fetch post');
    }

    const data = await response.json();
    return data;

}

export async function getUserPosts(userId: any) {
    const response = await fetch(`http://localhost/api/post?user_id=${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    console.log(data);
    return data;
}

export async function createPost(title: string, content: string) {
    const response = await fetch('http://localhost/api/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            title,
            content
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create post');
    }

    const data = await response.json();
    return data;
}

export async function deletePost(id: any) {
    const response = await fetch(`http://localhost/api/post/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete post');
    }

    return response;
}

export async function editPost(id: any, title: string, content: string) {
    const response = await fetch(`http://localhost/api/post/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            title,
            content
        })
    });

    if (!response.ok) {
        throw new Error('Failed to edit post');
    }

    const data = await response.json();
    return data;
}