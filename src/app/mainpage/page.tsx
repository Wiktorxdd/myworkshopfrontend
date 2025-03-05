'use client';

import { Suspense, useState, useEffect, useCallback } from "react";
import { getPosts, deletePost } from "@/app/api/posts/route";
import { getCurrentUser } from "@/app/api/users/route";
import LikeIcon from "@/components/svgs/like";
import CommentIcon from "@/components/svgs/comment";
import EditIcon from "@/components/svgs/edit";
import DeleteIcon from "@/components/svgs/delete";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import NewPost from "@/components/NewPost";

const PostItem = React.memo(({ post, handleClick, likes, currentUser, handleDelete }) => (
    <li className="border bg-neutral-100 shadow-lg rounded-md p-5 m-5">
        <div>
            <Link className="underline text-blue-600" href={`/profile/${post.user_id}`}>
                {post.user_id}
            </Link>
        </div>
        <Link className="block mt-2 text-xl font-bold" href={`/post/${post.id}`}>
            {post.title}
        </Link>
        <p className="mt-2 text-gray-700 break-words line-clamp-2">{post.content}</p>
        <div className="mt-4 flex items-center space-x-5">
            <button onClick={handleClick} className="flex items-center space-x-2 text-red-600 hover:text-red-800">
                <LikeIcon />
                <span>{likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <CommentIcon />
                <span>Comment</span>
            </button>
            {post.user_id == currentUser && (
                <button className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-700">
                    <EditIcon />
                    <span>Edit</span>
                </button>
            )}
            {post.user_id == currentUser && (
                <button className="flex items-center space-x-2 text-red-800 " onClick={() => handleDelete(post.id)}>
                    <DeleteIcon />
                    <span>Delete</span>
                </button>
            )}
        </div>
    </li>
));

export default function Home() {
    const router = useRouter();
    const [likes, setLikes] = useState(0);
    const [posts, setPosts] = useState([]);
    const currentUser = localStorage.getItem('currentUser');

    const handleClick = useCallback(() => {
        setLikes(likes + 1);
    }, [likes]);

    const handleDelete = async (id) => {
        await deletePost(id);
        setPosts(posts.filter(posts => posts.id !== id));
        router.refresh();
    };

    

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts = await getPosts();
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
                <main className="grid grid-cols-3 divide-x-4 divide-gray-100">
                    <div></div>
                    <ul className="flex flex-col space-y-10 mb-5">
                        {posts.map((post: any) => (
                            <PostItem key={post.id} post={post} handleClick={handleClick} likes={likes} currentUser={currentUser} handleDelete={handleDelete}/>
                        ))}
                    </ul>
                    <div></div>
                </main>
            </div>
        </Suspense>
    );
}