'use client';

import { getPost } from "@/app/api/posts/route";
import { useState, useEffect } from 'react';
import { use } from "react";

export default function PostId ({ params }) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const [post, setPost] = useState([]);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        const FetchPost = async () => {
            const response = await getPost(id);
            const post = await response.json();

            setPost(post.post);
        };
        FetchPost();
    }, [id]);

    function handleLike() {
        setLikes(likes + 1);
    }


    return (
        <main className="flex items-center justify-center p-12">
            <div className="border bg-neutral-100 shadow-lg h-80 w-2/5 rounded-lg">
                {post.map((post: any) => (
                    <div key={post.id}>
                        <h1 className="p-1">{post.title}</h1>
                        <p className="p-1">{post.author}</p>
                        <p className="m-5 break-words p-10 border bg-white shadow-md ">{post.content}</p>
                    </div>
                ))}
                <button onClick={handleLike} className="ml-5 mt-10 border rounded bg-cyan-400 p-1">Like</button>
                <p className="ml-5">{likes}</p>
            </div>
        </main>
    )
}