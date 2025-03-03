'use client';

import { getPost } from "@/app/api/posts/route";
import { useState, useEffect, useCallback } from 'react';
import { use } from "react";
import LikeIcon from "@/components/svgs/like";
import CommentIcon from "@/components/svgs/comment";
import Link from "next/link";
import React from "react";


const PostItem = React.memo(({ post, handleClick, likes }) => (
    <li className="border bg-neutral-100 shadow-lg rounded-md p-5 m-5">
        <div>
            <Link className="underline text-blue-600" href={`/profile/${post.userId}`}>
                {post.author}
            </Link>
        </div>
        <Link className="block mt-2 text-xl font-bold" href={`/post/${post.id}`}>
            {post.title}
        </Link>
        <p className="mt-2 text-gray-700">{post.content}</p>
        <div className="mt-4 flex items-center space-x-5">
            <button onClick={handleClick} className="flex items-center space-x-2 text-red-600 hover:text-red-800">
                <LikeIcon />
                <span>{likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <CommentIcon />
                <span>Comment</span>
            </button>
        </div>
    </li>
));

export default function PostId({ params }) {
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

    const handleClick = useCallback(() => {
        setLikes(likes + 1);
    }, [likes]);


    return (
        <main className="flex items-center justify-center p-12">
            <ul className="flex flex-col space-y-6">
                {post.map((post: any) => (
                    <PostItem key={post.id} post={post} handleClick={handleClick} likes={likes} />
                ))}
            </ul>
        </main>
    )
}