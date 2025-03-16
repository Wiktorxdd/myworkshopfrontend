import { error } from 'console';
import { NextResponse} from 'next/server'


export async function getPosts(page = 1) {
    const response = await fetch(`http://localhost/api/post?page=${page}`, {
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

export async function getGroupPosts(id: any, page = 1) {
    const response = await fetch(`http://localhost/api/post?page=${page}&group_id=${id}`, {
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
    if (!response.ok) {
        throw new Error('Failed to fetch post');
    }

    const data = await response.json();
    return data;

}

export async function getUserPosts(userId: any, page = 1) {
    const response = await fetch(`http://localhost/api/post?page=${page}&user_id=${userId}`, {
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

export async function createPost(formData: FormData) {
    const response = await fetch('http://localhost:80/api/post', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    });


    if (!response.ok) {
        throw new Error(`Failed to create post: ${response.url}`);
    }

    const data = await response.json();
    return data;
}

export async function createGroupPost(formData: FormData) {
    const response = await fetch('http://localhost:80/api/post', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    });


    if (!response.ok) {
        throw new Error(`Failed to create post: ${response.url}`);
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

export async function editPost(formData: FormData, id: any) {
    const response = await fetch(`http://localhost/api/post/${id}?_method=patch`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to edit post');
    }

    const data = await response.json();
    return data;
}

export async function likePost(id: any) {
    const response = await fetch(`http://localhost:80/api/like/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to edit post');
    }

    const data = await response.json();
    return data;
}

export async function unlikePost(id: any ){
    const response = await fetch(`http://localhost:80/api/like/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to edit post');
    }

    const data = await response.json();
    return data;
}

export async function getPostLikes(id: any) {
    const response = await fetch(`http://localhost:80/api/like/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to edit post');
    }

    const data = await response.json();
    return data;
}

export async function getUserPostLikes(id: any) {
    const response = await fetch(`http://localhost:80/api/like/user/${id}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch like")
    }

    const data = await response.json();

    return data;
}

export async function getPostComments(id: any){
    const response = await fetch(`http://localhost:80/api/comment/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to edit post');
    }

    const data = await response.json();
    return data;
}

export async function createComment(id: any, content: string){
    const response = await fetch(`http://localhost:80/api/comment/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            content
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create post');
    }

    const data = await response.json();
    return data;
}

export async function deleteComment(id: any){
    const response = await fetch(`http://localhost:80/api/comment/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete comment');
    }

    const data = await response.json();
    return data;
}

export async function editComment(id: any, content: string) {
    const response = await fetch(`http://localhost:80/api/comment/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            content
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create post');
    }

    const data = await response.json();
    return data;
}

export async function sharePost(id: any) {
    const response = await fetch(`http://localhost:80/api/share/${id}`,{
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if(!response.ok) {
        throw new Error('failed to share post')
    }

    const data = await response.json();
    return data;
}

export async function getSharesPost(id: any) {
    const response = await fetch(`http://localhost:80/api/share/${id}`,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if(!response.ok) {
        throw new Error('failed to fetch shares')
    }

    const data = await response.json();
    return data;
}

export async function deleteSharePost(id: any) {
    const response = await fetch(`http://localhost:80/api/share/${id}`,{
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if(!response.ok) {
        throw new Error('failed to fetch shares')
    }

    const data = await response.json();
    return data;
}