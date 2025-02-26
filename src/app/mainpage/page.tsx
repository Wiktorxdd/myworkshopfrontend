'use client';

import { Suspense, useState, useEffect, useCallback } from "react";
import { getPosts } from "@/app/api/posts/route";
import LikeIcon from "@/components/svgs/like";
import CommentIcon from "@/components/svgs/comment";
import Link from "next/link";
import React from "react";
import NewPost from "@/components/NewPost";

const PostItem = React.memo(({ post, handleClick, likes}) => (
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

export default function Home() {
    const [likes, setLikes] = useState(0);
    const [posts, setPosts] = useState([]);

    const handleClick = useCallback(() => {
        setLikes(likes + 1);
    }, [likes]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getPosts();
                const posts = await response.json();
                setPosts(posts.data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <div className="min-h-screen flex flex-col">
                <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
                    The Main Page
                </header>
                <main className="flex-grow flex items-center justify-center p-12">
                    <ul className="flex flex-col space-y-6">
                        {posts.map((post: any) => (
                            <PostItem key={post.id} post={post} handleClick={handleClick} likes={likes} />
                        ))}
                    </ul>
                </main>
                <div className=""><NewPost /></div>
                <footer className="bg-gray-800 text-white p-4 text-center">
                    © 2025 Wiktor Kevin Marcus
                </footer>
            </div>
        </Suspense>
    );
}